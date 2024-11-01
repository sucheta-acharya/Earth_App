document.addEventListener("DOMContentLoaded", function() {
    
    const mapMain= document.getElementById("mapMain");
    const cameraMain = document.getElementById("cameraMain");
    const homeMain = document.getElementById("homeMain");
    const newsMain = document.getElementById("newsMain");
    const settingsMain = document.getElementById("settingsMain");

    const radioButtons = document.querySelectorAll('input[name="radio"]');

    // Add an event listener to each radio button
    radioButtons.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                // Get the label (img alt attribute) corresponding to the checked radio button
                const label = radio.nextElementSibling.getAttribute('alt');
                if (label === 'map') {
                    mapMain.style.display = 'flex';
                    cameraMain.style.display = 'none';
                    homeMain.style.display = 'none';
                    newsMain.style.display = 'none';
                    settingsMain.style.display = 'none';
                } else if (label === 'camera') {
                    mapMain.style.display = 'none';
                    cameraMain.style.display = 'flex';
                    homeMain.style.display = 'none';
                    newsMain.style.display = 'none';
                    settingsMain.style.display = 'none';
                } else if (label === 'home') {
                    mapMain.style.display = 'none';
                    cameraMain.style.display = 'none';
                    homeMain.style.display = 'flex';
                    newsMain.style.display = 'none';
                    settingsMain.style.display = 'none';
                } else if (label === 'news') {
                    mapMain.style.display = 'none';
                    cameraMain.style.display = 'none';
                    homeMain.style.display = 'none';
                    newsMain.style.display = 'flex';
                    settingsMain.style.display = 'none';
                } else if (label === 'settings') {
                    mapMain.style.display = 'none';
                    cameraMain.style.display = 'none';
                    homeMain.style.display = 'none';
                    newsMain.style.display = 'none';
                    settingsMain.style.display = 'flex';
                }
            }
        });
    });


    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/static/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
});
