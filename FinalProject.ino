int pv2;  // previous value of pin 2
int nClicks; // number of clicks

void setup() {
  pinMode(2, OUTPUT);


// initiate serial communication between Arduino board and computer
// Serial = allows sending and receiving data to and from Arduino via USB port, typically using the Serial.print(), Serial.println(), Serial.read()
// begin = start serial communication
// 9600 = baud rate (defines the speed the data is transmitted in bits/bauds pr second (bps)), so this is 9600 bps
Serial.begin(9600);
  lastSend = 0;

pv2 = 0;
nClicks = 0; 
}


void loop() {

// BUTTON
  int v2 = digitalRead(2); // read input from pin 2 and put it in v2 variable;

  if(v2 == 1 && pv2 == 0) { // if current value of pin 2 is 1 (HIGH)(pressed) and previous value of pin 2 is 0 (LOW)(released)..
    nClicks += 1; // .. increase nClicks counter by 1
  }

  pv2 = v2; // update the previous value of pin 2 (pv2) to current value of pin 2 (v2)

  // print the following line everytime the above is executed
  // "v2:" = title for v2's value (String(v2))
  // String(v2) = converts value of v2 (either 1 or 0 dependant on pin 2's state (HIGH/LOW)) into a string
  // "count" = another title, for number of clicks (String(nClicks))
  // String(nClicks) = converts nClicks into a string
  // so if button is pressed 3 times, it should read as "v2:1count3"
  Serial.println("v2:" + String(v2) + "count" + String(nClicks));

  // if the button has been pressed 5 times, turn on LED on pin 12
  if (nClicks == 5) { // if number of clicks is equals to 5 and LED on pin 12 is not on
    Serial.println("Pin 2 UNLOCKED!");  // print "Pin 12 UNLOCKED" as visual feedback
  }

  if (millis() - lastSend > 80) { // p5js will read x times per second
    Serial.println(v2);
    lastSend = millis();
  }

  delay(2);
}