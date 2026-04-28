// 1. CONFIGURACIÓN: MODO PÚBLICO (NO AUTH)
#define ENABLE_NO_AUTH 
#define ENABLE_DATABASE

#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>




// --- SERVO ---
static const int servoPin_arriba = 19;
static const int servoPin_abajo = 18;


Servo servo1; // Servo para el movimiento horizontal (girar cabeza)
Servo servo2; // Servo para el movimiento vertical (asentir cabeza)

int posicionActualServo = 105; // posición inicial del servo horizontal
int posicionActualServo2 = 93; // Ir variando para encontrar la posición inicial correcta!
int amplitud = 30;
int amplitudVertical = 15;
// --- CONTROL DE EVENTOS ---
bool negarActivo = false; // evita repetir el gesto mientras el botón sigue en 1

// --- FIREBASE ---
WiFiClientSecure ssl_client;
using AsyncClient = AsyncClientClass;
AsyncClient aClient(ssl_client);

NoAuth no_auth; 
FirebaseApp app;
RealtimeDatabase Database;

unsigned long ultimaPeticion = 0;
const int intervalo = 500;

bool resetArriba= false;
bool resetAbajo = false;

// =========================
// MOVIMIENTO SUAVE
// =========================
void moverSuave(int fin) {
  fin = constrain(fin, 5, 175);

  int inicio = posicionActualServo;
  if (inicio == fin) return;

  Serial.printf("[Servo] %d -> %d\n", inicio, fin);

  if (inicio < fin) {
    for (int pos = inicio; pos <= fin; pos++) {
      servo1.write(pos);
      delay(15);
    }
  } else {
    for (int pos = inicio; pos >= fin; pos--) {
      servo1.write(pos);
      delay(15);
    }
  }

  posicionActualServo = fin;
}

void moverSuaveVertical(int fin) {
  fin = constrain(fin, 5, 175);

  int inicio = posicionActualServo2;
  if (inicio == fin) return;

  if (inicio < fin) {
    for (int pos = inicio; pos <= fin; pos++) {
      servo2.write(pos);
      delay(15);
    }
  } else {
    for (int pos = inicio; pos >= fin; pos--) {
      servo2.write(pos);
      delay(15);
    }
  }

  posicionActualServo2 = fin;
}

// =========================
// GESTO: NEGAR (CORRECTO)
// =========================
void negarCabeza() {
  Serial.println("[Robot] Negar cabeza (suave)");

  int centro = posicionActualServo;
  int derecha = centro + amplitud;
  int izquierda = centro - amplitud;

  // Seguridad
  derecha = constrain(derecha, 5, 175);
  izquierda = constrain(izquierda, 5, 175);

  // 1. Centro → derecha
  for (int pos = centro; pos <= derecha; pos++) {
    servo1.write(pos);
    delay(10);
  }

  // 2. Derecha → izquierda (SIN parar)
  for (int pos = derecha; pos >= izquierda; pos--) {
    servo1.write(pos);
    delay(10);
  }

  // 3. Izquierda → centro
  for (int pos = izquierda; pos <= centro; pos++) {
    servo1.write(pos);
    delay(10);
  }

  posicionActualServo = centro;
}

void mirarIzquierda() {
  Serial.println("[Robot] Mirar izquierda");

  int centro = posicionActualServo;

  moverSuave(centro - amplitud);
  delay(2000);
  moverSuave(centro);
}

void mirarDerecha() {
  Serial.println("[Robot] Mirar derecha");

  int centro = posicionActualServo;

  moverSuave(centro + amplitud);
  delay(2000);
  moverSuave(centro);
}

void mirarArriba() {
  Serial.println("[Robot] Mirar arriba");

  int centro = posicionActualServo2;

  moverSuaveVertical(centro + amplitudVertical);
  delay(2000);
  moverSuaveVertical(centro);
}

void mirarAbajo() {
  Serial.println("[Robot] Mirar abajo");

  int centro = posicionActualServo2;

  moverSuaveVertical(centro - amplitudVertical);
  delay(2000);
  moverSuaveVertical(centro);
}

// =========================
// FIREBASE CALLBACK
// =========================
void processData(AsyncResult &aResult) {
  if (aResult.available()) {
    String path = aResult.path().c_str();
    int valor = aResult.payload().toInt();

    // SOLO NEGAR (controlado)
    if (path == "/movimiento/arriba" && valor == 1) {

      mirarArriba();
      resetArriba = true;
    }

    if (path == "/movimiento/abajo" && valor == 1) {
      mirarAbajo();
      resetAbajo = true;
    }
  }
}

// =========================
// SETUP
// =========================
void setup() {
  Serial.begin(115200);

  ESP32PWM::allocateTimer(0);
  servo1.setPeriodHertz(50);
  servo2.setPeriodHertz(50);
  
  servo1.attach(servoPin_abajo, 500, 2400);
  servo2.attach(servoPin_arriba, 500, 2400);
  servo2.write(posicionActualServo2);

  servo1.write(posicionActualServo);
   // posición neutra para el servo vertical

  Serial.println("Servos listos");

  // WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  Serial.println("\nWiFi OK");

  // Firebase
  ssl_client.setInsecure();
  initializeApp(aClient, app, getAuth(no_auth));
  app.getApp<RealtimeDatabase>(Database);
  Database.url(DATABASE_URL);

  Serial.println("Sistema listo.");
}

// =========================
// LOOP
// =========================
void loop() {
  app.loop();


  if (resetArriba) {
    Database.set(aClient, "/movimiento/arriba", 0);
    resetArriba = false;
  }

  if (resetAbajo) {
    Database.set(aClient, "/movimiento/abajo", 0);
    resetAbajo = false;
  }

  if (app.ready() && (millis() - ultimaPeticion > intervalo)) {
    ultimaPeticion = millis();

    Database.get(aClient, "/movimiento/arriba", processData);
    Database.get(aClient, "/movimiento/abajo", processData); // En realidad abajo se mueve para arriba


  }
}
