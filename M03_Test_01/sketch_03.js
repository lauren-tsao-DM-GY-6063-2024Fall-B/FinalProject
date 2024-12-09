let numPoints = 5; // this gives the white inner outlines
let x, y;
let r = 10;

// RED SUPERFORMULA VARIABLES
let angleStep = 20;
let currentAngle = 0; // Initialize currentAngle globally
let spikeFactor = 1;
let sharpControl = -1;
let xControl = 0;
let yControl = 0;
let uScale = 200; // Define uScale globally
let xScale = 1;
let yScale = 1; 

// GREEN SUPERFORMULA VARIABLES
let GnumPoints = 100; // this gives the white inner outlines
let Gx, Gy;
let Gr = 10;

let GangleStep = 20;
let GcurrentAngle = 0; // Initialize currentAngle globally
let GspikeFactor = 1;
let GsharpControl = -1;
let GxControl = 0;
let GyControl = 0;
let GuScale = 200; // Define uScale globally
let GxScale = 1;
let GyScale = 1; 

// TRANSPARENCY OBJECT
let opacity = { red: 35, blue: 35, yellow: 255, green: 50 };

let mSerial;
let connectButton;

let redButton, blueButton, yellowButton, greenButton;

let redPosX, redPosY;  // Variables to store the red circle's position
let redDrawn = false;  // Flag to track if the red circle has been drawn

let bluePosX, bluePosY; // Variables to store the blue circle's position
let blueDrawn = false;  // Flag to track if the blue circle has been drawn

let yellowPosX, yellowPosY;
let yellowDrawn = false;

let greenPosX, greenPosY;
let greenDrawn = false;

let mPiano, mPercStrings;
let mPianoVol, mPercStringsVol;

// load song stems
function preload() {
  mPiano = loadSound("../assets/piano.mp3");
  mPercStrings = loadSound("../assets/percussion_strings.mp3");
  mKickSnares = loadSound("../assets/kicks_snares.mp3");
  mSynths = loadSound("../assets/synths.mp3")
}


//red superformula function
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

//green superformula function
function Gsuperformula(GxCenter, GyCenter, GxScale, GyScale, GspikeFactor, GxControl, GyControl, GsharpControl, GangleStep, GnumPoints) {
  beginShape();
  translate(GxCenter, GyCenter);
  for (let i = 1; i < GnumPoints; i++) {
    Gr = GuScale * pow(((pow(abs(cos(GspikeFactor * GcurrentAngle / 4) / GxScale), GxControl)) + (pow(abs(sin(GspikeFactor * GcurrentAngle / 4) / GyScale), GyControl))), (-1 / GsharpControl)); // Superformula formula
    GcurrentAngle = GcurrentAngle + GangleStep;
    Gx = Gr * cos(GcurrentAngle);
    Gy = Gr * sin(GcurrentAngle);
    curveVertex(Gx, Gy);
  }
  endShape();
}



