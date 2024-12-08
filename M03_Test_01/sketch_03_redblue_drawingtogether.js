// number of points for the Superformula
 // smaller value =  more angular or polygonal shape with fewer points, larger value = smoother and more continuous the shape will look
 // kinda like 3D polygons (more polygons, finer details)
 let numPoints = 5;

 let x, y, z;
 
 // radius = determines the local distance of each point on the shape from the center
 // uScale affects the r (increasing uScale will lead to a larger shape)
 let r = 10;
 
 // spacing between the points around the shape (i.e angular distance between each point)
 // smaller value = points are closer together, larger value = points are further apart
 let angleStep = 20;
 
 // determines the points around the circle (polar coordinates).
 // (i.e. angle used to generate the points around the shape)
 let currentAngle = 0;
 
 // controls the pointiness, symmetry and overall structure of the shape (i.e how many lobes the shape will have)
 // useful for creating stars and flowers
 // smaller value = more gentle, higher value = more spiky
 let spikeFactor = 1;
 
 // exponents (powers) that affect the shape’s complexity and curvature
 let sharpControl = -1; // controls the sharpness of the overall shape (lower values = sharper edges, higher values = rounder edges)
 let xControl = 0; // xControl and yControl controls x/y values that distort the the curvature of the shape, giving it a more lopsided or curvy look depending on their values
 let yControl = 0;
 
 // overall scaling factors
 let uScale = 200; // controls the uniform scaling of the shape 
 let xScale = 1; // x direction
 let yScale = 1;  // y direction
 



let mSerial;
let connectButton;

let redButton, blueButton;

let redPosX, redPosY;  // Variables to store the red circle's position
let redDrawn = false;  // Flag to track if the red circle has been drawn

let bluePosX, bluePosY; // Variables to store the blue circle's position
let blueDrawn = false;  // Flag to track if the blue circle has been drawn

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
    stroke(255, 0, 0, 35);
    strokeWeight(2);
    ellipse(redPosX, redPosY, 100);  // Draw the red circle at the generated position
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