/*
 * Created by ArduinoGetStarted.com
 *
 * This example code is in the public domain
 *
 * Tutorial page: https://arduinogetstarted.com/tutorials/arduino-button-library
 *
 * This example:
 *   + uses debounce for multiple buttons.
 *   + reads state of multiple buttons
 *   + detects the pressed and released events of multiple buttons
 */

#include <ezButton.h>

ezButton button1(2);  // create ezButton object that attach to pin 2;
ezButton button2(3);  // create ezButton object that attach to pin 3;
ezButton button3(4);  // create ezButton object that attach to pin 4;
ezButton button4(5);  // create ezButton object that attach to pin 5;

void setup() {
  Serial.begin(9600);
  
  button1.setDebounceTime(100); // set debounce time to 50 milliseconds
  button2.setDebounceTime(100); // set debounce time to 50 milliseconds
  button3.setDebounceTime(100); // set debounce time to 50 milliseconds
  button4.setDebounceTime(100); // set debounce time to 50 milliseconds
}

void loop() {
  button1.loop(); // MUST call the loop() function first
  button2.loop(); // MUST call the loop() function first
  button3.loop(); // MUST call the loop() function first
  button4.loop(); // MUST call the loop() function first

  int btn1State = button1.getState();
  int btn2State = button2.getState();
  int btn3State = button3.getState();
  int btn4State = button4.getState();

  Serial.print(btn1State);
  Serial.print(",");
  Serial.print(btn2State);
  Serial.print(",");
  Serial.print(btn3State);
  Serial.print(",");
  Serial.println(btn4State);

  delay(100);
}