let numPoints = 60;
let strokeColor = 0;
let x, y, z;
let r, currentAngle = 0;
let angleStep = 0.1;
let uScale = 200;
let spikeFactor = 1;
let sharpControl = -1;
let xControl = 0
let yControl = 0;
let xScale = 1;
let yScale = 1;
let randomX, randomY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  fill(255);
}

function draw() {
  // only draw when random x and y positions have been set
  // undefined = declare a variable but no value is assigned to it
  if (randomX !== undefined && randomY !== undefined) { // if randomX and random Y is not equal to undefined (i.e defined)..
    translate(randomX, randomY);  // .. move origin point to random position and draw the shape

    stroke(strokeColor, 35);
    beginShape();
    for (let i = 1; i < numPoints; i++) {
      r = uScale * pow(((pow(abs(cos(spikeFactor * currentAngle / 4) / xScale), xControl)) + (pow(abs(sin(spikeFactor * currentAngle / 4) / yScale), yControl))), (-1 / sharpControl)); // Superformula formula
      currentAngle = currentAngle + angleStep;
      x = r * cos(currentAngle);
      y = r * sin(currentAngle);
      curveVertex(x, y);
    }
    endShape();
  } 

  // if the mouse is pressed, randomX and randomY values will be defined, allowing the shape to be drawn
  if (mouseIsPressed) {
    randomX = random(width);  
    randomY = random(height); 
    
    // draw shape following these randomized parameters
    spikeFactor = int(random(3, 40)); 
    sharpControl = random(0.5);
    xControl = random(6); 
    uScale = random(100, 200);
    angleStep = random(0.05, 10);
  }
}
