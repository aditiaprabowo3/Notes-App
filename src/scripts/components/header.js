class HeaderElement extends HTMLElement {
  constructor() {
    super();

    // Buat shadow DOM
    this.attachShadow({ mode: "open" });

    // Definisikan konten di dalam shadow DOM
    const title = this.getAttribute("title");
    this.shadowRoot.innerHTML = `
          <style>
            h1 {
              font-size: 28px;
              font-family: "Roboto", sans-serif;
            }
          </style>
          
          <h1>${title}</h1>
        `;
  }
}

// Daftarkan custom element
customElements.define("header-element", HeaderElement);
