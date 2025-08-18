# Assets

This directory contains shared resources used across projects in the sketchbook.

## 📁 Contents

### [et-book](./et-book/)
Typography resources and font files for enhanced text rendering in projects.
- **Purpose**: Provides beautiful typography for text-heavy visualizations
- **Format**: Web fonts and CSS
- **Usage**: Include in HTML projects for improved readability

### [img](./img/)
Shared images and media files used across multiple projects.
- **Purpose**: Common graphics, backgrounds, textures, and reference images
- **Formats**: Various image formats (PNG, JPG, GIF, SVG)
- **Usage**: Referenced by path in project code

## 🎯 Usage Guidelines

### Referencing Assets in p5.js Projects
```javascript
// From a p5.js project directory
let img = loadImage('../assets/img/my-image.png');
```

### Referencing Assets in Processing Projects
```java
// From a Processing project directory
PImage img = loadImage("../assets/img/my-image.png");
```

### Using Typography
```html
<!-- Include in HTML head -->
<link rel="stylesheet" href="../assets/et-book/et-book.css">
```

## 📝 Contributing Assets

When adding new shared assets:
1. **Organize by type**: Images go in `img/`, fonts in appropriate subdirectories
2. **Use descriptive names**: `golden_spiral_reference.png` not `img1.png`
3. **Optimize file sizes**: Compress images appropriately for web use
4. **Document usage**: Update this README if adding new asset categories
5. **Check licenses**: Ensure you have rights to use and distribute the assets

## 🚫 What NOT to Include

- **Large files**: Keep individual assets under 5MB when possible
- **Copyrighted material**: Only include assets you have rights to use
- **Project-specific assets**: These should stay within individual project folders
- **Generated files**: Build outputs, temporary files, or cache data