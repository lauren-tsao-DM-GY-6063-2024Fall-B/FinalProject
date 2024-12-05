let mSerial;

let connectButton;

let cBackgroundColor;

function receiveSerial() {
  let line = mSerial.readUntil("\n"); // read from serial line (println from Arduino) until gets to the end of the line
  print(line);

  let sensorVal = int(line); // making sure its a number
  cBackgroundColor = map(sensorVal, 0, 30, 0, 255, true); // map that number to the color, true makes sure that the map function does not give a number smaller than 0 or greater than 255

  // TODO: assign to color
}

// MAKE SURE TO CLOSE SERIAL MONITOR IN ARDUINO (only one serial monitor can be run in one time)
function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600); // make sure this is the same speed as the Serial.begin in the .ino file
    connectButton.hide();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  cBackgroundColor = 0;

  mSerial = createSerial(); // from the web serial library

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial); // if this button is pressed, it would execute connectToSerial()
}


function draw() {
  background(cBackgroundColor);

  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    receiveSerial();
  }
}
