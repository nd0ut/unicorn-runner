export function splashText(text, timeout = 1000, size = 100, color = 'white') {
    const div = document.querySelector('.splash-text');
    
    return new Promise(resolve => {        
        div.style = `font-size: ${size}pt; color: ${color};`;
        div.innerHTML = text;
        div.classList.toggle('splash-text--show', true);

        setTimeout(() => {
            div.classList.toggle('splash-text--show', false);            
            resolve();
        }, timeout);
    })
}
