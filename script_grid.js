// Global variables for p5.js sketch
let imageStack = []; 
let imageStackCopy = []; 
let numImagesToShow; 
let gridSize = 5; 
let squareSize; 
let gridStrokeWeight; 
let borderStrokeWeight; 
let totalGridSize; 
let startX, startY; 
let repeatImages = true; 
let availableSquares = []; 
let frameCounter = 0; 

// Variables to store frame rate and slider element
let customFrameRate = 1; // Default starting frame rate
let framerateSlider; // Slider element

let palavrasImages = [
'data/palavras/abertura.jpg',
'data/palavras/abracar.jpg',
'data/palavras/acaso.jpg',
'data/palavras/acontecer.jpg',
'data/palavras/adentrar.jpg',
'data/palavras/aflorar.jpg',
'data/palavras/agir.jpg',
'data/palavras/agora.jpg',
'data/palavras/alcancar.jpg',
'data/palavras/alperce.jpg',
'data/palavras/amanha.jpg',
'data/palavras/amor.jpg',
'data/palavras/amplitude.jpg',
'data/palavras/analogo.jpg',
'data/palavras/anseio.jpg',
'data/palavras/aqui.jpg',
'data/palavras/ar.jpg',
'data/palavras/arder.jpg',
'data/palavras/asa.jpg',
'data/palavras/ascender.jpg',
'data/palavras/atipico.jpg',
'data/palavras/atravessar.jpg',
'data/palavras/avesso.jpg'
];

let pedrasImages = [
'data/pedras/IMG_1523.png',
'data/pedras/IMG_1523_neg.png',
'data/pedras/IMG_15282.png',
'data/pedras/IMG_1528invert.png',
'data/pedras/IMG_1534.png',
'data/pedras/IMG_1534inv.png'
];

function preload() {
// Load images asynchronously before setup
loadImagesIntoStack(palavrasImages);
loadImagesIntoStack(pedrasImages);
}

function setup() {
createCanvas(701, 701); // Adjust canvas size
background(255); 

squareSize = width / gridSize;
gridStrokeWeight = width / 600; 
borderStrokeWeight = width / 200; 

// Calculate the total size occupied by the grid
totalGridSize = gridSize * squareSize;

// Calculate the starting positions to center the grid horizontally and vertically
startX = (width - totalGridSize) / 2;
startY = (height - totalGridSize) / 2;

// Copy imageStack to imageStackCopy
imageStackCopy = [...imageStack];

frameRate(1); 

setupSlider();

// Add event listener to the button
document.getElementById('navigate-button').addEventListener('click', function() {
    window.location.href = 'drag.html'; // Redirect to drag.html
});
}

// Load all images from the specified URLs into the stack
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

// Custom shuffle function for array
function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
    let index = Math.floor(Math.random() * (i + 1));
    let temp = array[index];
    array[index] = array[i];
    array[i] = temp;
}
}

// Function to initialize slider and its event listener
function setupSlider() {
framerateSlider = document.getElementById('framerate-slider');
framerateSlider.addEventListener('input', function() {
    customFrameRate = parseInt(this.value);
    frameRate(customFrameRate); // Update p5.js frame rate
});
}

function draw() {
background(255); 

imageStackCopy = [...imageStack];

// Draw the grid of squares
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
    let x = startX + i * squareSize;
    let y = startY + j * squareSize;
    
    stroke(0);
    strokeWeight(gridStrokeWeight); 
    
    // Horizontal line
    for (let k = x; k <= x + squareSize; k += 10) {
        point(k, y);
    }
    
    // Vertical line
    for (let k = y; k <= y + squareSize; k += 10) {
        point(x, k);
    }
    }
}

// Clear and regenerate availableSquares list
availableSquares = [];
for (let i = 0; i < gridSize * gridSize; i++) {
    availableSquares.push(i); // Add all grid squares back to availableSquares
}

// Randomly choose how many images to show (between 1 and availableSquares.length)
numImagesToShow = Math.min(Math.floor(Math.random() * (availableSquares.length)) + 1, gridSize * gridSize);

// Place images in the grid squares
for (let n = 0; n < numImagesToShow; n++) {
    if (availableSquares.length === 0 || imageStackCopy.length === 0) {
    break; 
    }

    let index = Math.floor(Math.random() * availableSquares.length);
    let squareIndex = availableSquares[index];
    availableSquares.splice(index, 1); 
    
    let i = squareIndex % gridSize;
    let j = Math.floor(squareIndex / gridSize);
    
    let x = startX + i * squareSize;
    let y = startY + j * squareSize;
    
    // Calculate a margin for placing images within each square
    let margin = 10; 

    shuffleArray(imageStackCopy);

    let img;
    if (repeatImages) {
    // If repeatImages is true, use the first image without removing
    img = imageStackCopy[0];
    } else {
    // Pop an image from the copy of the stack
    img = imageStackCopy.shift();
    }
    
    // Calculate image dimensions to fit within the square
    let imgWidth, imgHeight;
    let imgRatio = img.width / img.height;
    if (img.width > img.height) {
    imgWidth = squareSize - 2 * margin;
    imgHeight = imgWidth / imgRatio;
    } else {
    imgHeight = squareSize - 2 * margin;
    imgWidth = imgHeight * imgRatio;
    }
    
    // Calculate image position to center within the square
    let imgX = x + margin + (squareSize - 2 * margin - imgWidth) / 2;
    let imgY = y + margin + (squareSize - 2 * margin - imgHeight) / 2;
    
    image(img, imgX, imgY, imgWidth, imgHeight);
}

// Draw the white border around the entire grid
strokeWeight(borderStrokeWeight); 
stroke(255); 
noFill(); 
rect(startX, startY, totalGridSize, totalGridSize); 

frameRate(customFrameRate);
}