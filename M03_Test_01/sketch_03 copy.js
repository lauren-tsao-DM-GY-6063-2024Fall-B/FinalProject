let mSerial;
let connectButton;         // Serial port object
let button1State = 0;   // To track state of button 1
let button2State = 0;   // To track state of button 2
let button3State = 0;   // To track state of button 3

let mPiano, mPerString, mKickSynth;

function preload() {
  mPiano = loadSound("../assets/piano.mp3");
  mPerString = loadSound("../assets/percussion_strings.mp3");
  mKickSynth = loadSound("../assets/kicks_synths.mp3");
}

// function to connect to the serial port
// MAKE SURE TO CLOSE SERIAL MONITOR IN ARDUINO (only one serial monitor can be run in one time)
function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600); // make sure this is the same speed as the Serial.begin in the .ino file
    connectButton.hide(); // hide the connect button once connected
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
// create a serial connection
mSerial = createSerial(); // from the p5.js serial library

// create button to connect to the serial port
connectButton = createButton("Click me to connect To Serial!");
connectButton.position(width / 2 - 210, height / 2);

// styling button
connectButton.style('font-family', 'Courier New'); // change font
connectButton.style('font-size', '24px'); // change font size
connectButton.style('color', '#ffffff'); // change font color
connectButton.style('background-color', '#007bff'); // change button background color
connectButton.style('border', '2px solid #0056b3'); // add border (i.e stroke) around button

connectButton.mousePressed(connectToSerial);

  // // Load music or sound to play
  // song1 = loadSound('music1.mp3');  // Replace with your music file for button 1
  // song2 = loadSound('music2.mp3');  // Replace with your music file for button 2
  // song3 = loadSound('music3.mp3');  // Replace with your music file for button 3
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
}

function receiveSerial() {
  let incomingData = serial.readLine();  // Read the incoming data

  // Set state for each button independently based on the message received
  if (incomingData === "button1Pressed") {
    button1State = 1;  // Set state to pressed (1) for button 1
  } else if (incomingData === "button1Released") {
    button1State = 0;  // Set state to released (0) for button 1
  }

  if (incomingData === "button2Pressed") {
    button2State = 1;  // Set state to pressed (1) for button 2
  } else if (incomingData === "button2Released") {
    button2State = 0;  // Set state to released (0) for button 2
  }

  if (incomingData === "button3Pressed") {
    button3State = 1;  // Set state to pressed (1) for button 3
  } else if (incomingData === "button3Released") {
    button3State = 0;  // Set state to released (0) for button 3
  }
}


// // This function is called when a message is received from Arduino
// function serialEvent() {
//   let incomingData = serial.readLine();  // Read the incoming data

//   // Set state for each button independently based on the message received
//   if (incomingData === "button1Pressed") {
//     button1State = 1;  // Set state to pressed (1) for button 1
//   } else if (incomingData === "button1Released") {
//     button1State = 0;  // Set state to released (0) for button 1
//   }

//   if (incomingData === "button2Pressed") {
//     button2State = 1;  // Set state to pressed (1) for button 2
//   } else if (incomingData === "button2Released") {
//     button2State = 0;  // Set state to released (0) for button 2
//   }

//   if (incomingData === "button3Pressed") {
//     button3State = 1;  // Set state to pressed (1) for button 3
//   } else if (incomingData === "button3Released") {
//     button3State = 0;  // Set state to released (0) for button 3
//   }
// }

// // To handle serial port errors (optional)
// function serialError(err) {
//   console.log('Something went wrong with the serial port: ' + err);
// }
