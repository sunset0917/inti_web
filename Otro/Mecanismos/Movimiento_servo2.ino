#include <Servo.h>

Servo miServo;

int centro = 90;
int amplitud = 45;
int delayTiempo = 15;

void moverSuave(int inicio, int fin) {
  if (inicio < fin) {
    for (int pos = inicio; pos <= fin; pos++) {
      miServo.write(pos);
      delay(delayTiempo);
    }
  } else {
    for (int pos = inicio; pos >= fin; pos--) {
      miServo.write(pos);
      delay(delayTiempo);
    }
  }
}

void setup() {
  miServo.attach(9);
  miServo.write(centro); // empezar en el centro
  delay(1000);
}

void loop() {
  // Centro → +45°
  moverSuave(centro, centro + amplitud);
  delay(2000);

  // +45° → Centro
  moverSuave(centro + amplitud, centro);
  delay(2000);

  // Centro → -45°
  moverSuave(centro, centro - amplitud);
  delay(2000);

  // -45° → Centro
  moverSuave(centro - amplitud, centro);
  delay(2000);
}
