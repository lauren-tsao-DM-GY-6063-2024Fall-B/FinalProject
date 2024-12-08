let mSerial;

let connectButton;

let readyToReceive;
let cBackgroundColor;

function receiveSerial() {
  let mLine = mSerial.readUntil("\n");
  let sensorVal = int(mLine);
  print(mLine, sensorVal);
  cBackgroundColor = map(sensorVal, 0, 2000, 0, 255, true);
  readyToReceive = true;
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);
    connectButton.hide();
    readyToReceive = true;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial);

  cBackgroundColor = 0;

  readyToReceive = false;
}

function draw() {
  background(cBackgroundColor);

  if (mSerial.opened() && readyToReceive) {
    mSerial.clear();
    mSerial.write(0xAB);
    readyToReceive = false;
  }

  if (mSerial.availableBytes() > 0) {
    receiveSerial();
  }
}