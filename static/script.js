document.addEventListener("DOMContentLoaded", function() {

    const serverUrl = "https://tvt3wnp4-5080.inc1.devtunnels.ms/";
    const GeoApiKey = 'bda91ddaeb1f46e69e4a39bcc3523985'; // Replace with your OpenCage API key

    const mapMain = document.getElementById("mapMain");
    const cameraMain = document.getElementById("cameraMain");
    const homeMain = document.getElementById("homeMain");
    const newsMain = document.getElementById("newsMain");
    const cycloneMain = document.getElementById("cycloneMain");

    const profilephoto = document.getElementById("profileName");
    const actionArea = document.getElementById("actionArea");

    const settingsButton = document.getElementById("settingsButton");
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
                    cycloneMain.style.display = 'none';
                    actionArea.style.display = "none";
                    settingsMain.style.display = "none";
                } else if (label === 'camera') {
                    mapMain.style.display = 'none';
                    cameraMain.style.display = 'flex';
                    homeMain.style.display = 'none';
                    newsMain.style.display = 'none';
                    cycloneMain.style.display = 'none';
                    actionArea.style.display = "none";
                    settingsMain.style.display = "none";
                } else if (label === 'home') {
                    mapMain.style.display = 'none';
                    cameraMain.style.display = 'none';
                    homeMain.style.display = 'flex';
                    newsMain.style.display = 'none';
                    cycloneMain.style.display = 'none';
                    actionArea.style.display = "none";
                    settingsMain.style.display = "none";
                } else if (label === 'news') {
                    mapMain.style.display = 'none';
                    cameraMain.style.display = 'none';
                    homeMain.style.display = 'none';
                    newsMain.style.display = 'flex';
                    cycloneMain.style.display = 'none';
                    actionArea.style.display = "none";
                    settingsMain.style.display = "none";
                } else if (label === 'cyclone') {
                    mapMain.style.display = 'none';
                    cameraMain.style.display = 'none';
                    homeMain.style.display = 'none';
                    newsMain.style.display = 'none';
                    cycloneMain.style.display = 'flex';
                    actionArea.style.display = "none";
                    settingsMain.style.display = "none";
                }
            }
        });
    });

    profilephoto.addEventListener("click", () => {
        actionArea.style.display = "flex";
        mapMain.style.display = "none";
        cameraMain.style.display = "none";
        homeMain.style.display = "none";
        newsMain.style.display = "none";
        cycloneMain.style.display = "none";
        settingsMain.style.display = "none";
    });

    settingsButton.addEventListener("click", () => {
        actionArea.style.display = "none";
        mapMain.style.display = "none";
        cameraMain.style.display = "none";
        homeMain.style.display = "none";
        newsMain.style.display = "none";
        cycloneMain.style.display = "none";
        settingsMain.style.display = "flex";
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
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            registration.onupdatefound = () => {
                const newWorker = registration.installing;
                newWorker.onstatechange = () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New content is available, prompt user to update or force an update
                        console.log("New version available. Forcing update.");
                        newWorker.postMessage({ action: 'skipWaiting' });
                    }
                };
            };
        });
    
        // Listen for 'controllerchange' event to reload the page after the new service worker activates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log("Controller changed. Reloading page...");
            window.location.reload();
        });
    }
    

    // Function to request location permission
    function requestLocationPermission() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Location permission granted.');
                    // console.log(`Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`);
                },
                (error) => {
                    console.error('Error obtaining location: ', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
          document.getElementById("currentAddress").textContent = "Geolocation is not supported by this browser.";
        }
      }
  
      // Function to show the position and get the address
      function showPosition(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Now, call the function to get the address using reverse geocoding
        getAddressFromCoordinates(lat, lng);
      }
  
      // Function to handle geolocation errors
      function showError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            document.getElementById("currentAddress").textContent = "You denied the request for Geolocation."
            break;
          case error.POSITION_UNAVAILABLE:
            document.getElementById("currentAddress").textContent = "Location information is unavailable."
            break;
          case error.TIMEOUT:
            document.getElementById("currentAddress").textContent = "The request to get user location timed out."
            break;
          case error.UNKNOWN_ERROR:
            document.getElementById("currentAddress").textContent = "An unknown error occurred."
            break;
        }
      }
  
      // Function to get the address from the OpenCage Geocoding API
      function getAddressFromCoordinates(lat, lng) {
        
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${GeoApiKey}`;
  
        // Fetching the address from OpenCage Geocoding API
        fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data.results.length > 0) {
              const address = data.results[0].formatted; // Getting the formatted address
              document.getElementById("currentAddress").textContent = address; // Set the address in the h1 tag
            } else {
              document.getElementById("currentAddress").textContent = "Unable to retrieve address.";
            }
          })
          .catch(error => {
            console.error('Error fetching address:', error);
            document.getElementById("currentAddress").textContent = "Error fetching address.";
          });
      }
  
      // Call the function to get current location on page load
      getCurrentLocation();

    // Function to request notification permission
    async function requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else {
                console.error('Notification permission denied.');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
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
    async function showSystemNotification(title, message) {
        if (Notification.permission === 'granted') {
            try {
                const registration = await navigator.serviceWorker.ready;
                // Check if showNotification function exists
                if (registration.showNotification) {
                    await registration.showNotification(title, {
                        body: message,
                        icon: '/static/images/logo.png',
                        badge: '/static/images/logo_fav.png',
                        vibrate: [200, 100, 200],
                        requireInteraction: true, // Notification persists until user interacts
                        actions: [
                            { action: 'explore', title: 'View' },
                            { action: 'close', title: 'Close' }
                        ]
                    });
                    console.log('Notification shown successfully.');
                } else {
                    console.error('showNotification is not a function.');
                }
            } catch (error) {
                console.error('Error showing notification:', error);
            }
        } else {
            console.error('Notification permission not granted');
            // Request permission again if needed
            await requestNotificationPermission();
        }
    }
    

    // Set up Socket.IO for notifications

    const socket = io(serverUrl, {
        transports: ['websocket'],  // Use only WebSocket for real-time connection
        reconnectionAttempts: 5,    // Number of reconnection attempts
        reconnectionDelay: 1000,    // Delay before trying to reconnect
        timeout: 2000,              // Connection timeout
    });

    socket.on('new_notification', async (data) => {
        const { title, message } = data;
        
        // First try using the service worker
        if ('serviceWorker' in navigator) {
            try {
                await showSystemNotification(title, message);
            } catch (error) {
                console.error('Service Worker notification failed:', error);
                // Fallback to regular notification
                new Notification(title, {
                    body: message,
                    icon: '/static/images/logo.png'
                });
            }
        } else {
            // Fallback for browsers without service worker support
            new Notification(title, {
                body: message,
                icon: '/static/images/logo.png'
            });
        }
    });


    // Request permissions on page load
    requestLocationPermission();
    requestContactsPermission();
    requestNotificationPermission();


    function serviceWorkerRegistration() {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
            
            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
    
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                        console.log('New Service Worker activated.');
    
                        // Check if there's a controller now (meaning it's controlling the page)
                        if (navigator.serviceWorker.controller) {
                            console.log('This page is now controlled by:', navigator.serviceWorker.controller);
                        } else {
                            console.log('Page still not controlled by a Service Worker.');
                        }
                    }
                });
            });
        })
    }

    setInterval(() => {
        serviceWorkerRegistration();
    }, 5000);
    
});