function receiveSerial() {
  let line = mSerial.readUntil("\n"); // read from serial line (println from Arduino) until it gets to the end of the line

  if (line) {
    print(line); // print received line to JavaScript console

    // splitting the line into sensor values
    let buttonValues = split(line, ','); // split line at ','

    if (buttonValues.length === 4) { // if there are exactly 3 values in the array after splitting..
      let buttonV1 = int(buttonValues[0]); // first sensor value
      let buttonV2 = int(buttonValues[1]); // second sensor value
      let buttonV3 = int(buttonValues[2]); // third sensor value
      let buttonV4 = int(buttonValues[3]); // third sensor value

      // map the sensor values to appropriate ranges
      redButton = buttonV1;  // Set the redButton value to buttonV1
      blueButton = buttonV2;  // Set the blue Button value to buttonV2
      yellowButton = buttonV3;
      greenButton = buttonV4;
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
    mPercStrings.play();
    mPercStrings.loop();
    mKickSnares.play();
    mKickSnares.loop();
    mSynths.play();
    mSynths.loop();
  }
}

function setup() {
  background(255);
  createCanvas(windowWidth, windowHeight);

  // set initial values
  redButton = 1;
  blueButton = 1;
  yellowButton = 1;
  greenButton = 1;

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
    push();

    blendMode(MULTIPLY);
    stroke(255, 0, random(100, 255), opacity.red); // (color, alpha value)
    strokeWeight(2);

    superformula(redPosX, redPosY, xScale, yScale, spikeFactor, xControl, yControl, sharpControl, angleStep, numPoints);
    
    pop();
  }

  // Reset the circle when the button goes back to a state other than 0
  if (redButton !== 0) {
    redDrawn = false;

    mPiano.setVolume(0)
  }

  //// BLUE BUTTON ////

  // Only generate a new random position when blueButton is pressed (changes to 0)
  if (blueButton === 0 && !blueDrawn) {

    mPercStrings.setVolume(1)

    blueDrawn = true;  // Set flag to true to prevent multiple position updates
  }

  // Draw the blue circle at the generated position
  if (blueDrawn) {
    push();

    blendMode(SCREEN);
    bluePosX = random(width);  // New random X position
    bluePosY = random(height); // New random Y position
    fill(255);
    stroke(0, random(0, 200), random(255), opacity.blue);;
    ellipse(bluePosX, bluePosY, random(50, 100));  // Draw the blue circle at the generated position

    pop();
  }

  // Reset the circle when the button goes back to a state other than 0
  if (blueButton !== 0) {
    blueDrawn = false;

    mPercStrings.setVolume(0)
  }

  //// YELLOW BUTTON ////

  // Only generate a new random position when blueButton is pressed (changes to 0)
  if (yellowButton === 0 && !yellowDrawn) {

    mKickSnares.setVolume(1)

    yellowDrawn = true;  // Set flag to true to prevent multiple position updates
  }

  // Draw the blue circle at the generated position
  if (yellowDrawn) {
    push();

    blendMode(HARD_LIGHT);
    yellowPosX = random(width);  // New random X position
    yellowPosY = random(height); // New random Y position
    stroke(random(200, 236), random(200, 215), 0, opacity.yellow);
    strokeWeight(1);
    noFill();
    rect(yellowPosX, yellowPosY, random(100, 300));  // Draw the yellow square at the generated position

    pop();
  }

  // Reset the circle when the button goes back to a state other than 0
  if (yellowButton !== 0) {
    yellowDrawn = false;

    mKickSnares.setVolume(0)
  }

  //// GREEN BUTTON ////

  // Only generate a new random position when redButton is pressed (changes to 0)
  if (greenButton === 0 && !greenDrawn) {

    mSynths.setVolume(1)

    greenDrawn = true;  // Set flag to true to prevent multiple position updates
  }

  // Draw the red circle at the generated position
  if (greenDrawn) {
    push();

    greenPosX = random(width);  // New random X position
    greenPosY = random(height); // New random Y position

    GspikeFactor = int(random(100, 150)); // smaller value = simpler, circular or polygonal shapes, larger value = more complex star-like shapes.
    GsharpControl = random(20); // lowering = sharper edges
    GxControl = random(3); // adjust xControl and yControl to adjust form, (e.g. one side longer or curvier than the other)
    GyControl = random(5);
    GuScale = random(50, 80); // range of randomized uniform sizes
    GangleStep = random(2, 6); // different levels of smoothness of shapes

    blendMode(MULTIPLY);
    stroke(0, random(200, 255), random(255), opacity.green); // (color, alpha value)
    strokeWeight(2);

    Gsuperformula(greenPosX, greenPosY, GxScale, GyScale, GspikeFactor, GxControl, GyControl, GsharpControl, GangleStep, GnumPoints);
    
    pop();
  }

  // Reset the circle when the button goes back to a state other than 0
  if (greenButton !== 0) {
    greenDrawn = false;

    mSynths.setVolume(0)
  }

  

  // Check if serial data is available and process it
  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    receiveSerial();
  }
  
}
