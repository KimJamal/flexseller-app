# FlexSeller Icon Setup

## To add your custom app icon:

### 1. Create Your Icon Files

You need icon files in these formats:

#### For Windows (Required):
- **File**: `assets/icon.ico`
- **Format**: ICO file with multiple sizes embedded:
  - 16x16 (taskbar, title bar)
  - 32x32 (desktop shortcut)
  - 48x48 (file explorer)
  - 256x256 (high DPI displays)

#### For Development/Window Icon:
- **File**: `assets/icon.png`
- **Format**: PNG, at least 512x512 pixels
- Used for the window icon during development

#### For Mac (Optional):
- **File**: `assets/icon.icns`
- Format: ICNS (Apple icon format)

#### For Linux (Optional):
- **Folder**: `assets/icons/`
- Files: `16x16.png`, `32x32.png`, `48x48.png`, `128x128.png`, `256x256.png`, `512x512.png`

### 2. How to Create ICO Files

#### Option A: Online Converter (Easiest)
1. Create a PNG image (512x512 or larger) with your logo
2. Go to: https://convertio.co/png-ico/ or https://icoconvert.com/
3. Upload your PNG
4. Download the .ico file
5. Place it in `assets/icon.ico`

#### Option B: Using Photoshop/GIMP
1. Create your icon at 256x256 pixels
2. Save/export as ICO format
3. Make sure "Compress PNG" is checked for smaller file size

#### Option C: Using an ICO Editor
- **Windows**: Use Greenfish Icon Editor or IcoFX
- **Mac**: Use Icon Slate or Image2icon
- These tools let you create multi-size ICO files

### 3. Icon Design Tips

- **Keep it simple**: Small icons (16x16) should still be recognizable
- **Use transparency**: ICO supports transparency for smooth edges
- **Test at small sizes**: Your icon should look good at 16x16 pixels
- **Color**: Match your brand colors
- **Shape**: Square or slightly rounded works best

### 4. Build Your App

After placing your icon files, build the app:

```bash
# Build for Windows
npm run build:win

# Build for all platforms
npm run build
```

The installer and app will now use your custom icon instead of the Electron icon.

### 5. Where Icons Appear

- Window title bar (top-left corner)
- Taskbar when app is running
- Desktop shortcut
- Start menu entry
- File explorer (if you associate file types)
- Installer wizard
- Add/Remove Programs list

---

## Quick Start Template

If you don't have an icon yet, you can use this placeholder and replace it later:

1. Create a simple 512x512 PNG with your app name/logo
2. Save as `assets/icon.png` (for window icon during dev)
3. Convert to `assets/icon.ico` using online converter (for Windows builds)
4. Run `npm run build:win` to create the installer

The app is now configured to use your custom icon!
