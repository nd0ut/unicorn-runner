export function splashText(text) {
    const div = document.querySelector('.splash-text');
    
    return new Promise(resolve => {
        const timeout = 1000;
        
        div.innerHTML = text;
        div.classList.toggle('splash-text--show', true);

        setTimeout(() => {
            div.classList.toggle('splash-text--show', false);            
            resolve();
        }, timeout);
    })
}
