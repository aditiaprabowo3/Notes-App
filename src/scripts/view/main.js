import Swal from 'sweetalert2'
import { gsap } from "gsap";

const main = () => {
    const baseUrl = "https://notes-api.dicoding.dev/v2";

    // fungsi get notes
    const getNotes = async() => {
        try {
            const response = await fetch(`${baseUrl}/notes`);
            const responseJSON = await response.json();

            if (responseJSON.error) {
                showResponseMessage(responseJSON.message);
            } else {
                renderAllNotes(responseJSON.data);
            }
        } catch (error) {
            showResponseMessage('Failed to fetch notes. Please try again.');
        }
    };

    // fungsi insert note
    const insertNotes = async(note) => {
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(note),
            };

            const response = await fetch(`${baseUrl}/notes`, options);
            const responseJson = await response.json();
            // showResponseMessage(responseJson.message);
            console.log(responseJson);
            messageData(responseJson.message);
            getNotes();
        } catch (error) {
            showResponseMessage('Failed to insert note. Please try again.');
        }
    };

    // fungsi remove note
    const removeNotes = async(noteId) => {
        try {
            const options = {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },

                // mengubah objek JavaScript menjadi format JSON
                body: JSON.stringify(noteId),
            };
            const response = await fetch(`${baseUrl}/notes/${noteId}`, options);
            const responseJson = await response.json();
            console.log(responseJson);
            // showResponseMessage(responseJson.message);
            if (responseJson.status == "success") {
                messageDelete(responseJson.message);
            }
            getNotes();
        } catch (error) {
            showResponseMessage('Failed to remove note. Please try again.');
        }
    };

    // render all note
    const renderAllNotes = (notes) => {
        // Mengambil elemen daftar catatan dari DOM
        const listNoteElement = document.querySelector("#listnote");
        // Mengosongkan isi elemen daftar catatan
        listNoteElement.innerHTML = "";

        // Looping melalui setiap catatan dalam array 'notes'
        notes.forEach((note, index) => {
            // Membuat elemen div baru untuk kartu catatan
            const cardElement = document.createElement("div");

            // Menambahkan kelas 'note-item' ke elemen kartu
            cardElement.classList.add("note-item");

            // Animasi menggunakan GSAP untuk muncul dari atas ke bawah
            gsap.fromTo(
                cardElement, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, delay: index * 0.1 }
            );

            // Format tanggal catatan
            const formattedDate = formatDate(note.createdAt);

            // Mengisi konten kartu catatan
            cardElement.innerHTML = `
                <div class="note-header">
                    <h1 class="note-item-title">${note.title}</h1>
                    <p class="note-item-date">${formattedDate}</p>
                    <p class="note-item-body">${note.body}</p>
                    <button class="button-delete" id="${note.id}">Delete</button>
                </div>
            `;

            // Menambahkan kartu catatan ke elemen daftar catatan
            listNoteElement.appendChild(cardElement);
        });

        // Menambahkan event listener pada tombol hapus di setiap kartu catatan
        const buttons = document.querySelectorAll(".button-delete");
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                // Mendapatkan ID catatan yang akan dihapus
                const noteId = event.target.id;
                // Memanggil fungsi untuk menghapus catatan
                removeNotes(noteId);
            });
        });
    };

    // format tanggal
    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            // minute: "numeric",
            // second: "numeric",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    // swet alert
    // swet alert untuk menampilkan pesan error
    const showResponseMessage = (message = "Check your internet connection") => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
        });
    };

    const messageData = (message = "Check your internet connection") => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: ` ${message}`,
            showConfirmButton: false,
            timer: 1500,
        });
    };

    // untuk menampilkan alert ketika delete
    const messageDelete = async(noteId, message = "Delete Successfully!") => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                // Panggil removeNotes di sini setelah pengguna mengklik tombol "Yes, delete it!" di alert
                await removeNotes(noteId);
                await Swal.fire({
                    title: "Deleted!",
                    text: `${message}`,
                    icon: "success",
                    timer: 1500,
                    timerProgressBar: true,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false, // Hide "OK" button
                    showClass: {
                        popup: "swal2-noanimation",
                        backdrop: "swal2-noanimation",
                    },
                    hideClass: {
                        popup: "",
                        backdrop: "",
                    },
                });
                // getNotes(); Refresh notes after deletion
            } catch (error) {
                showResponseMessage('Failed to delete note. Please try again.');
            }
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        // Memanggil elemen <form-element> dari DOM
        const formElement = document.querySelector("form-element");

        // Memanggil elemen loading indicator dari DOM
        const loadingIndicator = document.querySelector("loading-indicator");

        // Memeriksa apakah elemen <form-element> ditemukan
        if (!formElement) {
            console.error("Element <form-element> not found!");
            return;
        }

        // Memanggil elemen input dan tombol dari shadow DOM <form-element>
        const inputnoteTitle = formElement.shadowRoot.querySelector("#noteTitle");
        const inputnoteBody = formElement.shadowRoot.querySelector("#noteBody");
        const buttonSave = formElement.shadowRoot.querySelector("#add-btn");

        // Menambahkan event listener pada tombol save
        buttonSave.addEventListener("click", async function() {
            // cek form kosong atau tidak
            if (!inputnoteTitle.value.trim() || !inputnoteBody.value.trim()) {
                return;
            }

            // Menampilkan indikator loading saat proses
            loadingIndicator.style.display = "block";

            // Membuat string acak untuk digunakan
            const randomText = generateRandomString(10) + "-" + generateRandomString(10);

            try {
                // Membuat objek note dari input pengguna
                const note = {
                    title: inputnoteTitle.value,
                    body: inputnoteBody.value,
                    // archived: false,
                    // createdAt: new Date().toISOString(),
                };

                // Menyisipkan note baru menggunakan API insertNotes
                await insertNotes(note);

                // Mengosongkan form setelah penyisipan berhasil
                resetForm();
            } catch (error) {
                console.log(error);
            } finally {
                // Menyembunyikan indikator loading setelah proses selesai
                loadingIndicator.style.display = "none";
            }
        });

        // Fungsi untuk menghasilkan string acak
        function generateRandomString(length) {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
            let result = "";
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        // Fungsi untuk mengosongkan form setelah penyisipan berhasil
        const resetForm = () => {
            inputnoteTitle.value = "";
            inputnoteBody.value = "";
        };

        // Menampilkan indikator loading saat halaman dimuat
        loadingIndicator.style.display = "block";

        // Menyembunyikan indikator loading setelah konten yang relevan selesai dimuat
        window.addEventListener("load", () => {
            loadingIndicator.style.display = "none";
        });

        // Memanggil fungsi getNotes untuk mendapatkan catatan saat halaman dimuat
        getNotes();
    });

}

export default main;