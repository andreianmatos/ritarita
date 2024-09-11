// Global variables for p5.js sketch
let imageStack = [];
let images = [];
let currentDraggedImage = null; // Track the image being dragged

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
  background(255);

  for (let img of imageStack) {
    let x = random(width - 100);
    let y = random(height - 100);
    images.push(new DraggableImage(img, x, y, 100, 100));
  }
}

function draw() {
  background(255);

  for (let img of images) {
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

function removeWhiteBackground(img) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    if (img.pixels[i] === 255 && img.pixels[i + 1] === 255 && img.pixels[i + 2] === 255) {
      img.pixels[i + 3] = 0; // Set alpha to 0
    }
  }
  img.updatePixels();
  return img;
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

function mousePressed() {
  for (let img of images) {
    img.pressed();
  }
}

function mouseReleased() {
  for (let img of images) {
    img.released();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 'S' || key === 's') {
    saveSnapshot();
  }
}

function saveSnapshot() {
  let canvasElement = document.querySelector('canvas');
  
  // Convert canvas to blob for upload
  canvasElement.toBlob(function(blob) {
    uploadImage(blob); // Call uploadImage to upload the blob
  });
}

function uploadImage(blob) {
  console.log("Uploading to Firebase...");

  // Get a reference to the storage service and define where the file will be stored
  const fileRef = window.firebaseRef(window.firebaseStorage, 'drag_images/snapshot-' + Date.now() + '.png');

  // Start the upload task
  const uploadTask = window.firebaseUploadBytesResumable(fileRef, blob);

  // Monitor the upload status
  uploadTask.on('state_changed', 
    (snapshot) => {
      // Get upload progress in percentage
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    }, 
    (error) => {
      // Handle upload errors
      console.error('Error uploading the image:', error);
    }, 
    () => {
      // Get the download URL after a successful upload
      window.firebaseGetDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at:', downloadURL);
      });
    }
  );
}

// Function to fetch image URLs from Firebase Storage
function fetchImagesFromFirebase() {
  const storage = window.firebaseStorage; // Get the Firebase storage instance
  const storageRef = window.firebaseRef(storage, 'drag_images/');
  
  // List all items in the storage directory
  window.firebaseListAll(storageRef).then((result) => {
      const imagePromises = result.items.map((itemRef) => {
          return window.firebaseGetDownloadURL(itemRef).then((url) => {
              return url;
          });
      });

      return Promise.all(imagePromises);
  }).then((urls) => {
      displayGallery(urls);
  }).catch((error) => {
      console.error('Error fetching images from Firebase:', error);
  });
}


// Function to display the gallery
function displayGallery(urls) {
  const galleryContainer = document.createElement('div');
  galleryContainer.classList.add('gallery-container');
  galleryContainer.id = 'gallery-container';

  const closeButton = document.createElement('button');
  closeButton.classList.add('button');
  closeButton.id = 'gallary-close';
  closeButton.innerText = 'X';
  closeButton.addEventListener('click', () => {
      document.body.removeChild(galleryContainer);
  });

  galleryContainer.appendChild(closeButton);

  urls.forEach((url) => {
    // Create a clickable anchor tag
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank'; // Open in a new tab

    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.margin = '10px';

    // Append image to the anchor
    anchor.appendChild(img);
    // Append anchor to the gallery container
    galleryContainer.appendChild(anchor);
  });

  document.body.appendChild(galleryContainer);
}


// Add event listener to the gallery button
document.getElementById('gallery-button').addEventListener('click', fetchImagesFromFirebase);
