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

    document.getElementById("takePictureButton").addEventListener("click", openCamera);
    document.getElementById("uploadPictureButton").addEventListener("click", uploadPicture);

    const serverUrl="https://6883cjlh-8080.inc1.devtunnels.ms"

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
        // Display the image preview
        // const imgURL = URL.createObjectURL(file);
        // const imgPreview = document.createElement("img");
        // imgPreview.src = imgURL;
        // imgPreview.style.width = "100%";
        // imgPreview.style.height = "auto";
        // document.body.appendChild(imgPreview);

        const confirmText =document.createElement("p");
        confirmText.textContent = "Image uploaded successfully!";
        document.body.appendChild(confirmText);

        

        document.body.appendChild();

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
            } else {
                console.error("Image upload failed.");
            }
        } catch (error) {
            console.error("Error while uploading image:", error);
        }
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
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
});
