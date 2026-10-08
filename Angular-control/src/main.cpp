#include <Arduino.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <LiquidCrystal_I2C.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <ArduinoJson.h>

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHAR_CONFIG_UUID "a3c87500-8ed3-4bdf-8a39-a01bebede295"

BLECharacteristic *pcaracteristicas;
BLECharacteristic *pCharConfig;

bool servicioConectado = false;

class CallbackServidor : public BLEServerCallbacks
{

public:
  void onConnect(BLEServer *Pserver) override
  {
    servicioConectado = true;
  }

  void onDisconnect(BLEServer *Pserver) override
  {
    servicioConectado = false;
    Pserver->getAdvertising()->start();
  }
};

Adafruit_MPU6050 mpu;
LiquidCrystal_I2C lcd(0x27, 16, 2);
float alfaFiltro = 0.96;
float rolloffset = 0.0;
float pitchoffset = 0.0;
float roll = 0.0;
float pitch = 0.0;
unsigned long tiempoPrevio = 0;
unsigned long tiempoPrevioBLE = 0;
unsigned long tiempoPrevioLCD = 0;
float rolloffset = 0.0;

void calibrarAngulo()
{
  float suma = 0.0;
  float sumaPitch = 0.0;
  sensors_event_t a, g, temp;

  for (int i = 0; i < 50; i++)
  {
    mpu.getEvent(&a, &g, &temp);
    float angulo = atan2(a.acceleration.y, a.acceleration.z) * 180.0 / M_PI;
    float anguloPitch = atan2(-a.acceleration.x, sqrt(a.acceleration.y * a.acceleration.y + a.acceleration.z * a.acceleration.z)) * 180.0 / M_PI;
    suma += angulo;
    sumaPitch += anguloPitch
        delay(10);
  }

  rolloffset = suma / 50;
  pitchoffset = sumaPitch / 50.0;
  roll = 0.0;
  pitch = 0.0;
  tiempoPrevio = millis();
}

class CallbackConfig : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic) override
  {
    String rxValue = pCharacteristic->getValue().c_str();

    if (rxValue.length() > 0)
    {
      Serial.print("Comando recibido por BLE: ");
      Serial.println(rxValue);

      JsonDocument doc;
      DeserializationError error = deserializeJson(doc, rxValue);

      if (!error)
      {
        if (doc.containsKey("cmd"))
        {
          String cmd = doc["cmd"];
          if (cmd == "TARE_ZERO")
          {
            calibrarAngulo();
            Serial.println("-> Cero re-tarado desde la App Móvil");
          }
        }

        if (doc.containsKey("kalmanGain"))
        {
          alfaFiltro = doc["kalmanGain"];
          Serial.print("-> Nueva ganancia de filtro: ");
          Serial.println(alfaFiltro);
        }
      }
    }
  }
};

class CallbackServidor : public BLEServerCallbacks
{
public:
  void onConnect(BLEServer *Pserver) override
  {
    servicioConectado = true;
  }

  void onDisconnect(BLEServer *Pserver) override
  {
    servicioConectado = false;
    Pserver->getAdvertising()->start();
  }
};

void setup()
{
  Serial.begin(115200);

  BLEDevice::init("Telemetria_moto");

  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new CallbackServidor());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pcaracteristicas = pService->createCharacteristic(
      CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_NOTIFY);

  pcaracteristicas->addDescriptor(new BLE2902());

  pCharConfig = pService->createCharacteristic(
      CHAR_CONFIG_UUID,
      BLECharacteristic::PROPERTY_WRITE);
  pCharConfig->setCallbacks(new CallbackConfig());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Wire.begin(1, 2);
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.display();
  lcd.setCursor(0, 0);
  if (!mpu.begin())
  {
    Serial.print("No se pudo encontrar el chip MPU6050");
  }

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
  Serial.print("Calibrando, no muevas la placa");
  calibrarAngulo();
}

void loop()
{

  sensors_event_t a, g, temp;

  mpu.getEvent(&a, &g, &temp);

  unsigned long tiempoActual = millis();
  float dt = (tiempoActual - tiempoPrevio) / 1000.0;
  tiempoPrevio = tiempoActual;

  float accelRoll = (atan2(a.acceleration.y, a.acceleration.z) * 180.0 / M_PI) - rolloffset;
  float gyroRateX = g.gyro.x * 180.0 / M_PI;

  roll = alfaFiltro * (roll + gyroRateX * dt) + (1.0 - alfaFiltro) * accelRoll;

  float accelPitch = (atan2(-a.acceleration.x, sqrt(a.acceleration.y * a.acceleration.y + a.acceleration.z * a.acceleration.z)) * 180.0 / M_PI) - pitchoffset;
  float gyroRateY = g.gyro.y * 180.0 / M_PI;
  pitch = alfaFiltro * (pitch + gyroRateY * dt) + (1.0 - alfaFiltro) * accelPitch;

  float gLat = a.acceleration.y / 9.81;  
  float gLong = a.acceleration.x / 9.81; 

  float gTotal = sqrt(a.acceleration.x * a.acceleration.x +
                      a.acceleration.y * a.acceleration.y +
                      a.acceleration.z * a.acceleration.z) /
                 9.81;

  if (servicioConectado && tiempoActual - tiempoPrevioBLE >= 50)
  {
    tiempoPrevioBLE = tiempoActual;

    String jsonPayload = "{\"roll\":" + String(roll, 2) + 
                     ",\"pitch\":" + String(pitch, 2) + 
                     ",\"gLat\":" + String(gLat, 2) + 
                     ",\"gLong\":" + String(gLong, 2) + 
                     ",\"gTotal\":" + String(gTotal, 2) + "}";

    pcaracteristicas->setValue(jsonPayload.c_str());
    pcaracteristicas->notify();
  }

  // --- ACTUALIZACIÓN DE PANTALLA LCD ---
  if (tiempoActual - tiempoPrevioLCD >= 200)
  {
    tiempoPrevioLCD = tiempoActual;
    lcd.setCursor(0, 0);
    lcd.print("Angulo: ");
    lcd.setCursor(8, 0);
    lcd.print((int)abs(roll));
    lcd.print((char)223);
    lcd.print("  ");
  }
}
