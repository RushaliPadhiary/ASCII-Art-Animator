# 🎥 ASCII Art Animator

Transform your webcam feed into live, animated ASCII art with stunning visual effects! This project creates a real-time side-by-side comparison of your original webcam feed and its artistic ASCII representation.

## ✨ Features

- **Live Webcam Capture**: Real-time video processing using getUserMedia API
- **Instant ASCII Conversion**: Convert video frames to ASCII characters on the fly
- **Side-by-Side View**: Compare original video with ASCII output simultaneously
- **Adjustable Settings**:
  - ASCII Resolution (Low/Medium/High)
  - Multiple Character Sets (Classic/Simple/Detailed)
  - Frame Rate Control (5-30 fps)
  - Brightness Adjustment
- **Stunning Visual Effects**: Animated gradient text with pulsating glow in pink themes
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Monitoring**: Live FPS counter

## 🎮 How to Use

- **Start/Stop**: Use the buttons to control camera feed
- **Resolution**: Choose between Low/Medium/High ASCII output
- **Character Sets**: Switch between Classic, Simple, or Detailed styles
- **Frame Rate**: Adjust for performance vs smoothness (5-30 fps)
- **Brightness**: Fine-tune for better contrast in different lighting

## 🧠 How It Works

1. **Camera Access**: Requests webcam permission and streams video
2. **Frame Capture**: Captures video frames at specified frame rate
3. **Downsampling**: Reduces image resolution to match ASCII grid size
4. **Grayscale Conversion**: Converts RGB pixels to brightness values using luminance formula
5. **ASCII Mapping**: Maps brightness to appropriate characters (darker = denser chars)
6. **Visual Enhancement**: Applies gradient colors and glow effects
7. **Display**: Shows result with proper formatting in monospace font

## 🔧 Challenges & Solutions

### Challenge 1: Real-time Performance
**Issue**: Processing every frame at high resolution caused lag and high CPU usage.
**Solution**: Implemented frame rate throttling, added resolution options for different performance needs, and capped mobile devices at 15 fps for better performance.

### Challenge 2: Container Sizing & Overflow
**Issue**: ASCII output would overflow its container when resolution changed, and containers would resize unpredictably.
**Solution**: Fixed container dimensions using aspect-ratio padding technique, implemented dynamic font sizing that calculates optimal character size, and added scrollable overflow with custom styling.

### Challenge 3: Mobile Responsiveness
**Issue**: Video and ASCII content would break layout on mobile devices, with content spilling outside containers.
**Solution**: Created device detection for mobile-specific optimizations, adjusted aspect ratios for different screen sizes (16:9 → 4:3 → 1:1), added orientation change handlers, and used transform: translateY(-15px) to position content perfectly.

### Challenge 4: Visual Enhancement
**Issue**: Basic green ASCII art lacked visual appeal and felt dated.
**Solution**: Transformed from static green to animated pink gradients

### Challenge 5: Camera Mirroring
**Issue**: Self-view felt unnatural (like looking at a camera vs. in a mirror).
**Solution**: Applied CSS transform `scaleX(-1)` to video element and added canvas transformation for ASCII output consistency to ensure both views mirror identically.

### Challenge 6: Browser Compatibility
**Issue**: Different browsers handle getUserMedia and canvas APIs differently.
**Solution**: Added comprehensive browser support detection, implemented fallback error messages, used feature detection instead of browser sniffing, and tested across multiple browsers.

### Challenge 7: Memory Management
**Issue**: Continuous frame processing could lead to memory leaks.
**Solution**: Proper cleanup of camera stream on stop, canceling animation frames when not needed, reusing canvas elements instead of creating new ones, and efficient pixel data handling.

## 📱 Browser Support

Works on all modern browsers that support:
- `getUserMedia` API
- Canvas API
- ES6 JavaScript
- CSS Animations

## ⚙️ Configuration Options

| Setting | Range | Description |
|---------|-------|-------------|
| Resolution | 40x20, 80x40, 120x60 | ASCII output dimensions |
| Frame Rate | 5-30 fps | Processing speed |
| Brightness | 0.5-2.0 | Image brightness adjustment |
| Character Set | 3 options | Visual style of output |

## 🎨 Character Sets

- **Classic**: `@%#*+=-:. ` - Traditional ASCII art mapping from dense to light
- **Simple**: `█▓▒░ ` - Block characters for bold, high-contrast appearance
- **Detailed**: Full character set with maximum detail and shading

## 🚧 Known Limitations

- Requires camera permission (HTTPS or localhost)
- Performance varies with device capability
- Higher resolutions require more processing power
- Limited to grayscale conversion (no color ASCII yet)

## 🔮 Future Enhancements

- [ ] Color ASCII output (preserving original colors)
- [ ] Multiple camera support (front/back switching)
- [ ] Save/export ASCII animations as video or GIF
- [ ] Custom character set upload
- [ ] WebGL acceleration for better performance
- [ ] Social sharing features
- [ ] Preset configurations for different art styles
