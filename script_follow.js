let imageStack = [];
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

let images = [];
let buttonArea = { x: 0, y: 0, width: 0, height: 0 }; // Define the button area
let rockInterval = 5; // Interval for placing rocks

function preload() {
  loadImagesIntoStack(pedrasImages);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
}

function draw() {
  background(255);

  // Draw existing images
  for (let img of images) {
    img.display();
  }

  // Leave rocks behind smoothly as the mouse moves
  leaveRockTrace();
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

function leaveRockTrace() {
  if (frameCount % rockInterval === 0) { // Control the frequency of rock placement
    let randomIndex = int(random(imageStack.length)); // Pick a random rock image
    let rockImage = imageStack[randomIndex];
    
    // Only place rock images if mouse is outside the button area
    if (!(mouseX > buttonArea.x && mouseX < buttonArea.x + buttonArea.width &&
          mouseY > buttonArea.y && mouseY < buttonArea.y + buttonArea.height)) {
      let newRock = new DraggableImage(rockImage, mouseX, mouseY, random(50, 100), random(50, 100));
      images.push(newRock); // Add it to the array of images
    }
  }
}

class DraggableImage {
  constructor(img, x, y, w, h) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

