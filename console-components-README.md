# 3D-LLM Console Components

This project includes realistic console components that simulate the loading and processing of 3D model files. The consoles provide detailed, real-time feedback about the initialization of WebGL contexts, model loading progress, and scene setup.

## Available Console Components

### 1. Basic Console
- Located in `client/src/components/Console.tsx`
- Displays simple log messages for 3D model loading
- Supports different message types (info, success, warning, error, debug)
- Includes controls for clearing and closing the console

### 2. Model Loading Console
- Located in `client/src/components/ModelLoadingConsole.tsx`
- More advanced console with progress bars for each model being loaded
- Shows detailed technical information about model geometry (vertices, faces)
- Displays timestamped logs with color-coded messages
- Simulates a realistic loading process for 3D models

## Demo Pages

Two demo pages are available to showcase the console components:

### 1. Basic Console Demo
- URL: `/console`
- Shows a simple console with basic loading information
- Demonstrates how to use the Console component in a page

### 2. Model Loading Demo
- URL: `/model-loading`
- Shows the advanced ModelLoadingConsole with progress bars and detailed logs
- Includes a system status display that updates as models are loaded
- Demonstrates real-time loading simulation with progress tracking

## Integration

To integrate these consoles into your own components:

1. For the basic console:
```jsx
import Console from '../components/Console';

// Use in a component
<Console onClose={() => setShowConsole(false)} />
```

2. For the model loading console:
```jsx
import ModelLoadingConsole from '../components/ModelLoadingConsole';

// Use in a component with callback for when loading completes
<ModelLoadingConsole onLoadingComplete={() => handleLoadingComplete()} />
```

## Navigation

A navigation component (`DemoNavigation`) has been added to make it easy to move between the demo pages. It is included at the top of each demo page.

## Customization

Both console components can be customized:
- Adjust the loading delay times in the useEffect hooks
- Modify the console styles (colors, sizes, etc.)
- Change the log messages to match your specific 3D model loading requirements
- Add additional features like error simulation or network latency simulation 