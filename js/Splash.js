export function splashText(text) {
    const div = document.querySelector('.splash-text');
    div.innerHTML = text;
    div.classList.toggle('splash-text--show');
}
