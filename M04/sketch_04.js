let numPoints = 7; // this gives the superformula shapes the white inner outlines
let x, y;
let r = 1;

// RED SUPERFORMULA VARIABLES
let angleStep = 20;
let currentAngle = 0;
let spikeFactor = 1;
let sharpControl = -1;
let xControl = 0;
let yControl = 0;
let uScale = 200;
let xScale = 1;
let yScale = 1; 

// GREEN SUPERFORMULA VARIABLES
let GnumPoints = 100;
let Gx, Gy;
let Gr = 10;

let GangleStep = 20;
let GcurrentAngle = 0;
let GspikeFactor = 1;
let GsharpControl = -1;
let GxControl = 0;
let GyControl = 0;
let GuScale = 200;
let GxScale = 1;
let GyScale = 1; 

// TRANSPARENCY OBJECT
let opacity = { red: 35, blue: 35, yellow: 255, green: 50 };

let mSerial;
let connectButton;

let redButton, blueButton, yellowButton, greenButton;

let redPosX, redPosY;  // to store the red shape's position
let redDrawn = false;  // set initial state to false (i.e no red shape drawn)

let redDrawnTimeStamp = 0; // stores last time red shape was drawn
let redInterval = 5000; // set the interval between drawing of red shapes

let bluePosX, bluePosY;
let blueDrawn = false;

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


// RED SUPERFORMULA FUNCTION
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

// GREEN SUPERFORMULA FUNCTION
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
  let line = mSerial.readUntil("\n");

  if (line) {
    print(line);

    // splitting the line into button values
    let buttonValues = split(line, ','); // split line at ','

    if (buttonValues.length === 4) { // if there are exactly 4 values in the array after splitting..
      let buttonV1 = int(buttonValues[0]); // first button value (red)
      let buttonV2 = int(buttonValues[1]); // second button value (blue)
      let buttonV3 = int(buttonValues[2]); // third button value (yellow)
      let buttonV4 = int(buttonValues[3]); // fourth button value (green)

      // assign button variables to the above button values
      redButton = buttonV1;
      blueButton = buttonV2;
      yellowButton = buttonV3;
      greenButton = buttonV4;
    }
  }
}

// function to connect to the serial port
function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600); // always make sure this is the same speed as Serial.begin in Arduino
    connectButton.hide(); // hide the connect button once connected
    mPiano.play(); // play mPiano stem
    mPiano.loop(); // loop mPiano stem
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

  // set starting values
  redButton = 1;
  blueButton = 1;
  yellowButton = 1;
  greenButton = 1;

  // create a serial connection
  mSerial = createSerial(); // from the p5.js serial library

  // create button to connect to the serial port
  connectButton = createButton("Click to connect to serial 🥣");
  connectButton.position(width / 2 - 170, height / 2);

  // styling the button
  connectButton.style('font-family', 'Georgia');
  connectButton.style('font-size', '24px');
  connectButton.style('color', '#00000');
  connectButton.style('background-color', '#ffffff');
  connectButton.style('border', '2px solid #0056b3');

  connectButton.mousePressed(connectToSerial); // execute connectToSerial when button is pressed
}

