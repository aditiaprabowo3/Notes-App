class FooterCustom extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" }); // Attach shadow DOM
        const text = this.getAttribute("text") || "Custom Footer"; // Ambil nilai custom attribute 'text'
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    text-align: center;
                    padding: 24px 0;
                    background-color: #5356FF;
                    font-weight: 500;
                    font-size: 18px;
                    color: #FFFF;
                    margin-top: 100px;
                }
            </style>

            <footer>${text}</footer>
        `;
    }
}

customElements.define("footer-custom", FooterCustom);