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














    let deferredPrompt; // Store the event

    // Listen for the 'beforeinstallprompt' event
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); // Prevent the default mini-infobar
        deferredPrompt = event; // Save the event for later use

        // Optionally, you can display a custom message or icon indicating that the app can be installed.
    });

    // Example: Trigger the prompt when the user clicks on a specific element (like a settings icon)
    document.getElementById("homeMain").addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the install prompt

            // Handle the user's response to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the install prompt");
                } else {
                    console.log("User dismissed the install prompt");
                }
                deferredPrompt = null; // Reset the deferred prompt
            });
        }
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
