document.addEventListener("DOMContentLoaded", () => {
    const serverUrl ="https://hl4crsv1-5080.inc1.devtunnels.ms/";
    const GeoApiKey = 'bda91ddaeb1f46e69e4a39bcc3523985';
    const elements = {
        mapMain: document.getElementById("mapMain"),
        cameraMain: document.getElementById("cameraMain"),
        homeMain: document.getElementById("homeMain"),
        newsMain: document.getElementById("newsMain"),
        cycloneMain: document.getElementById("cycloneMain"),
        actionArea: document.getElementById("actionArea"),
        settingsMain: document.getElementById("settingsMain")
    };
    const profilePhoto = document.getElementById("profileName");
    const settingsButton = document.getElementById("settingsButton");
    const themeToggleButton = document.getElementById("theme-toggle");
    const radioButtons = document.querySelectorAll('input[name="radio"]');
    const currentAddress = document.getElementById("currentAddress");

    // Utility to show only the selected view
    const setDisplay = (view) => {
        Object.values(elements).forEach(el => el.style.display = "none");
        view.style.display = "flex";
    };

    // Set initial theme
    const savedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const setTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    };
    setTheme(savedTheme);

    // Event listeners for navigation
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const label = radio.nextElementSibling.getAttribute('aria-label') + "Main";
                setDisplay(elements[label]);
                history.pushState({ page: label }, null, "");
            }
        });
    });

    // Settings and profile photo interactions
    settingsButton.addEventListener("click", () => {
        setDisplay(elements.settingsMain);
        history.pushState({ page: "settingsMain" }, null, "");
    });
    profilePhoto.addEventListener("click", () => {
        setDisplay(elements.actionArea);
        history.pushState({ page: "actionArea" }, null, "");
    });

    // Back button actions
    document.getElementById("settingsAreaBackButton").addEventListener("click", () => {
        setDisplay(elements.actionArea);
        history.pushState({ page: "actionArea" }, null, "");
    });
    document.getElementById("actionAreaBackButton").addEventListener("click", () => {
        setDisplay(elements.homeMain);
        history.pushState({ page: "homeMain" }, null, "");
    });

    // Theme toggle button
    themeToggleButton.addEventListener("click", () => {
        setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    });

    // Service Worker registration with periodic update check
    const serviceWorkerRegistration = () => {
        navigator.serviceWorker.register('/service-worker.js').then(reg => {
            reg.onupdatefound = () => {
                const newWorker = reg.installing;
                newWorker.onstatechange = () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log("New version available. Forcing update.");
                        newWorker.postMessage({ action: 'skipWaiting' });
                    }
                };
            };
        });
        navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
    };
    if ('serviceWorker' in navigator) setInterval(serviceWorkerRegistration, 5000);

    // Location and notification permissions
    const requestPermissions = async () => {
        if ('geolocation' in navigator) navigator.geolocation.getCurrentPosition(showPosition, showError);
        if ('Notification' in window) await Notification.requestPermission();
        if ('contacts' in navigator) await navigator.contacts.select(['name', 'email'], { multiple: true });
    };

    // Geolocation handling
    const showPosition = (position) => getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
    

    // Get address from OpenCage API
    const getAddressFromCoordinates = (lat, lng) => {
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${GeoApiKey}`)
            .then(response => response.json())
            .then(data => {
                currentAddress.textContent = data.results.length > 0 ? data.results[0].formatted : "Unable to retrieve address.";
            }).catch(() => currentAddress.textContent = "Error fetching address.");
    };

    document.getElementById("takePictureButton").addEventListener("click", () => handleImageUpload(true));
    document.getElementById("uploadPictureButton").addEventListener("click", () => handleImageUpload(false));

    // Image handling
    const handleImageUpload = (capture = false) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        if (capture) input.capture = "environment";
        input.addEventListener("change", async () => {
            const file = input.files[0];
            if (file) await previewAndSendImage(file);
        });
        input.click();
    };

    async function previewAndSendImage(file) {
        const statusMessage = document.createElement("p");
        statusMessage.textContent = "Uploading...";
        document.getElementById("cameraMain").appendChild(statusMessage);
    
        const formData = new FormData();
        formData.append("image", file);
    
        // Timeout wrapper function
        const fetchWithTimeout = (url, options, timeout = 5000) => {
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error("Request timed out")), timeout);
                fetch(url, options).then(
                    response => {
                        clearTimeout(timer);
                        resolve(response);
                    },
                    err => {
                        clearTimeout(timer);
                        reject(err);
                    }
                );
            });
        };
    
        try {
            const response = await fetchWithTimeout(`${serverUrl}/upload_image`, { method: "POST", body: formData });
            statusMessage.textContent = response.ok ? "Image uploaded successfully!" : "Image upload failed!";
            statusMessage.style.color = response.ok ? "green" : "red";
        } catch (error) {
            statusMessage.textContent = error.message === "Request timed out" ? "Upload timed out!" : "Server error!";
            statusMessage.style.color = "red";
        }
        setTimeout(() => statusMessage.remove(), 4000);
    }

    // Socket.IO notifications
    const socket = io(serverUrl, { transports: ['websocket'], reconnectionAttempts: 5, reconnectionDelay: 1000, timeout: 2000 });
    socket.on('new_notification', ({ title, message }) => showNotification(title, message));

    const showNotification = async (title, message) => {
        const registration = await navigator.serviceWorker.ready;
        if (registration.showNotification) {
            await registration.showNotification(title, {
                body: message,
                icon: '/static/images/logo.png',
                badge: '/static/images/logo_fav.png',
                vibrate: [200, 100, 200],
                requireInteraction: true,
                actions: [{ action: 'explore', title: 'View' }, { action: 'close', title: 'Close' }]
            });
        } else {
            new Notification(title, { body: message, icon: '/static/images/logo.png' });
        }
    };

    // Initialize and request permissions on page load
    window.addEventListener("load", () => {
        history.replaceState({ page: "homeMain" }, null, "");
        setDisplay(elements.homeMain);
        requestPermissions();
    });

    window.addEventListener("popstate", (event) => {
        setDisplay(elements[event.state?.page] || elements.homeMain);
    });
});
