// 1. CONFIGURACIÓN: MODO PÚBLICO (NO AUTH)
#define ENABLE_NO_AUTH 
#define ENABLE_DATABASE

#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#include <ESP32Servo.h>

// --- CONFIGURACIÓN WIFI Y FIREBASE ---
#define WIFI_SSID "INSNSB_UDITD"
#define WIFI_PASSWORD "$aNB0rj@.2019"
#define DATABASE_URL "inti-e3de3-default-rtdb.firebaseio.com"

// --- CONFIGURACIÓN SERVO ---
static const int servoPin = 18;
Servo servo1;
int centro = 90;
int amplitud = 45; 
int posicionActualServo = 90; 

// --- OBJETOS FIREBASE ---
WiFiClientSecure ssl_client;
using AsyncClient = AsyncClientClass;
AsyncClient aClient(ssl_client);

NoAuth no_auth; 
FirebaseApp app;
RealtimeDatabase Database;

unsigned long ultimaPeticion = 0;
const int intervalo = 2000;

// =========================
// FUNCIÓN MOVIMIENTO SUAVE
// =========================
void moverSuave(int fin) {
  int inicio = posicionActualServo;
  if (inicio == fin) return;

  Serial.printf("[Servo] Moviendo de %d a %d\n", inicio, fin);

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

// =========================
// CALLBACK DE DATOS (AQUÍ OCURRE LA MAGIA)
// =========================
void processData(AsyncResult &aResult) {
  if (aResult.isError()) {
    Serial.printf("[Firebase] Error: %s\n", aResult.error().message().c_str());
    return;
  }

  if (aResult.available()) {
      String path = aResult.path().c_str();
      String payload = aResult.payload();
      int valor = payload.toInt();

      Serial.printf("[Firebase] Ruta: %s | Valor: %d\n", path.c_str(), valor);
      
      // Lógica de decisión según la ruta que responda
      if (valor == 1) {
        if (path == "/movimiento/izquierda") {
          moverSuave(centro - amplitud); // Mueve a 45
        } 
        else if (path == "/movimiento/derecha") {
          moverSuave(centro + amplitud); // Mueve a 135
        }
      }
  }
}

// =========================
// SETUP
// =========================
void setup() {
  Serial.begin(115200);

  // Configuración Servo
  ESP32PWM::allocateTimer(0);
  servo1.setPeriodHertz(50);
  servo1.attach(servoPin, 500, 2400);
  servo1.write(centro);
  posicionActualServo = centro;

  // Conexión WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(300); Serial.print(".");
  }
  Serial.println("\nWiFi OK");

  ssl_client.setInsecure();

  // Inicializar Firebase
  Serial.println("Iniciando Firebase...");
  initializeApp(aClient, app, getAuth(no_auth));
  app.getApp<RealtimeDatabase>(Database);
  Database.url(DATABASE_URL);
  
  Serial.println("Sistema Listo.");
}

// =========================
// LOOP
// =========================
void loop() {
  app.loop(); // Gestión interna de la librería

  // Lectura periódica de las dos rutas de movimiento
  if (app.ready() && (millis() - ultimaPeticion > intervalo)) {
    ultimaPeticion = millis();
    
    // Pedimos ambos datos de forma asíncrona
    Database.get(aClient, "/movimiento/izquierda", processData);
    Database.get(aClient, "/movimiento/derecha", processData);
  }
}