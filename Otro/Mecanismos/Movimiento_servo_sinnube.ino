// Configuración PWM
const int servoPin = 18;     // GPIO donde conectas el servo
const int pwmFreq = 50;      // 50 Hz para servo
const int pwmResolution = 16; 

int centro = 90;
int amplitud = 45;
int delayTiempo = 15;

// Valores típicos de duty para servo de 16 bits (0 a 65535)
// 50Hz -> Periodo de 20ms. 
// 0.5ms (0°)  -> (0.5/20) * 65535 ≈ 1638
// 2.5ms (180°) -> (2.5/20) * 65535 ≈ 8192
uint32_t dutyMin = 1638;   
uint32_t dutyMax = 8192;   

// Convertir ángulo (0–180) a duty cycle
uint32_t anguloToDuty(int angulo) {
  return map(angulo, 0, 180, dutyMin, dutyMax);
}

void moverSuave(int inicio, int fin) {
  if (inicio < fin) {
    for (int pos = inicio; pos <= fin; pos++) {
      ledcWrite(servoPin, anguloToDuty(pos)); // Ahora se usa el PIN directamente
      delay(delayTiempo);
    }
  } else {
    for (int pos = inicio; pos >= fin; pos--) {
      ledcWrite(servoPin, anguloToDuty(pos));
      delay(delayTiempo);
    }
  }
}

void setup() {
  // Sintaxis: ledcAttach(pin, frecuencia, resolución);
  ledcAttach(servoPin, pwmFreq, pwmResolution);

  ledcWrite(servoPin, anguloToDuty(centro)); // iniciar en centro
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
