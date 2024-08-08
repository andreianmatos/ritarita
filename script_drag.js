    // Global variables for p5.js sketch
    let imageStack = []; 
    let images = []; 

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
      loadImagesIntoStack(palavrasImages);
      loadImagesIntoStack(pedrasImages);
    }

    function setup() {
      createCanvas(windowWidth, windowHeight); 
      background(255); 

      for (let img of imageStack) {
        let x = random(width - 100);
        let y = random(height - 100);
        images.push(new DraggableImage(removeWhiteBackground(img), x, y, 100, 100));
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
      constructor(img, x, y, w, h) {
        this.img = img;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
      }

      display() {
        image(this.img, this.x, this.y, this.w, this.h);
      }

      update() {
        if (this.dragging) {
          this.x = mouseX + this.offsetX;
          this.y = mouseY + this.offsetY;
        }
      }

      pressed() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
          this.dragging = true;
          this.offsetX = this.x - mouseX;
          this.offsetY = this.y - mouseY;
        }
      }

      released() {
        this.dragging = false;
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