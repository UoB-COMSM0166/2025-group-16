# Project Description

## Getting Started

1. Install Dependencies

   ```shell
     yarn install
   ```

2. Install p5.js VSCode Extension

   Install the p5.js extension for VSCode for better support while developing.

   Please find the extension here: [p5.vscode](https://marketplace.visualstudio.com/items?itemName=samplavigne.p5-vscode)

3. Start Live Server

   - Click the `Go Live` button in the bottom-right corner.
   - Select `docs` directory in your browser.

## How to Contribute

1. **Setup**:

   Follow the **setup** instructions above.

2. **Development**:

   **Add a new file**: Include the script link in `index.html` and ensure the correct load order.

   - Encapsulated p5.js objects are in `src/classes`.
   - Pages are in `src/pages`.
   - Configuration, constants, theme, resources files are in `src/config`.
   - Global state management is in `src/state`.
   - Utility functions are in `src/utils`.

   **Add a new asset** (image or sound):

   1. Add the path and asset instance to `config/resources`.
   2. Preload it in `sketch.js`.
   3. Access the asset via `Resources.xxx.xxx` (from `config/resources`).

   Examples:

   - Use player SVG:

     ```javascript
     // any page
     draw() {
        const resource = Resources.images.entity.PLAYER[Theme.palette.player.red].IDLE.DOWN[0];

        const {image, width, height} = resource;
        // scale should less than 1 to prevent distortion
        const scale = Settings.entity.scale.M;
        image(image, 0, 0, width * scale, height * scale);
     }
     ```

   - Add new image:

     ```javascript
     // docs/src/config/resources.js
     const _ASSET_PATHS = {
       images: {
         newImage: `${_BASE_PATH}assets/images/xxx`,
       },
     };

     const Resources = {
       images: {
         newImage: new Img(_ASSET_PATHS.images.newImage),
       },
     };

     // any page
      draw() {
        const resource = Resources.images.newImage;
        image(resource.image, 0, 0);
     }
     ```

3. **Lint and Format**:

   Make sure you use the linters in project correctly, find more details at [Linter](#linter).

4. **Testing**:

   - Use **Live Server** to test your changes in the browser.
   - Remember to open the **Developer Console** (Right-click on the page → Inspect → Console tab) to check for any error messages.
   - Make sure the **Console tab** is empty before deploying.

5. **Request a Merge**:

   Follow the instruction [here](https://vivi2393142-0702.atlassian.net/wiki/spaces/TP/pages/8159293/GitHub+Workflow+Guideline) to request a merge on Github.

## Linter

### ESLint

> Check code style and errors automatically

- Install the **ESLint extension** in VSCode.
- If ESLint isn't updating or showing errors, force a re-check by:
  - press `Command + Shift + P`
  - select `ESLint: Restart ESLint Server`

### Prettier

> Auto-format your code

- Install the **Prettier extension** in VSCode.
- It will automatically format your code whenever you save the file.
- test

## Folder Structure

```bash
root
 └─ docs                  # Github page directory
   └─ 📁libs              # default p5.js libraries
   └─ 📁assets            # static assets
      └─ 📁readme         # assets in readme
      └─ 📁images         # all images
      └─ 📁sounds         # all sounds
   └─ 📁src               # main source code
      └─ 📁classes        # encapsulated p5.js objects
      └─ 📁config         # config, constants, theme, resources
      └─ 📁state          # global state
      └─ 📁utils          # utility functions
      └─ 📁pages          # pages
      └─ sketch.js        # main p5.js sketch
   └─ index.html          # main HTML
   └─ style.css           # main CSS
   └─ README.md           # development guide
 └─ 📁.vscode             # utilize VSCode config
 └─ .editorconfig         # utilize editor settings
 └─ .prettierrc           # formatter config
 └─ .gitignore
 └─ eslint.config.js      # linter config
 └─ package.json          # project dependencies
 └─ yarn.lock             # dependency version control
 └─ README.md             # development records
```
