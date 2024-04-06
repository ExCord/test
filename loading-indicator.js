class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'closed' });
    const indicator = document.createElement('div');
    indicator.classList.add('lds-ring');

    for (let i = 0; i < 4; i++) {
      const innerDiv = document.createElement('div');
      indicator.appendChild(innerDiv);
    }
    indicator.style.color = '#1c4c5b';
    shadow.appendChild(indicator);
  }
}

customElements.define('loading-indicator', LoadingIndicator);