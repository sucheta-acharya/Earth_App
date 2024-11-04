document.addEventListener("DOMContentLoaded", function() {

    const serverUrl = "https://6883cjlh-5080.inc1.devtunnels.ms";

    const mapMain = document.getElementById("mapMain");
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
                const label = radio.nextElementSibling.getAttribute('aria-label');
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

    // Buttons for taking and uploading pictures
    document.getElementById("takePictureButton").addEventListener("click", openCamera);
    document.getElementById("uploadPictureButton").addEventListener("click", uploadPicture);

    function openCamera() {
        const captureInput = document.createElement("input");
        captureInput.type = "file";
        captureInput.accept = "image/*";
        captureInput.capture = "environment"; // Opens the camera on mobile devices

        captureInput.addEventListener("change", async () => {
            const file = captureInput.files[0];
            if (file) {
                previewAndSendImage(file);
            }
        });

        captureInput.click();
    }

    function uploadPicture() {
        const uploadInput = document.createElement("input");
        uploadInput.type = "file";
        uploadInput.accept = "image/*";

        uploadInput.addEventListener("change", async () => {
            const file = uploadInput.files[0];
            if (file) {
                previewAndSendImage(file);
            }
        });

        uploadInput.click();
    }

    async function previewAndSendImage(file) {
        const TextParent = document.getElementById("cameraMain");
        const confirmText = document.createElement("p");
        confirmText.textContent = "Uploading...";
        TextParent.appendChild(confirmText);

        // Send the image to the server
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(serverUrl + "/upload_image", {
                method: "POST",
                body: formData
            });
            
            if (response.ok) {
                console.log("Image uploaded successfully!");
                confirmText.textContent = "Image uploaded successfully!";
                confirmText.style.color = "green";
            } else {
                console.error("Image upload failed.");
                const errorData = await response.json();
                confirmText.textContent = `Image upload failed! ${errorData.error || ''}`;
                confirmText.style.color = "red";
            }
        } catch (error) {
            console.error("Error while uploading image:", error);
            confirmText.textContent = "Server error!";
            confirmText.style.color = "red";
        }

        setTimeout(() => {
            confirmText.remove();
        }, 4000);
    }

    // Select the toggle button
    const themeToggleButton = document.getElementById("theme-toggle");

    // Function to set theme based on the user's choice or system preference
    function setTheme(theme) {
        if (theme === "dark") {
            themeToggleButton.checked = false;
        }
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

    // Check stored theme preference in localStorage or fallback to system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(systemPrefersDark ? "dark" : "light");
    }

    // Toggle theme when button is clicked
    themeToggleButton.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        setTheme(newTheme);
    });

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/static/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                    // Ask for notification permission after the service worker is registered
                    requestNotificationPermission();
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }

    // Function to request location permission
    function requestLocationPermission() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Location permission granted.');
                    console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
                },
                (error) => {
                    console.error('Error obtaining location: ', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    // Function to request notification permission
    function requestNotificationPermission() {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.error('Notification permission denied.');
            }
        }).catch(error => {
            console.error('Error requesting notification permission:', error);
        });
    }

    // Function to request contacts permission
    async function requestContactsPermission() {
        if ('contacts' in navigator) {
            try {
                const contacts = await navigator.contacts.select(['name', 'email'], { multiple: true });
                console.log('Contacts permission granted:', contacts);
            } catch (error) {
                console.error('Error obtaining contacts: ', error.message);
            }
        } else {
            console.error('Contacts API is not supported by this browser.');
        }
    }

    // Function to show system notification
    function showSystemNotification(title, message) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/static/images/logo.png' // Optional: Add an icon URL for your notification
            });
        } else if (Notification.permission !== 'denied') {
            requestNotificationPermission().then(() => {
                // Retry showing notification after permission is granted
                if (Notification.permission === 'granted') {
                    new Notification(title, {
                        body: message,
                        icon: '/static/images/logo.png' // Optional: Add an icon URL for your notification
                    });
                }
            });
        } else {
            console.error('Notification permission not granted.');
        }
    }

    // Set up Socket.IO for notifications

    const socket = io(serverUrl, {
        transports: ['websocket'],  // Use only WebSocket for real-time connection
        reconnectionAttempts: 5,    // Number of reconnection attempts
        reconnectionDelay: 1000,    // Delay before trying to reconnect
        timeout: 2000,              // Connection timeout
    });

    socket.on('new_notification', (data) => {
        const { title, message } = data;
        showSystemNotification(title, message); // Show system notification
    });

    // Request permissions on page load
    requestLocationPermission();
    requestContactsPermission();
    requestNotificationPermission();
});
