document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("emergancyButton").addEventListener("click", function() {
        alert("Emergency help requested");
    });

    document.getElementById("profileImage").addEventListener("click", function() {
        alert("Profile image clicked");
    });

    document.getElementById("profileNameText").addEventListener("click", function() {
        alert("Profile name clicked");
    });

    document.getElementById("profileAddressText").addEventListener("click", function() {
        alert("Profile address clicked");
    });

    document.getElementById("addressPinIcon").addEventListener("click", function() {
        alert("Address pin clicked");
    });

    document.getElementById("emergancyButtonIcon").addEventListener("click", function() {
        alert("Emergency button icon clicked");
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/static/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                }).catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
});