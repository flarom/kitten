function saveItem(name, value) {
    localStorage.setItem(name, value);
    applyCSSVariable(name, value);
}

function loadItem(name) {
    return localStorage.getItem(name);
}

function applyCSSVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
}

function removeItem(name){
    localStorage.removeItem(name);
    document.documentElement.style.removeProperty(name);
}

function applySavedPalette() {
    const paletteVars = [
        "--background-color",
        "--card-color",
        "--field-color",
        "--border-color",
        "--text-color",
        "--icon-color",
        "--title-color",
        "--highlight-color",
        "--success-color",
        "--warning-color",
        "--highlight-back",
        "--success-back",
        "--warning-back",
        "--font",
        "--wallpaper",
        "--wallpaper-blur"
    ];

    paletteVars.forEach(name => {
        const value = loadItem(name);
        if (value !== null) {
            applyCSSVariable(name, value);
        }
    });
}

function resetPallete() {
    const paletteVars = [
        "--background-color",
        "--card-color",
        "--field-color",
        "--border-color",
        "--text-color",
        "--icon-color",
        "--title-color",
        "--highlight-color",
        "--highlight-back",
        "--success-color",
        "--success-back",
        "--warning-color",
        "--warning-back",
    ];

    paletteVars.forEach(name => {
        removeItem(name);
    });

    location.reload();
}

document.addEventListener("DOMContentLoaded", applySavedPalette);
