// Global variables for p5.js sketch
let imageStack = [];
let images = [];
let currentDraggedImage = null; // Track the image being dragged

let pedrasImages = [
  'data/pedras/IMG_1523.png',
  'data/pedras/IMG_1523_neg.png',
  'data/pedras/IMG_1527.png',
  'data/pedras/IMG_1527c.png',
  'data/pedras/IMG_1527inv.png',
  'data/pedras/IMG_1527invert.png',
  'data/pedras/IMG_1528invert.png',
  'data/pedras/IMG_1529.png',
  'data/pedras/IMG_1530.png',
  'data/pedras/IMG_1534.png',
  'data/pedras/IMG_1534inv.png',
  'data/pedras/IMG_4761.png',
  'data/pedras/IMG_4762.png',
  'data/pedras/IMG_4765.png',
  'data/pedras/IMG_4766.png',
  'data/pedras/IMG_4771.png',
  'data/pedras/IMG_4773.png',
  'data/pedras/IMG_4778.png',
  'data/pedras/IMG_4783.png',
  'data/pedras/IMG_4794.png',
  'data/pedras/IMG_4800.png',
  'data/pedras/IMG_15282.png'
];

let connections = [];
let targetPositions = [];
let transitionSpeed = 0.01; // Adjust for slower or faster movement
let maxConnectionsPerImage = 3; // Maximum number of random connections per image
let moveInterval = 3000; // Time interval to change target positions in milliseconds
let lastMoveTime = 0;

function preload() {
  loadImagesIntoStack(pedrasImages);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  
  // Load and initialize images
  for (let img of imageStack) {
    let x = random(width - 100);
    let y = random(height - 100);
    images.push(new DraggableImage(img, x, y, 100, 100));
    targetPositions.push({ x: x, y: y }); // Initialize target positions
  }
  
  // Create random connections
  createRandomConnections();
}

function draw() {
  background(255);
  
  // Check if it's time to update target positions
  if (millis() - lastMoveTime > moveInterval) {
    updateTargetPositions();
    lastMoveTime = millis();
  }
  
  // Draw connections
  stroke(0);
  strokeWeight(1);
  dashLine();
  
  // Update and display images
  for (let i = 0; i < images.length; i++) {
    let img = images[i];
    let target = targetPositions[i];
    
    // Interpolate position
    img.x += (target.x - img.x) * transitionSpeed;
    img.y += (target.y - img.y) * transitionSpeed;
    
    img.display();
    img.update();
  }
}

function loadImagesIntoStack(images) {
  images.forEach(url => {
    loadImage(url, img => {
      imageStack.push(img);
      console.log(`Image loaded successfully: ${url}`);
    }, () => {
      console.log(`Failed to load image: ${url}`);
    });
  });
}

// Function to update target positions continuously
function updateTargetPositions() {
  for (let i = 0; i < images.length; i++) {
    targetPositions[i] = {
      x: random(width - 100),
      y: random(height - 100)
    };
  }
}

// Function to draw dashed lines between connected images
function dashLine() {
  for (let connection of connections) {
    let img1 = connection[0];
    let img2 = connection[1];
    
    let x1 = img1.x + img1.w / 2;
    let y1 = img1.y + img1.h / 2;
    let x2 = img2.x + img2.w / 2;
    let y2 = img2.y + img2.h / 2;
    
    let dashLength = 10;
    let gapLength = 5;
    let totalLength = dist(x1, y1, x2, y2);
    let numDashes = floor(totalLength / (dashLength + gapLength));
    
    let angle = atan2(y2 - y1, x2 - x1);
    
    for (let i = 0; i < numDashes; i++) {
      let startX = x1 + i * (dashLength + gapLength) * cos(angle);
      let startY = y1 + i * (dashLength + gapLength) * sin(angle);
      let endX = startX + dashLength * cos(angle);
      let endY = startY + dashLength * sin(angle);
      
      line(startX, startY, endX, endY);
    }
  }
}

// Function to create random connections among images
function createRandomConnections() {
  connections = []; // Clear previous connections
  for (let i = 0; i < images.length; i++) {
    let connectionsCount = 0;
    while (connectionsCount < random(maxConnectionsPerImage)) {
      let j = floor(random(images.length));
      if (i !== j && !connections.some(c => (c[0] === images[i] && c[1] === images[j]) || (c[0] === images[j] && c[1] === images[i]))) {
        connections.push([images[i], images[j]]);
        connectionsCount++;
      }
    }
  }
}

class DraggableImage {
  constructor(img, x, y, maxW, maxH) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.maxW = maxW;
    this.maxH = maxH;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    
    // Calculate dimensions that maintain aspect ratio
    this.calculateDimensions();
  }

  calculateDimensions() {
    let imgAspect = this.img.width / this.img.height;
    let maxAspect = this.maxW / this.maxH;

    if (imgAspect > maxAspect) {
      this.w = this.maxW;
      this.h = this.maxW / imgAspect;
    } else {
      this.h = this.maxH;
      this.w = this.maxH * imgAspect;
    }
  }

  display() {
    image(this.img, this.x, this.y, this.w, this.h);
  }

  update() {
    if (this.dragging && currentDraggedImage === this) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  pressed() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
      currentDraggedImage = this; // Set the current dragged image
    }
  }

  released() {
    this.dragging = false;
    if (currentDraggedImage === this) {
      currentDraggedImage = null; // Reset when released
    }
  }
}