class LoadingIndicator extends HTMLElement {
    constructor() {
        super();

        // Buat shadow DOM
        this.attachShadow({ mode: "open" });

        // Tambahkan HTML dan CSS untuk komponen loading
        this.shadowRoot.innerHTML = `
            <style>
                .spinner {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    border: 6px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: #5356FF;
                    animation: spin 1s ease-in infinite;
                }

                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            </style>
            <div class="spinner"></div>
        `;
    }
}

// Daftarkan custom element loading-indicator
customElements.define("loading-indicator", LoadingIndicator);

export default loadingComponents;