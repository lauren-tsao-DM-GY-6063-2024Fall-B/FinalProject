let numPoints = 5; // this gives the white inner outlines
let x, y;
let r = 10;

let angleStep = 20;
let currentAngle = 0; // Initialize currentAngle globally
let spikeFactor = 1;

let sharpControl = -1;
let xControl = 0;
let yControl = 0;

let uScale = 200; // Define uScale globally
let xScale = 1;
let yScale = 1;
 

let mSerial;
let connectButton;

let redButton, blueButton;

let redPosX, redPosY;  // Variables to store the red circle's position
let redDrawn = false;  // Flag to track if the red circle has been drawn

let bluePosX, bluePosY; // Variables to store the blue circle's position
let blueDrawn = false;  // Flag to track if the blue circle has been drawn

let mPiano;
let mPianoVol;

// load song stems
function preload() {
  mPiano = loadSound("../assets/piano.mp3");
}


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
    mPiano.play();
    mPiano.loop();
  }
}

function setup() {
  background(255);
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

  //// RED BUTTON ////

  // Only generate a new random position when redButton is pressed (changes to 0)
  if (redButton === 0 && !redDrawn) {

    // Generate new random position
    redPosX = random(width);  // New random X position
    redPosY = random(height); // New random Y position

    spikeFactor = int(random(30, 40)); // smaller value = simpler, circular or polygonal shapes, larger value = more complex star-like shapes.
    sharpControl = random(20); // lowering = sharper edges
    xControl = random(100); // adjust xControl and yControl to adjust form, (e.g. one side longer or curvier than the other)
    yControl = random(6);
    uScale = random(100, 300); // range of randomized uniform sizes
    angleStep = random(8, 10); // different levels of smoothness of shapes

    mPiano.setVolume(1)

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

    mPiano.setVolume(0)
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