const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Retrieves the version number from the project's package.json file.
 * 
 * @returns {string} The version number from package.json.
 */
function getVersion() {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
}

/**
 * Retrieves the latest release version tag from the Git repository.
 * 
 * @returns {string|null} The latest release version tag, or null if an error occurs.
 */
function getLastReleaseVersion() {
    try {
        const output = execSync('git describe --tags --abbrev=0').toString().trim();
        return output;
    } catch (error) {
        console.error('Erro ao obter a última tag:', error.message);
        return null;
    }
}

/**
 * Determines if the application is running in a web environment.
 * 
 * @returns {boolean} True if the application is running in a web environment, false otherwise.
 */
function isWebEnvironment() {
    return typeof process === 'undefined' || !process.versions.electron;
}

module.exports = {
    getVersion,
    getLastReleaseVersion,
    isWebVersion,
    hideElementsFromEnvironment
};