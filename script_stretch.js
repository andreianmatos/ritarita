let rocksImages = [
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

let images = [];
let zoomFactors = [];
let zoomSpeeds = [];
let movementOffsets = [];
let zoomOffsets = [];
const baseSpeed = 0.00001; // Base speed for movement and zoom noise
const movementRange = 5000; // Larger movement range for the images

function preload() {
  rocksImages.forEach(url => {
    loadImage(url, img => {
      images.push(img);
      // Initialize zoom factors and noise offsets for each image
      zoomFactors.push(1);
      zoomSpeeds.push(random(0.001, 0.05)); // Random zoom speed
      movementOffsets.push(random(0, 100)); // Initial noise offset for movement
      zoomOffsets.push(random(0, 1000)); // Initial noise offset for zoom
    }, () => {
      console.log(`Failed to load image: ${url}`);
    });
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop(); // Stop the initial loop until all images are loaded
}

function draw() {
  clear(); // Clear canvas to maintain no background

  let numImages = images.length;

  for (let i = 0; i < numImages; i++) {
    let img = images[i];

    // Use Perlin noise for smooth movement and zoom
    let x = width / 2 + (movementRange) * (noise(movementOffsets[i]) - 0.5);
    let y = height / 2 + (movementRange) * (noise(movementOffsets[i] + 10000) - 0.5);
    
    zoomFactors[i] = 0.5 + 0.5 * noise(zoomOffsets[i]);
    
    let currentWidth = img.width * zoomFactors[i];
    let currentHeight = img.height * zoomFactors[i];

    push();
    translate(x, y);
    imageMode(CENTER);
    image(img, 0, 0, currentWidth, currentHeight);
    pop();

    // Update noise offsets for the next frame
    movementOffsets[i] += baseSpeed + zoomSpeeds[i];
    zoomOffsets[i] += baseSpeed;
  }
}

// Start the animation loop once all images are loaded
function checkImagesLoaded() {
  if (images.length === rocksImages.length) {
    loop(); // Start animation loop once images are loaded
  } else {
    setTimeout(checkImagesLoaded, 100); // Check again after a short delay
  }
}

// Call checkImagesLoaded after preload completes
function preload() {
  rocksImages.forEach(url => {
    loadImage(url, img => {
      images.push(img);
      // Initialize zoom factors and noise offsets for each image
      zoomFactors.push(1);
      zoomSpeeds.push(random(0.001, 0.005)); // Random zoom speed
      movementOffsets.push(random(0, 10000)); // Initial noise offset for movement
      zoomOffsets.push(random(0, 10000)); // Initial noise offset for zoom
    }, () => {
      console.log(`Failed to load image: ${url}`);
    });
  });
  checkImagesLoaded(); // Start checking for loaded images
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
