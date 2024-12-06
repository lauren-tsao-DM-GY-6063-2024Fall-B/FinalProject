let mSerial;
let connectButton;

let redButton, blueButton;

let circlePosX, circlePosY;  // Variables to store the circle's position
let circleDrawn = false;  // Flag to track if the circle has been drawn

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
  if (redButton === 0 && !circleDrawn) {
    // Generate new random position
    circlePosX = random(width);  // New random X position
    circlePosY = random(height); // New random Y position

    circleDrawn = true;  // Set flag to true to prevent multiple position updates
  }

  // Draw the circle at the generated position
  if (circleDrawn) {
    translate(circlePosX, circlePosY);
    stroke(0, random(0, 200), random(255), 35);
    strokeWeight(2);
    ellipse(0, 0, 100);  // Draw the circle at the generated position
  }

  // Reset the circle when the button goes back to a state other than 0
  if (redButton !== 0) {
    circleDrawn = false;
  }

  // Check if serial data is available and process it
  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    receiveSerial();
  }

}
