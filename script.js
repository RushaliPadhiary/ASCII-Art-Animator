class ASCIIAnimator {
    constructor() {
        // DOM Elements
        this.video = document.getElementById('webcam');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.output = document.getElementById('ascii-output');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.status = document.getElementById('status');
        this.fpsCounter = document.getElementById('fps-counter');
        
        // Controls
        this.resolutionSelect = document.getElementById('resolution');
        this.charsetSelect = document.getElementById('charset');
        this.framerateInput = document.getElementById('framerate');
        this.framerateValue = document.getElementById('framerateValue');
        this.brightnessInput = document.getElementById('brightness');
        this.brightnessValue = document.getElementById('brightnessValue');
        
        // Character sets for different styles
        this.charSets = {
            classic: '@%#*+=-:. ',
            simple: '█▓▒░ ',
            detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. '
        };
        
        // State variables
        this.stream = null;
        this.animationFrame = null;
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fps = 0;
        this.asciiContainerWidth = 640;  
        this.asciiContainerHeight = 360; 
        
        // Bind methods to maintain 'this' context
        this.init = this.init.bind(this);
        this.startCamera = this.startCamera.bind(this);
        this.stopCamera = this.stopCamera.bind(this);
        this.processFrame = this.processFrame.bind(this);
        this.updateFPS = this.updateFPS.bind(this);
        this.convertToASCII = this.convertToASCII.bind(this);
        this.calculateFontSize = this.calculateFontSize.bind(this);
        this.adjustAsciiFontSize = this.adjustAsciiFontSize.bind(this);

        
        // Initialize event listeners
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.startBtn.addEventListener('click', this.startCamera);
        this.stopBtn.addEventListener('click', this.stopCamera);
        
        // Resolution change handler
        this.resolutionSelect.addEventListener('change', () => {
            if (this.isRunning) {
                this.adjustAsciiFontSize();  
            }
        });
        
        // Framerate slider
        this.framerateInput.addEventListener('input', (e) => {
            this.framerateValue.textContent = e.target.value + ' fps';
        });
        
        // Brightness slider
        this.brightnessInput.addEventListener('input', (e) => {
            this.brightnessValue.textContent = e.target.value;
        });
        
        // Check browser support
        this.checkBrowserSupport();
        
        // Set initial status
        this.updateStatus('Ready to start camera', '🟢');
    }
    
    checkBrowserSupport() {
        const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        const hasCanvas = !!window.CanvasRenderingContext2D;
        
        if (!hasGetUserMedia || !hasCanvas) {
            this.updateStatus('Your browser does not support required features', '🔴');
            this.startBtn.disabled = true;
            console.error('Browser does not support getUserMedia or Canvas');
        }
    }
    
    async startCamera() {
        try {
            this.updateStatus('Requesting camera access...', '⏳');
            
            // Request webcam access
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: 'user'
                },
                audio: false
            });
            
            // Connect stream to video element
            this.video.srcObject = this.stream;
            
            // Wait for video to be ready
            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });
            
            // Update UI
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.isRunning = true;
            this.updateStatus('Camera active', '🟢');
            
            // Start processing frames
            this.processFrame();
            
        } catch (error) {
            this.updateStatus(`Error: ${error.message}`, '🔴');
            console.error('Camera error:', error);
        }
    }
    
    stopCamera() {
        // Stop all tracks in the stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        // Stop animation loop
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Update UI
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.isRunning = false;
        this.updateStatus('Camera stopped', '⏸️');
        
        // Clear output
        this.output.textContent = 'Camera stopped. Click Start to begin.';
    }
    
    calculateFontSize() {
        const [width, height] = this.resolutionSelect.value.split('x').map(Number);
        const asciiWrapper = document.querySelector('.ascii-wrapper');
        
        if (!asciiWrapper) return 12;
        
        // Calculate font size to fit the container
        const containerWidth = asciiWrapper.clientWidth;
        const containerHeight = asciiWrapper.clientHeight;
    
        // Calculate based on width and height, take the smaller to ensure it fits both
        const fontSizeByWidth = Math.floor(containerWidth / (width * 0.65)); // 0.65 is average character width ratio
        const fontSizeByHeight = Math.floor(containerHeight / height);
    
        // Use the smaller font size and clamp between 6 and 24
        return Math.min(Math.max(Math.min(fontSizeByWidth, fontSizeByHeight), 6), 24);
    }

    adjustAsciiFontSize() {
        const fontSize = this.calculateFontSize();
        this.output.style.fontSize = fontSize + 'px';
    }
    
    processFrame() {
        if (!this.isRunning) return;
        
        // Calculate FPS
        this.updateFPS();
        
        // Get current settings
        const [width, height] = this.resolutionSelect.value.split('x').map(Number);
        const charset = this.charsetSelect.value;
        const brightness = parseFloat(this.brightnessInput.value);
        const targetFPS = parseInt(this.framerateInput.value);
        
        // Throttle frame rate
        const now = performance.now();
        const frameInterval = 1000 / targetFPS;
        
        if (now - this.lastFrameTime >= frameInterval) {
            // Check if video is ready
            if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
                // Set canvas dimensions to match desired ASCII resolution
                this.canvas.width = width;
                this.canvas.height = height;
                
                // Save context state
                this.ctx.save();
                
                // Flip horizontally for mirror effect
                this.ctx.translate(width, 0);
                this.ctx.scale(-1, 1);
                
                // Draw video frame to canvas (downsampling automatically happens here)
                this.ctx.drawImage(this.video, 0, 0, width, height);
                
                // Restore context state
                this.ctx.restore();
                
                // Get pixel data
                const imageData = this.ctx.getImageData(0, 0, width, height);
                
                // Convert to ASCII and display
                const asciiArt = this.convertToASCII(imageData, charset, brightness);
                this.output.textContent = asciiArt;
                
                // Adjust font size to fit container
                this.adjustAsciiFontSize();
            }
            
            this.lastFrameTime = now;
            this.frameCount++;
        }
        
        // Continue the loop
        this.animationFrame = requestAnimationFrame(this.processFrame);
    }

    
    convertToASCII(imageData, charset, brightness) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const chars = this.charSets[charset];
        
        let ascii = '';
        
        // Process each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Get pixel index in the data array
                const index = (y * width + x) * 4;
                
                // Get RGB values
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                // Convert to grayscale (luminance formula)
                let gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
                
                // Apply brightness adjustment
                gray = Math.min(255, Math.max(0, gray * brightness));
                
                // Map grayscale value to character index
                // Invert because dark areas should use dense characters
                const charIndex = Math.floor((gray / 255) * (chars.length - 1));
                
                // Add character (use inverted index for proper mapping)
                ascii += chars[chars.length - 1 - charIndex];
            }
            // Add newline at the end of each row
            ascii += '\n';
        }
        
        return ascii;
    }
    
    updateFPS() {
        const now = performance.now();
        const delta = now - this.lastFrameTime;
        
        // Update FPS counter every second
        if (delta >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFrameTime = now;
            this.fpsCounter.textContent = `FPS: ${this.fps}`;
        }
    }
    
    updateStatus(message, emoji) {
        this.status.textContent = `${emoji} ${message}`;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ASCIIAnimator();
});

window.addEventListener('resize', () => {
    if (window.asciiAnimator) {
        window.asciiAnimator.adjustAsciiFontSize();
    }
});