function draw() {

  /////// start of button settings ///////

  //// RED BUTTON ////

  // only generate a new random position when redButton is pressed (i.e when button value changes to 0)
  if (redButton === 0 && !redDrawn) { // if redButton value is strictly 0 and redDrawn is false (i.e has not been drawn yet), execute this block of code
    
    //generate new random position
    redPosX = random(width/30, width - width/30);
    redPosY = random(height/30, height - height/30);
    
    // generate new random parameters
    spikeFactor = int(random(30, 40));
    sharpControl = random(10, 15);
    xControl = random(20);
    yControl = random(6);
    uScale = random([200, 300, 400]);
    angleStep = random(8, 10);

    // set volume of song to 1 (max volume)
    // place here and NOT under redDrawn to ensure that the volume change always and only occur with the visual
    mPiano.setVolume(1);

    redDrawn = true; // set to 'true' to prevent above code from running again (i.e finalizes the randomized shape and stops the shape of constantly updating)
    }

  // draw red shape based on above generated parameters and position
  if (redDrawn) {
    push();
    blendMode(MULTIPLY);
    noFill();
    stroke(255, 0, random(100, 255), opacity.red);
    strokeWeight(2);
    superformula(redPosX, redPosY, xScale, yScale, spikeFactor, xControl, yControl, sharpControl, angleStep, numPoints);
    pop();
  }

  if (millis() - redDrawnTimeStamp > redInterval) { // if time left over after millis minus last time red shape was drawn is greater than redInterval
     
    // draw another random shape based on the following parameters
    redPosX = random(width/30, width - width/30);
    redPosY = random(height/30, height - height/30);
  
    spikeFactor = int(random(30, 40));
    sharpControl = random(10, 15);
    xControl = random(20);
    yControl = random(6);
    uScale = random([200, 300, 400]);
    angleStep = random(8, 10);
    
    redDrawnTimeStamp = millis(); // stores the last time red shape was drawn
  }

  // when button is released/not being pressed (i.e not equal to 0) reset and re-execute the above two 'if' statements
  if (redButton !== 0) { // if value of button is not 0..
    redDrawn = false; // ..set to false so that the above 'if' statements can be executed

    mPiano.setVolume(0) // ..set volume to 0 (mute)
  }




  //// BLUE BUTTON ////

  // might decide to add randomized parameters here
  if (blueButton === 0 && !blueDrawn) {

    mPercStrings.setVolume(1)

    blueDrawn = true;
  }


  // draw the blue shapes at constantly randomizing positions
  if (blueDrawn) {
    push();

    blendMode(ADD);
    bluePosX = random(width);
    bluePosY = random(height);
    noStroke();
    fill(214, 252, 251, random(30, 200));
    ellipse(bluePosX, bluePosY, random(50, 100));

    pop();

    push();

    blendMode(BLEND);
    bluePosX = random(width);
    bluePosY = random(height);
    noStroke();
    fill(214, 252, 251, random(30, 200));
    ellipse(bluePosX, bluePosY, random(50, 100));

    pop();
  }


  if (blueButton !== 0) {
    blueDrawn = false;

    mPercStrings.setVolume(0)
  }




  //// YELLOW BUTTON ////

  if (yellowButton === 0 && !yellowDrawn) {

    mKickSnares.setVolume(1)

    yellowDrawn = true;
  }


  if (yellowDrawn) {
    push();

    blendMode(HARD_LIGHT);
    yellowPosX = random(width);
    yellowPosY = random(height);
    stroke(255, 243, 120, opacity.yellow);
    strokeWeight(1);
    fill(random(200, 236), random(200, 215), 0, random(0, 10));
    rect(yellowPosX, yellowPosY, random(100, 500));

    pop();
  }

  
  if (yellowButton !== 0) {
    yellowDrawn = false;

    mKickSnares.setVolume(0)
  }




  //// GREEN BUTTON ////

  if (greenButton === 0 && !greenDrawn) {

    mSynths.setVolume(1)

    greenDrawn = true;
  }

  if (greenDrawn) {
    push();

    greenPosX = random(width);
    greenPosY = random(height);

    GspikeFactor = int(random(100, 150)); // smaller value = simpler, circular or polygonal shapes, larger value = more complex star-like shapes.
    GsharpControl = random(20); // lowering = sharper edges
    GxControl = random(3); // adjust xControl and yControl to adjust form, (e.g. one side longer or curvier than the other)
    GyControl = random(5);
    GuScale = random(50, 80); // range of randomized uniform sizes
    GangleStep = random(2, 6); // different levels of smoothness of shapes

    blendMode(MULTIPLY);
    stroke(0, random(200, 255), random(255), opacity.green);
    strokeWeight(2);

    Gsuperformula(greenPosX, greenPosY, GxScale, GyScale, GspikeFactor, GxControl, GyControl, GsharpControl, GangleStep, GnumPoints);
    
    pop();
  }

  if (greenButton !== 0) {
    greenDrawn = false;

    mSynths.setVolume(0)
  }


  /////// end of button settings ///////


  // check if serial data is open -> if there is incoming data -> process the data
  if (mSerial.opened() && mSerial.availableBytes() > 0) {
    receiveSerial();
  }
  
}

function keyPressed() {
  if (key === ' ' || keyCode === 32) { // 32 is the key code for the spacebar in JavaScript
    clear();  // clears the canvas when spacebar is pressed
  }
}