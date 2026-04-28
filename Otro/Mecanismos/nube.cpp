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
int centroFisico = 135;
int amplitud = 45; 
int posicionActualServo = 135;
int ultimaDireccion = 0;

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

void negarCabeza() {
  Serial.println("[Robot] Negando con la cabeza...");
  
  // 1. Centro -> Derecha (+amplitud)
  moverSuave(centroFisico + amplitud);
  delay(100); // Pequeña pausa en el extremo
  
  // 2. Derecha -> Izquierda (-amplitud)
  moverSuave(centroFisico - amplitud);
  delay(100);
  
  // 3. Izquierda -> Centro (Volver a posición inicial)
  moverSuave(centroFisico);
  
  Serial.println("[Robot] Gesto finalizado.");
}

// =========================
// CALLBACK DE DATOS (AQUÍ OCURRE LA MAGIA)
// =========================
void processData(AsyncResult &aResult) {
  if (aResult.available()) {
    String path = aResult.path().c_str();
    int valor = aResult.payload().toInt();

    // FILTRO: Solo actuar si el valor es 1
    if (valor == 1) {
      
      // CASO IZQUIERDA
      if (path == "/movimiento/izquierda" && ultimaDireccion != 1) {
        moverSuave(centroFisico - amplitud);
        ultimaDireccion = 1; 
        Serial.println("[Estado] Posición: IZQUIERDA");
      } 
      // CASO DERECHA
      else if (path == "/movimiento/derecha" && ultimaDireccion != 2) {
        moverSuave(centroFisico + amplitud);
        ultimaDireccion = 2;
        Serial.println("[Estado] Posición: DERECHA");
      }
      // CASO NEGAR (Gesto especial)
      else if (path == "/movimiento/negar" && ultimaDireccion != 3) {
        negarCabeza();
        // Después de negar, el servo vuelve al centro físicamente
        ultimaDireccion = 3; 
      }
    } 
    // Si el valor en Firebase cambia a 0, regresamos al centro
    else if (valor == 0 && path != "/movimiento/negar") {
      if (ultimaDireccion != 0) {
        moverSuave(centroFisico);
        ultimaDireccion = 0;
        Serial.println("[Estado] Posición: CENTRO");
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
  servo1.write(centroFisico);
  servo1.attach(servoPin, 500, 2400);
  
  posicionActualServo = centroFisico;

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
    Database.get(aClient, "/movimiento/negar", processData);
    //Database.get(aClient, "/movimiento/derecha", processData);
  }
}
