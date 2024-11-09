document.addEventListener("DOMContentLoaded", function() {

    const serverUrl = "https://tvt3wnp4-5080.inc1.devtunnels.ms";
    const GeoApiKey = 'bda91ddaeb1f46e69e4a39bcc3523985';

    const mapMain = document.getElementById("mapMain");
    const cameraMain = document.getElementById("cameraMain");
    const homeMain = document.getElementById("homeMain");
    const newsMain = document.getElementById("newsMain");
    const cycloneMain = document.getElementById("cycloneMain");

    const profilephoto = document.getElementById("profileName");
    const actionArea = document.getElementById("actionArea");
    const settingsButton = document.getElementById("settingsButton");

    const settingsMain= document.getElementById("settingsMain");

    const elements = { 
        mapMain,
        cameraMain,
        homeMain,
        newsMain,
        cycloneMain,
        actionArea,
        settingsMain
    };

    // Utility function to display only the selected view
    function setDisplay(view) {
        Object.values(elements).forEach(el => el.style.display = "none");
        view.style.display = "flex";
    }

    const viewStates = {
        "mapMain": elements.mapMain,
        "cameraMain": elements.cameraMain,
        "homeMain": elements.homeMain,
        "newsMain": elements.newsMain,
        "cycloneMain": elements.cycloneMain,
        "actionArea": elements.actionArea,
        "settingsMain": elements.settingsMain,
    };

    const radioButtons = document.querySelectorAll('input[name="radio"]');

    radioButtons.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const label = radio.nextElementSibling.getAttribute('aria-label');
                elements.forEach(el => el.style.display = "none");

                if (viewStates[label + "Main"]) {
                    viewStates[label + "Main"].style.display = 'flex';
                    history.pushState({ page: label + "Main" }, null, "");
                }
            }
        });
    });

    settingsButton.addEventListener("click", () => {
        history.pushState({ page: "settingsMain" }, null, "");
        setDisplay(elements.settingsMain);
    });

    profilephoto.addEventListener("click", () => {
        history.pushState({ page: "actionArea" }, null, "");
        setDisplay(elements.actionArea);
    });

    document.getElementById("settingsAreaBackButton").addEventListener("click", () => {
        history.pushState({ page: "actionArea" }, null, "");
        setDisplay(elements.actionArea);
    });

    document.getElementById("actionAreaBackButton").addEventListener("click", () => {
        history.pushState({ page: "homeMain" }, null, "");
        setDisplay(elements.homeMain);
    });

    window.addEventListener("load", () => {
        history.replaceState({ page: "homeMain" }, null, "");
        setDisplay(elements.homeMain);
    });

    window.addEventListener("popstate", (event) => {
        const statePage = event.state ? event.state.page : "homeMain";
        setDisplay(viewStates[statePage] || elements.homeMain);
    });

    document.getElementById("takePictureButton").addEventListener("click", openCamera);
    document.getElementById("uploadPictureButton").addEventListener("click", uploadPicture);

    function openCamera() {
        const captureInput = document.createElement("input");
        captureInput.type = "file";
        captureInput.accept = "image/*";
        captureInput.capture = "environment";

        captureInput.addEventListener("change", async () => {
            const file = captureInput.files[0];
            if (file) previewAndSendImage(file);
        });
        captureInput.click();
    }

    function uploadPicture() {
        const uploadInput = document.createElement("input");
        uploadInput.type = "file";
        uploadInput.accept = "image/*";

        uploadInput.addEventListener("change", async () => {
            const file = uploadInput.files[0];
            if (file) previewAndSendImage(file);
        });
        uploadInput.click();
    }

    async function previewAndSendImage(file) {
        const confirmText = document.createElement("p");
        confirmText.textContent = "Uploading...";
        document.getElementById("cameraMain").appendChild(confirmText);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(serverUrl + "/upload_image", { method: "POST", body: formData });
            confirmText.textContent = response.ok ? "Image uploaded successfully!" : "Image upload failed!";
            confirmText.style.color = response.ok ? "green" : "red";
        } catch (error) {
            confirmText.textContent = "Server error!";
            confirmText.style.color = "red";
        }
        setTimeout(() => confirmText.remove(), 4000);
    }

    const themeToggleButton = document.getElementById("theme-toggle");

    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

    themeToggleButton.addEventListener("click", () => {
        setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
    });

    function serviceWorkerRegistration() {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'activated') {
                        if (navigator.serviceWorker.controller) window.location.reload();
                    }
                });
            });
        });
    }
    setInterval(serviceWorkerRegistration, 5000);

});
