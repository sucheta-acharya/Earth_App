document.addEventListener("DOMContentLoaded", function() {
    
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
                mapMain.style.display = label === 'map' ? 'flex' : 'none';
                cameraMain.style.display = label === 'camera' ? 'flex' : 'none';
                homeMain.style.display = label === 'home' ? 'flex' : 'none';
                newsMain.style.display = label === 'news' ? 'flex' : 'none';
                settingsMain.style.display = label === 'settings' ? 'flex' : 'none';
            }
        });
    });

    document.getElementById("takePictureButton").addEventListener("click", openCamera);
    document.getElementById("uploadPictureButton").addEventListener("click", uploadPicture);

    const serverUrl = "https://6883cjlh-5080.inc1.devtunnels.ms"; // Update this with your server URL

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
                body: formData,
                headers: {
                    "Accept": "application/json",
                    // Add other headers if necessary, like authorization tokens
                }
            });
            
            if (response.ok) {
                console.log("Image uploaded successfully!");
                confirmText.textContent = "Image uploaded successfully!";
                confirmText.style.color = "green";
            } else {
                console.error("Image upload failed.");
                confirmText.textContent = "Image upload failed!";
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
    const socket = io(serverUrl+'/notify', {
        transports: ['websocket'], // Use websocket transport for Socket.IO
        cors: {
            origin: serverUrl, // This is crucial for allowing the client to connect
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true // Enables sending credentials (cookies, authorization headers, etc.)
        }
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
