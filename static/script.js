document.addEventListener("DOMContentLoaded", function() {
    let deferredPrompt; // To store the event

    // Listen for the 'beforeinstallprompt' event
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); // Prevent the default prompt display
        deferredPrompt = event; // Save the event for triggering the prompt later

        // Show the install prompt immediately when the event is captured
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the prompt
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

    // Regular button event listeners
    const elementIds = [
        "emergancyButton",
        "profileImage",
        "profileNameText",
        "profileAddressText",
        "addressPinIcon",
        "emergancyButtonIcon"
    ];

    elementIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("click", function() {
                alert(`${id} clicked`);
            });
        }
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
});
