// Global variables
let imageStack = [];
let images = [];
let isAnimating = false;
let trailCanvas;
let numOfActiveRocks; // Number of rocks that will move at once
let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Letters for trails

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

function preload() {
  loadImagesIntoStack(pedrasImages);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a separate canvas for trails to persist
  trailCanvas = createGraphics(windowWidth, windowHeight);
  trailCanvas.background(255);
  
  // Initialize images around the screen edges (frame)
  for (let img of imageStack) {
    let x, y;

    // Randomly choose one of four sides (top, bottom, left, right)
    let side = floor(random(4));
    switch (side) {
      case 0: // Top side
        x = random(width);
        y = 0;
        break;
      case 1: // Bottom side
        x = random(width);
        y = height - 100;
        break;
      case 2: // Left side
        x = 0;
        y = random(height);
        break;
      case 3: // Right side
        x = width - 100;
        y = random(height);
        break;
    }

    images.push(new Pedra(img, x, y, 100, 100));
  }

  // Set the number of active rocks to the total number of rocks
  numOfActiveRocks = images.length;
}

function draw() {
  // Show the persistent trail layer
  image(trailCanvas, 0, 0);

  if (isAnimating) {
    // Update and display all images
    for (let img of images) {
      img.update();
    }
    for (let img of images) {
      img.display();
    }
  } else {
    // Draw static images
    for (let img of images) {
      img.display();
    }
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

function mousePressed() {
  if (!isAnimating) {
    isAnimating = true;
    // Randomly select rocks to animate
    for (let img of images) {
      img.setRandomTarget();
    }
  } else {
    // Reset rocks and stop the animation on mouse click
    isAnimating = false;
    for (let img of images) {
      img.reset();
    }
  }
}

// Pedra class to manage rock behavior and trail
class Pedra {
  constructor(img, x, y, maxW, maxH) {
    this.img = img;
    this.x = x;
    this.y = y;

    // Calculate aspect ratio to avoid stretching
    let imgAspectRatio = img.width / img.height;
    if (imgAspectRatio > 1) {
      // Image is wider than it is tall
      this.w = maxW;
      this.h = maxW / imgAspectRatio;
    } else {
      // Image is taller than it is wide
      this.h = maxH;
      this.w = maxH * imgAspectRatio;
    }

    this.startX = x;
    this.startY = y;
    this.targetY = y;
    this.speed = random(1, 5); // Random speed of movement
    this.noiseOffset = random(1000); // Offset for Perlin noise
    this.letter = alphabet.charAt(floor(random(alphabet.length))); // Correct letter assignment
    this.t = 0; // Time variable for Perlin noise
    this.letterSpacing = random(20, 70); // Random distance between letters
    this.distanceTravelled = 0; // Track distance for spacing
  }

  display() {
    image(this.img, this.x, this.y, this.w, this.h); // Use the new width and height that preserves aspect ratio
  }

  update() {
    if (isAnimating) {
      this.t += 0.02; // Increment time variable for smoother movement
      let noiseX = noise(this.noiseOffset + this.t);
      let noiseY = noise(this.noiseOffset + 1000 + this.t);
      let dx = (noiseX - 0.5) * this.speed;
      let dy = (noiseY - 0.5) * this.speed;

      // Update position
      this.x += dx;
      this.y += dy;

      // Track total distance travelled
      this.distanceTravelled += dist(0, 0, dx, dy);

      // Keep the movement within bounds of the window
      this.x = constrain(this.x, 0, width - this.w);
      this.y = constrain(this.y, 0, height - this.h);

      // Draw the trail letter if enough distance has been travelled
      if (this.distanceTravelled > this.letterSpacing) {
        trailCanvas.textSize(20);
        trailCanvas.textAlign(CENTER, CENTER);
        trailCanvas.fill(0); // Black text color
        trailCanvas.text(this.letter, this.x + this.w / 2, this.y + this.h / 2);
        this.distanceTravelled = 0; // Reset the distance
      }
    }
  }

  setRandomTarget() {
    this.targetY = random(height / 2 - this.h, height / 2);
    this.noiseOffset = random(1000); // Reset noise offset for new path
  }

  reset() {
    // Reposition rocks around the screen edge, not just at the bottom
    let side = floor(random(4));
    switch (side) {
      case 0: // Top side
        this.x = random(width);
        this.y = 0;
        break;
      case 1: // Bottom side
        this.x = random(width);
        this.y = height - this.h;
        break;
      case 2: // Left side
        this.x = 0;
        this.y = random(height - this.h);
        break;
      case 3: // Right side
        this.x = width - this.w;
        this.y = random(height - this.h);
        break;
    }
    
    this.t = 0; // Reset time variable
    this.distanceTravelled = 0; // Reset distance
  }
}
