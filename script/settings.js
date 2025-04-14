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
        "--warning-color",
        "--highlight-back",
        "--warning-back",
        "--font",
        "--font-size",
        "--wallpaper",
        "--wallpaper-blur",
        "--wallpaper-brightness"
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
        "--warning-color",
        "--warning-back",
    ];

    paletteVars.forEach(name => {
        removeItem(name);
    });

    location.reload();
}

document.addEventListener("DOMContentLoaded", applySavedPalette);
