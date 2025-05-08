Kitten is an **accountless**, **free** and **opensource** tasklist manager.

## Using Kitten
### Get Kitten
#### Using online
To use Kitten online, simply visit <https://flarom.github.io/kitten/>.

#### Using on the desktop
For now, it's not possible to use kitten on the desktop.
### Keyboard shortcuts
#### Home
<table>
    <tr><th>Shortcut</th>                                                   <th>Action</th></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="S">S</kbd></td>  <td>Save file as .cat</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="O">O</kbd></td>  <td>Open .cat document</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="K">K</kbd></td>  <td>Add new item</td></tr>
    <tr><td><kbd data-key="Alt">Alt</kbd>+<kbd data-key="K">K</kbd></td>    <td>Add new item without name prompt</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="/">/</kbd></td>  <td>Show shortcuts</td></tr>
    <tr><td><kbd data-key="F2">F2</kbd></td>                                <td>Search</td></tr>
</table>

#### List
<table>
    <tr><th>Shortcut</th>                                                       <th>Action</th></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="S">S</kbd></td>      <td>Save file as .cat</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="K">K</kbd></td>      <td>Add new item</td></tr>
    <tr><td><kbd data-key="Alt">Alt</kbd>+<kbd data-key="K">K</kbd></td>        <td>Add new item without name prompt</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="/">/</kbd></td>      <td>Show shortcuts</td></tr>
    <tr><td><kbd data-key="F2">F2</kbd></td>                                    <td>Rename list</td></tr>
    <tr><td><kbd data-key="Del">Del</kbd></td>                                  <td>Delete last item</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="Del">Del</kbd></td>  <td>Delete first item</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="I">I</kbd></td>      <td>Order list alphabeticaly</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="U">U</kbd></td>      <td>Move checked items to the top</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="Y">Y</kbd></td>      <td>Move checked items to the bottom</td></tr>
    <tr><td><kbd data-key="Ctrl">Ctrl</kbd>+<kbd data-key="H">H</kbd></td>      <td>Return home</td></tr>
</table>

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
Please note that you can only easly do this in the desktop version
