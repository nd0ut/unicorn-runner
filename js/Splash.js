export function splash(text, {timeout = 1000, size = 100, color = 'white', background = 'transparent'} = {}) {
    const textDiv = document.querySelector('.splash-text');
    const blockDiv = document.querySelector('.splash-block');
    
    return new Promise(resolve => {        
        blockDiv.style = `background-color: ${background}`;

        textDiv.style = `font-size: ${size}pt; color: ${color};`;
        textDiv.innerHTML = text;
        textDiv.classList.toggle('splash-text--hide', false);            
        textDiv.classList.toggle('splash-text--show', true);

        setTimeout(() => {
            textDiv.classList.toggle('splash-text--show', false);            
            textDiv.classList.toggle('splash-text--hide', true);            
            setTimeout(() => {
                resolve();                 
            }, 300);
        }, timeout);
    })
}
