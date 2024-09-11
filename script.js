let rockImage;
let rockX, rockY;  // Initial position of the rock (randomized later)
let rockSpeed = 5;  // Speed at which the rock moves
let rockWidth, rockHeight; // To maintain aspect ratio
let scaleFactor = 0.02;  // Scale down the rock image to 2% of its original size

let buttons = [];  // Array to hold button objects

// Preload rock image
function preload() {
  rockImage = loadImage('data/pedras/IMG_1523.png');  // Load your rock image here
}

// Setup the canvas and buttons in a spiral layout
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Scale the rock image while maintaining aspect ratio
  rockWidth = rockImage.width * scaleFactor;
  rockHeight = rockImage.height * scaleFactor;

  // Create spiral buttons with space between them
  createSpiralButtons();

  // Set rock's initial random position, ensuring no collision with any button
  do {
    rockX = random(width - rockWidth);  // Random x within canvas
    rockY = random(height - rockHeight); // Random y within canvas
  } while (checkInitialRockCollision());  // Repeat if rock collides with any button
}

// Draw the canvas and handle rock movement
function draw() {
  background(255);  // Clear background

  moveRock();
  displayRock();
  checkCollision();
  displayButtons();  // Display button spirals
}

// Display the rock image at its current position (maintaining aspect ratio)
function displayRock() {
  image(rockImage, rockX, rockY, rockWidth, rockHeight);  // Keep the image scaled with aspect ratio
}

// Move the rock based on arrow key inputs
function moveRock() {
  if (keyIsDown(LEFT_ARROW)) {
    rockX -= rockSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    rockX += rockSpeed;
  }
  if (keyIsDown(UP_ARROW)) {
    rockY -= rockSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    rockY += rockSpeed;
  }

  // Prevent the rock from going off-screen
  rockX = constrain(rockX, 0, width - rockWidth);
  rockY = constrain(rockY, 0, height - rockHeight);
}

// Check if the rock collides with any button
function checkCollision() {
  buttons.forEach(button => {
    // Adjust collision detection to check if the rock is within the button's area
    if (rockX + rockWidth * 0.5 > button.x &&
        rockX + rockWidth * 0.5 < button.x + button.width &&
        rockY + rockHeight * 0.5 > button.y &&
        rockY + rockHeight * 0.5 < button.y + button.height) {
      // Collision detected (rock overlaps with button)
      button.action();  // Trigger the button's action (open a page)
    }
  });
}

// Draw spiral lines instead of rectangles
function drawSpiral(x, y, width, height) {
  noFill();
  stroke(0);
  strokeWeight(2);
  
  let angle = 0;
  let radius = min(width, height) / 2;
  let angleIncrement = 0.1;  // Controls the tightness of the spiral
  let radiusIncrement = radius / (TWO_PI / angleIncrement);  // Determines how quickly the spiral expands
  
  beginShape();
  while (radius > 0) {
    let sx = x + radius * cos(angle);
    let sy = y + radius * sin(angle);
    vertex(sx, sy);
    
    angle += angleIncrement;
    radius -= radiusIncrement;
  }
  endShape();
}

// Display the buttons on the screen (using spiral lines)
function displayButtons() {
  buttons.forEach(button => {
    drawSpiral(button.x, button.y, button.width, button.height);  // Draw the spiral line as the button
  });
}

// Check if the initial position of the rock collides with any button
function checkInitialRockCollision() {
  return buttons.some(button => 
    rockX + rockWidth * 0.5 > button.x &&
    rockX + rockWidth * 0.5 < button.x + button.width &&
    rockY + rockHeight * 0.5 > button.y &&
    rockY + rockHeight * 0.5 < button.y + button.height
  );
}

function createSpiralButtons() {
  let centerX = width / 2;
  let centerY = height / 2;
  let angle = 0;
  let buttonWidth = 100;
  let buttonHeight = 50;
  let angleIncrement = TWO_PI / 6;  // Angle between each button
  let radiusIncrement = 150;    // Distance between successive buttons in the spiral
  
  // Define margin to keep buttons away from the edges
  let margin = 50;  // Margin in pixels
  
  // Ensure that the initial radius and spacing keep buttons within the canvas with margin
  let maxRadius = Math.min(width, height) / 2 - Math.max(buttonWidth, buttonHeight) / 2 - margin;
  let radius = maxRadius;

  // Create 6 buttons in a spiral format
  for (let i = 0; i < 6; i++) {
    let x = centerX + radius * cos(angle) - buttonWidth / 2;
    let y = centerY + radius * sin(angle) - buttonHeight / 2;

    // Ensure the button is within the canvas boundaries with margin
    x = constrain(x, margin, width - buttonWidth - margin);
    y = constrain(y, margin, height - buttonHeight - margin);

    let actionUrl;
    switch (i) {
      case 0:
        actionUrl = 'grid.html';
        break;
      case 1:
        actionUrl = 'drag.html';
        break;
      case 2:
        actionUrl = 'dance.html';
        break;
      case 3:
        actionUrl = 'draw.html';
        break;
      case 4:
        actionUrl = 'stretch.html';
        break;
      case 5:
        actionUrl = 'follow.html';
        break;
      default:
        actionUrl = '#';  // Default to '#' if something goes wrong
    }

    buttons.push({
      x: x,
      y: y,
      width: buttonWidth,
      height: buttonHeight,
      action: () => navigateTo(actionUrl)  // Navigate to specific page
    });

    // Increment the angle and radius for the next button in the spiral
    angle += angleIncrement;
    radius += radiusIncrement;
  }
}


// Action triggered to navigate to a page
function navigateTo(url) {
  window.location.href = url;  // Redirect to the specified URL
}

// Resize canvas when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
