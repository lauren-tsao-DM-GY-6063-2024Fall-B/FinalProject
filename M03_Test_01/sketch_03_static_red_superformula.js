let numPoints = 500;
let x, y;
let r;
let uScale = 1; // Define uScale globally
let angleStep = 0.05;
let currentAngle = 0; // Initialize currentAngle globally
let spikeFactor = 6;
let sharpControl = 1;
let xControl = 1;
let yControl = 1;
let xScale = 100;
let yScale = 100;
 

let mSerial;
let connectButton;

let redButton, blueButton;

let redPosX, redPosY;  // Variables to store the red circle's position
let redDrawn = false;  // Flag to track if the red circle has been drawn

let bluePosX, bluePosY; // Variables to store the blue circle's position
let blueDrawn = false;  // Flag to track if the blue circle has been drawn



//superformula function
function superformula(xCenter, yCenter, xScale, yScale, spikeFactor, xControl, yControl, sharpControl, angleStep, numPoints) {
  beginShape();
  translate(xCenter, yCenter);
  for (let i = 1; i < numPoints; i++) {
    r = uScale * pow(((pow(abs(cos(spikeFactor * currentAngle / 4) / xScale), xControl)) + (pow(abs(sin(spikeFactor * currentAngle / 4) / yScale), yControl))), (-1 / sharpControl)); // Superformula formula
    currentAngle = currentAngle + angleStep;
    x = r * cos(currentAngle);
    y = r * sin(currentAngle);
    curveVertex(x, y);
  }
  endShape();
}



function receiveSerial() {
  let line = mSerial.readUntil("\n"); // read from serial line (println from Arduino) until it gets to the end of the line

  if (line) {
    print(line); // print received line to JavaScript console

    // splitting the line into sensor values
    let buttonValues = split(line, ','); // split line at ','

    if (buttonValues.length === 3) { // if there are exactly 3 values in the array after splitting..
      let buttonV1 = int(buttonValues[0]); // first sensor value
      let buttonV2 = int(buttonValues[1]); // second sensor value
      let buttonV3 = int(buttonValues[2]); // third sensor value

      // map the sensor values to appropriate ranges
      redButton = buttonV1;  // Set the redButton value to buttonV1
      blueButton = buttonV2;  // Set the blue Button value to buttonV2
    }
  }
}

// function to connect to the serial port
function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600); // make sure this is the same speed as Serial.begin in Arduino
    connectButton.hide(); // hide the connect button once connected
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // set initial values
  redButton = 1;
  blueButton = 1;

  // create a serial connection
  mSerial = createSerial(); // from the p5.js serial library

  // create button to connect to the serial port
  connectButton = createButton("Click me to connect To Serial!");
  connectButton.position(width / 2 - 210, height / 2);

  // styling the button
  connectButton.style('font-family', 'Courier New');
  connectButton.style('font-size', '24px');
  connectButton.style('color', '#ffffff');
  connectButton.style('background-color', '#007bff');
  connectButton.style('border', '2px solid #0056b3');

  connectButton.mousePressed(connectToSerial); // execute connectToSerial when button is pressed
}

function draw() {
  background(255);

  //// RED BUTTON ////

  // Only generate a new random position when redButton is pressed (changes to 0)
  if (redButton === 0 && !redDrawn) {
    // Generate new random position
    redPosX = random(width);  // New random X position
    redPosY = random(height); // New random Y position

    redDrawn = true;  // Set flag to true to prevent multiple position updates
  }

  // Draw the red circle at the generated position
  if (redDrawn) {
    stroke(0, random(0, 200), random(255), 35); // (color, alpha value)
    strokeWeight(2);
    superformula(redPosX, redPosY, xScale, yScale, spikeFactor, xControl, yControl, sharpControl, angleStep, numPoints);
  }

  // Reset the circle when the button goes back to a state other than 0
  if (redButton !== 0) {
    redDrawn = false;
  }

  //// BLUE BUTTON ////

  // Only generate a new random position when blueButton is pressed (changes to 0)
  if (blueButton === 0 && !blueDrawn) {
    // Generate new random position
    bluePosX = random(width);  // New random X position
    bluePosY = random(height); // New random Y position

    blueDrawn = true;  // Set flag to true to prevent multiple position updates
  }

  // Draw the blue circle at the generated position
  if (blueDrawn) {
    stroke(0, random(0, 200), random(255), 35);
    strokeWeight(2);
    ellipse(bluePosX, bluePosY, 100);  // Draw the blue circle at the generated position
  }

  // Reset the circle when the button goes back to a state other than 0
  if (blueButton !== 0) {
    blueDrawn = false;
  }

  // Check if serial data is available and process it
  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    receiveSerial();
  }
}
