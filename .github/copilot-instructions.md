# Sketchbook - Creative Coding Repository

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Overview
This repository contains creative coding experiments and visualizations using Processing (Java) and P5.js (JavaScript). Projects are published as a static site at https://felipecustodio.github.io/sketchbook/

## Working Effectively

### Initial Setup
Run the following commands to set up your environment:
```bash
# Start a web server for testing P5.js projects (takes 2 seconds)
cd /path/to/sketchbook
python3 -m http.server 8000
```

### For Processing (.pde) Projects
Processing projects require specific setup and naming conventions:

```bash
# Download and install Processing CLI (takes 60+ seconds, NEVER CANCEL)
wget -q https://github.com/processing/processing4/releases/download/processing-1293-4.3/processing-4.3-linux-x64.tgz -O /tmp/processing.tgz
cd /tmp && tar -xzf processing.tgz
export PATH="/tmp/processing-4.3:$PATH"

# Test Processing installation
processing-java --help
```

**CRITICAL**: Processing projects must follow strict naming conventions:
- Sketch folder name MUST match the .pde file name
- Example: `my_sketch/my_sketch.pde` (correct) vs `my_sketch/sketch.pde` (incorrect)

Build and run Processing projects:
```bash
# Build a Processing project (takes 5-15 seconds)
cd project_folder
processing-java --sketch="$PWD" --build

# Run a Processing project (WARNING: Opens GUI window)
processing-java --sketch="$PWD" --run
```

**NOTE**: Some Processing projects require libraries (like PeasyCam). Missing libraries will cause build failures with clear error messages.

### For P5.js Projects

P5.js projects run in web browsers and require no compilation:

```bash
# Start web server (if not already running)
python3 -m http.server 8000

# Access projects at:
# http://localhost:8000/project_name/
# http://localhost:8000/project_name/index.html
```

Some P5.js projects have npm dependencies for linting:
```bash
# Install dependencies (takes 3+ minutes, NEVER CANCEL)
cd project_with_package_json
npm install  # Expect many deprecation warnings, this is normal

# Run linting tools
npx eslint sketch.js          # JavaScript linting
npx htmlhint index.html       # HTML linting  
npx stylelint style.css       # CSS linting (requires config)
```

## Project Structure

### Repository Layout
```
/
├── index.html              # Main portfolio page
├── style.css               # Main styles  
├── tufte.css              # Typography styles
├── img/                   # Assets for portfolio
├── [project_folders]/     # Individual projects
├── p5-starter/           # P5.js template
└── pde-starter/          # Processing template
```

### Project Types

**P5.js Projects** (JavaScript):
- `index.html` - Main entry point
- `sketch.js` - P5.js sketch code  
- `style.css` - Project styles
- `package.json` - Optional npm dependencies for linting
- Dependencies loaded from CDN (no local installation needed)

**Processing Projects** (Java):
- `project_name.pde` - Main sketch file (MUST match folder name)
- `data/` - Assets and data files
- Additional `.pde` files for multi-file sketches
- Some projects require external libraries

## Validation Scenarios

### Always Test P5.js Projects
After making changes to P5.js projects:
```bash
# 1. Start web server
python3 -m http.server 8000 &

# 2. Test project loads without errors
curl -s http://localhost:8000/project_name/ | grep -i error || echo "No errors"

# 3. Manually open in browser and verify:
#    - Page loads without console errors
#    - Canvas appears and animation runs
#    - Interactive elements respond (sliders, buttons)
#    - Verify specific project features work
```

### Always Test Processing Projects  
After making changes to Processing projects:
```bash
# 1. Ensure Processing is available
export PATH="/tmp/processing-4.3:$PATH"

# 2. Test build succeeds
cd project_folder
processing-java --sketch="$PWD" --build

# 3. Verify no compilation errors
# 4. For projects with libraries, verify dependencies are documented
```

### Linting Validation
For projects with package.json:
```bash
# Run all available linters before committing
cd project_folder
npx eslint sketch.js --fix  # Fix auto-correctable issues
npx htmlhint index.html
# Note: stylelint requires configuration file to run
```

## Important Timing and Warnings

- **npm install**: Takes 3+ minutes with many deprecation warnings. NEVER CANCEL.
- **Processing download**: Takes 60+ seconds for initial setup. NEVER CANCEL.
- **Web server startup**: Takes 2 seconds, instant for subsequent uses.
- **Processing builds**: Take 5-15 seconds per project.

## Common Issues and Solutions

### Processing Issues
- **"Index 0 out of bounds"**: Folder name doesn't match .pde filename
- **"Package does not exist"**: Missing library dependency  
- **Build failures**: Check that .pde file is named correctly

### P5.js Issues
- **Blank canvas**: Check browser console for JavaScript errors
- **CDN loading failures**: Projects use CDN dependencies, check network
- **Linting errors**: Old dependencies, expect warnings but functionality works

### Web Server Issues
- **Port 8000 busy**: Use `pkill -f "python3 -m http.server"` then restart
- **CORS errors**: Always use local server, never open HTML files directly

## Key Projects

- **lissajous_generator**: Interactive Lissajous curve generator with audio
- **harmonograph_p5**: Web-based harmonograph simulation
- **harmonograph3D**: Processing 3D harmonograph (requires PeasyCam library)
- **flights**: Flight path visualization using map data
- **klein_cycloid**: 3D Klein cycloid visualization

## Development Workflow

1. **For new P5.js projects**: Copy from `p5-starter/` template
2. **For new Processing projects**: Copy from `pde-starter/` template  
3. **Always validate**: Test projects work after changes
4. **Deployment**: Repository auto-deploys to GitHub Pages
5. **Assets**: Place images/data in project folders or `img/` for portfolio

## Quick Reference Commands

```bash
# Setup environment
python3 -m http.server 8000 &
export PATH="/tmp/processing-4.3:$PATH"

# Test P5.js project
curl -s http://localhost:8000/project_name/

# Build Processing project
cd project_folder && processing-java --sketch="$PWD" --build

# Lint P5.js project (if package.json exists)
cd project_folder && npm install && npx eslint sketch.js --fix
```