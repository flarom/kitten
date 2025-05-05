<img src="resource/branding/light-full.png" width="300" alt="Kitten Logo">

Kitten is an **accountless**, **free** and **opensource** tasklist manager.

## Using Kitten
### 1. Using online
To use Kitten online, simply visit [https://flarom.github.io/kitten/](https://flarom.github.io/kitten/).

### 2. Using on the desktop
For now, it's not possible to use kitten on the desktop.

## Creating with Kitten
With Kitten, you can create:
- **Task lists**: Organize your tasks into lists for better management.
- **Tasks**: Add tasks with titles, descriptions, and due dates.
- **Subtasks**: Break down tasks into smaller, manageable subtasks.
- ~~**Tags**: Categorize your tasks with custom tags for easy filtering.~~

## Creating for Kitten
### 1. Creating themes
To create a custom theme for Kitten, follow these steps:
1. **Locate the theme folder**: Themes are stored in `resource/theme`.
2. **Create a new theme file**: Add a new `.json` file in the `theme` folder. Name it appropriately (e.g., `my-theme.json`).
3. **Define your styles**:
```json
{
    "name": "My theme",
    "category": "Dark", // use 'Dark', 'Light' or 'Special'
    "variables": {
        "--background-color": "#ffffff",
        "--card-color": "#dddddd",
        "--field-color": "#ffffff",
        "--border-color": "#666666",
        "--text-color": "#111111",
        "--icon-color": "#111111",
        "--title-color": "#000000",
        "--highlight-color": "#0000ff",
        "--warning-color": "#ff0000"
    }
}
```
4. **Insert your theme to the list**: Locate the `themes.json` file under the `theme` folder and type the name of the file you created:
```json
[
    "theme1.json",
    "my-theme.json",
    "theme2.json"
]
```
Your theme should appear in `Settings > Color Palette > "Select a theme preset"`.
Please note that you can only easly do this in the desktop version.

<p align="center"><img src="resource/branding/light-tiny.png" width="45"></p>
