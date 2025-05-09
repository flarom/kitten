function saveSetting(name, value) {
    localStorage.setItem(name, value);
    applyCSSVariable(name, value);
}

function loadSetting(name, throwback = null) {
    const value = localStorage.getItem(name);
    return value !== null ? value : throwback;
}

function settingExists(name) {
    return localStorage.getItem(name) !== null;
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
        "--wallpaper-brightness",
        "--wallpaper-position"
    ];

    paletteVars.forEach(name => {
        const value = loadSetting(name);
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


function clearSettings() {
    const settingsKeys = [
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
        "--font",
        "--font-size",
        "--wallpaper",
        "--wallpaper-blur",
        "--wallpaper-brightness"
    ];

    settingsKeys.forEach(key => {
        localStorage.removeItem(key);
        document.documentElement.style.removeProperty(key);
    });

    location.reload();
}

function getCSSVariableValue(name) {
    let value = localStorage.getItem(name);
    if (value) return value;

    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}