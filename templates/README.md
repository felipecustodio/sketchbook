# Templates and Build Scripts

This directory contains starter templates and build scripts for creating new creative coding projects.

## 🛠️ Build Scripts

### `new_p5` - Create New p5.js Projects
Creates a new p5.js project in the `../p5js/` directory using the p5-starter template.

**Usage:**
```bash
./new_p5 my_project_name
```

**Features:**
- Creates properly structured p5.js project
- Includes VSCode Intellisense configuration
- Sets up basic HTML, CSS, and JavaScript files
- Includes p5.js library and dependencies

### `new_pde` - Create New Processing Projects
Creates a new Processing project in the `../processing/` directory using the pde-starter template.

**Usage:**
```bash
./new_pde my_project_name
```

**Features:**
- Creates properly structured Processing project
- Renames main `.pde` file to match project name
- Includes basic Processing boilerplate code

## 📋 Templates

### [p5-starter](./p5-starter/)
Boilerplate template for p5.js projects with modern development features:

- **HTML5** structure with proper meta tags
- **CSS** with responsive design basics
- **JavaScript** with p5.js setup and draw functions
- **VSCode** configuration for Intellisense and code completion
- **p5.js libraries** (core, DOM, sound)
- **Live Server** compatibility

**Included Libraries:**
- p5.js (core)
- p5.dom.js (DOM manipulation)
- p5.sound.js (audio features)

### [pde-starter](./pde-starter/)
Basic template for Processing projects:

- **Processing boilerplate** with setup() and draw()
- **Comments** explaining basic structure
- **Example code** for getting started
- **Consistent naming** convention

## 🚀 Quick Start

### Creating a New p5.js Project
```bash
# From repository root
./templates/new_p5 awesome_visualization
cd p5js/awesome_visualization
# Open index.html in browser or serve locally
```

### Creating a New Processing Project
```bash
# From repository root
./templates/new_pde cool_animation
# Open processing/cool_animation/cool_animation.pde in Processing IDE
```

## 💡 Tips

1. **Project Naming**: Use lowercase with underscores or hyphens for consistency
2. **p5.js Development**: Use a local server for best results (avoid CORS issues)
3. **Processing**: Keep your Processing IDE updated for best compatibility
4. **VSCode**: Install the "p5.vscode" extension for enhanced p5.js development

## 🔧 Customization

Feel free to modify the templates to match your preferred coding style:
- Add additional libraries to `p5-starter`
- Include your preferred CSS framework
- Add TypeScript configuration for advanced projects
- Include build tools like webpack or vite for complex projects

## 📚 Resources

- [p5.js Getting Started](https://p5js.org/get-started/)
- [Processing Getting Started](https://processing.org/tutorials/gettingstarted/)
- [Creative Coding Resources](https://github.com/terkelg/awesome-creative-coding)