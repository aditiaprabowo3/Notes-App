// form components
class AddNoteForm extends HTMLElement {
    constructor() {
        super();

        // Buat shadow DOM
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
        <style>
          input[type="text"],
          textarea {
              width: 100%;
              box-sizing: border-box;
              font-size: 18px;
              margin-top: 14px;
              font-family: "Roboto", sans-serif;
          }

          form {
            background-color: #fff;
            padding: 12px 40px 40px 40px;
            border-radius: 24px;
            margin-top: 40px;
          }

          #noteForm .form-group:nth-child(2) {
            margin-top: 20px;
          }

          .form-group label {
            font-size: 18px;
            font-weight: 500;
          }

          input[type="text"]:focus,
          textarea:focus {
              border-width: 2px;
              border-color: #5356FF; 
              box-shadow: 0 0 5px rgba(83, 86, 255, 0.5);
          }

          input[type="text"]:active,
          textarea:active {
              border-width: 2px;
              border-color: #5356FF; 
              box-shadow: 0 0 5px rgba(83, 86, 255, 0.5); 
          }

          .input-title {
            padding: 18px;
            border-radius: 12px;
            outline: none;
            border: 1.4px solid #c7c7c9;
          }
          
          .input-body {
            outline: none;
            border: 1.4px solid #c7c7c9;
            border-radius: 12px;
            padding: 14px;
          }

          button {
              padding: 5px 10px;
              width: 100%;
              margin-top: 32px;
              padding: 18px;
              cursor: pointer;
              border: none;
              font-size:  18px;
              font-weight: 500;
              background-color: #5356FF;
              border-radius: 12px;
              color: #fff;
          }

          button:hover {
            background-color: #1619d9;
          }

          .validation-message {
            color: red;
            font-size: 16px;
            margin-top: 4px;
          }

          .title-section {
            text-align: center;
            margin-bottom: 54px;
          }
        </style>

        <form id="noteForm">
            <div class="title-section">
                <h1>Silahkan Buat Catatan</h1>
            </div>
            <div class="form-group">
              <label for="noteTitle">Judul Catatan</label>
              <input type="text" name="noteTitle" autocomplete="off" required class= "input-title" id="noteTitle" placeholder="Judul Catatan">
              <p id="titleValidation" class="validation-message" aria-live="polite"></p>
            </div>

            <div class="form-group">
              <label for="noteBody">Isi Catatan</label>
              <textarea id="noteBody" cols="50" rows="10" class= "input-body" placeholder="Isi Catatan" required></textarea>
              <p id="bodyValidation" class="validation-message" aria-live="polite"></p>
            </div>

            <button type="submit" id="add-btn">Tambah Catatan</button>
        </form>
    `;

        // Ambil elemen form dari shadow DOM
        this.form = this.shadowRoot.querySelector("#noteForm");

        // Ambil elemen input judul, isi catatan, dan validasi dari shadow DOM
        this.noteTitleInput = this.shadowRoot.querySelector("#noteTitle");
        this.noteBodyInput = this.shadowRoot.querySelector("#noteBody");
        this.titleValidation = this.shadowRoot.querySelector("#titleValidation");
        this.bodyValidation = this.shadowRoot.querySelector("#bodyValidation");

        // Tambahkan event listener untuk penanganan perubahan input
        this.noteTitleInput.addEventListener(
            "input",
            this.onInputChange.bind(this),
        );
        this.noteBodyInput.addEventListener("input", this.onInputChange.bind(this));

        // Tambahkan event listener untuk penanganan pengiriman formulir
        this.form.addEventListener("submit", this.onSubmit.bind(this));
    }

    // Fungsi untuk menangani perubahan input
    onInputChange() {
        const noteTitle = this.noteTitleInput.value.trim(); // Hapus spasi ekstra dari input
        const noteBody = this.noteBodyInput.value.trim(); // Hapus spasi ekstra dari input

        // Validasi judul catatan
        if (noteTitle === "") {
            this.titleValidation.textContent = "Judul catatan tidak boleh kosong";
        } else {
            this.titleValidation.textContent = ""; // Kosongkan pesan validasi jika input valid
        }

        // Validasi isi catatan
        if (noteBody === "") {
            this.bodyValidation.textContent = "Isi catatan tidak boleh kosong";
        } else {
            this.bodyValidation.textContent = ""; // Kosongkan pesan validasi jika input valid
        }
    }

    // Fungsi untuk menangani pengiriman formulir
    onSubmit(e) {
        e.preventDefault();

        // Ambil nilai dari input judul dan isi catatan
        const noteTitle = this.shadowRoot.querySelector("#noteTitle").value.trim();
        const noteBody = this.shadowRoot.querySelector("#noteBody").value.trim();

        // Validasi judul catatan sebelum mengirimkan detail catatan
        if (noteTitle === "") {
            this.titleValidation.textContent = "Judul catatan tidak boleh kosong";
            return; // Berhenti dari pengiriman formulir jika validasi gagal
        }

        // Validasi isi catatan sebelum mengirimkan detail catatan
        if (noteBody === "") {
            this.bodyValidation.textContent = "Isi catatan tidak boleh kosong";
            return; // Berhenti dari pengiriman formulir jika validasi gagal
        }

        // Kirim nilai ke luar komponen
        this.dispatchEvent(
            new CustomEvent("addNote", {
                detail: { title: noteTitle, body: noteBody },
            }),
        );

        // Reset nilai input setelah pengiriman formulir
        this.form.reset();
    }
}

// Daftarkan custom element form
customElements.define("form-element", AddNoteForm);