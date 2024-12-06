let mSerial;
let connectButton;         // Serial port object
let button1State = 0;   // To track state of button 1
let button2State = 0;   // To track state of button 2
let button3State = 0;   // To track state of button 3

let mPiano, mPerString, mKickSynth;
let incomingData = "";   // Variable to store incoming serial data

function preload() {
  mPiano = loadSound("../assets/piano.mp3");
  mPerString = loadSound("../assets/percussion_strings.mp3");
  mKickSynth = loadSound("../assets/kicks_synths.mp3");
}

// Function to connect to the serial port
function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600); // make sure this is the same speed as the Serial.begin in the .ino file
    connectButton.hide(); // hide the connect button once connected
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a serial connection
  mSerial = createSerial(); // from the p5.js serial library

  // Create button to connect to the serial port
  connectButton = createButton("Click me to connect To Serial!");
  connectButton.position(width / 2 - 210, height / 2);

  // Styling button
  connectButton.style('font-family', 'Courier New'); // Change font
  connectButton.style('font-size', '24px'); // Change font size
  connectButton.style('color', '#ffffff'); // Change font color
  connectButton.style('background-color', '#007bff'); // Change button background color
  connectButton.style('border', '2px solid #0056b3'); // Add border (i.e., stroke) around button

  connectButton.mousePressed(connectToSerial);
}

function draw() {
  background(220);

  // Handle each button press and adjust volume independently
  if (button1State === 1) {
    text("Playing Song 1", width / 2, height / 2);
    if (!mPiano.isPlaying()) {
      mPiano.loop();  // Start looping song 1 if not already playing
    }
    mPiano.setVolume(1);  // Set volume to max for button 1
  } else if (button1State === 0) {
    mPiano.setVolume(0);  // Mute song 1 when button 1 is released
  }

  if (button2State === 1) {
    text("Playing Song 2", width / 2, height / 2 + 20);
    if (!mPerString.isPlaying()) {
      mPerString.loop();  // Start looping song 2 if not already playing
    }
    mPerString.setVolume(1);  // Set volume to max for button 2
  } else if (button2State === 0) {
    mPerString.setVolume(0);  // Mute song 2 when button 2 is released
  }

  if (button3State === 1) {
    text("Playing Song 3", width / 2, height / 2 + 40);
    if (!mKickSynth.isPlaying()) {
      mKickSynth.loop();  // Start looping song 3 if not already playing
    }
    mKickSynth.setVolume(1);  // Set volume to max for button 3
  } else if (button3State === 0) {
    mKickSynth.setVolume(0);  // Mute song 3 when button 3 is released
  }

  // Call the serial function to update button states
  receiveSerial();
}

// Function to receive and process serial data
function receiveSerial() {
  if (mSerial.available()) {
    let inByte = mSerial.read();  // Read a byte from the serial buffer
    incomingData += String.fromCharCode(inByte);  // Append byte to incomingData

    // Check if a newline is received (indicating the end of a message)
    if (incomingData.indexOf('\n') > -1) {
      let data = incomingData.trim();  // Remove any leading/trailing whitespace

      // Reset incomingData for the next line
      incomingData = "";

      // Handle the received data and set button states
      if (data === "button1Pressed") {
        button1State = 1;  // Set state to pressed (1) for button 1
      } else if (data === "button1Released") {
        button1State = 0;  // Set state to released (0) for button 1
      }

      if (data === "button2Pressed") {
        button2State = 1;  // Set state to pressed (1) for button 2
      } else if (data === "button2Released") {
        button2State = 0;  // Set state to released (0) for button 2
      }

      if (data === "button3Pressed") {
        button3State = 1;  // Set state to pressed (1) for button 3
      } else if (data === "button3Released") {
        button3State = 0;  // Set state to released (0) for button 3
      }
    }
  }
}

// Handle mouse click to toggle music on and off
function mouseClicked() {
  if (mPiano.isPlaying()) {
    mPiano.pause();  // Pause piano music if it's playing
  } else {
    mPiano.play();  // Play piano music if it's paused
  }

  if (mPerString.isPlaying()) {
    mPerString.pause();  // Pause percussion strings music if it's playing
  } else {
    mPerString.play();  // Play percussion strings music if it's paused
  }

  if (mKickSynth.isPlaying()) {
    mKickSynth.pause();  // Pause kick synth music if it's playing
  } else {
    mKickSynth.play();  // Play kick synth music if it's paused
  }
}
