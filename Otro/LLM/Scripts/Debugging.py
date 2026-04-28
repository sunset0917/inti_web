import queue
import sounddevice as sd
import numpy as np
import json
import requests
import scipy.signal
from vosk import Model, KaldiRecognizer
import subprocess
import time
import os

# =====================================
# CONFIGURACIÓN
# =====================================
LOG_TXT = "inti_log_stablelm.txt"

MODEL_PATH = "/home/laboratorioinnovacion/Descargas/vosk-model-small-es-0.42"

INPUT_RATE = 48000
VOSK_RATE = 16000
DEVICE = 1  # Micrófono USB

MODEL_OLLAMA = "stablelm2:latest"
OLLAMA_URL = "http://localhost:11434/api/generate"

PIPER_BIN = "/home/laboratorioinnovacion/piper/piper/piper"
PIPER_MODEL = "/home/laboratorioinnovacion/piper/modelos/es_AR-daniela-high.onnx"

OUTPUT_DEVICE = "plughw:2,0"  # VoiceHAT / parlante
GANANCIA_TTS = "0.10"

TEMP_WAV = "/tmp/inti_tts.wav"
TEMP_WAV_GAIN = "/tmp/inti_tts_gain.wav"

DEBUG = True
MAX_HISTORIAL = 12  # intercambios (usuario+inti)

# =====================================

q = queue.Queue()
hablando = False
historial = []


# =====================================
# DEBUG
# =====================================
def guardar_log(texto):
    with open(LOG_TXT, "a", encoding="utf-8") as f:
        f.write(texto + "\n")
        
def log_debug(msg):
    if DEBUG:
        hora = time.strftime("%H:%M:%S")
        linea = f"[DEBUG {hora}] {msg}"
        print(linea)
        guardar_log(linea)


# =====================================
# HISTORIAL LLM
# =====================================
def construir_prompt(texto_usuario):
    global historial

    bloques = []

    for turno in historial:
        bloques.append(f"Usuario: {turno['user']}")
        bloques.append(f"Inti: {turno['assistant']}")

    bloques.append(f"Usuario: {texto_usuario}")
    bloques.append("Inti:")

    return "\n".join(bloques)


def guardar_historial(usuario, respuesta):
    global historial

    historial.append({
        "user": usuario,
        "assistant": respuesta
    })

    if len(historial) > MAX_HISTORIAL:
        historial = historial[-MAX_HISTORIAL:]


# =====================================
# TTS - Piper + control de ganancia
# =====================================
def hablar(texto):
    global hablando

    texto = texto.strip().replace("\n", " ")

    if not texto:
        return

    hablando = True
    inicio_total = time.time()

    try:
        # -------------------------
        # 1. Generar audio Piper
        # -------------------------
        t0 = time.time()

        subprocess.run(
            [
                PIPER_BIN,
                "--model",
                PIPER_MODEL,
                "--output_file",
                TEMP_WAV
            ],
            input=texto.encode("utf-8"),
            check=True
        )

        t1 = time.time()
        log_debug(f"TTS Piper: {t1 - t0:.2f}s")

        # -------------------------
        # 2. Ajustar volumen
        # -------------------------
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i", TEMP_WAV,
                "-filter:a", f"volume={GANANCIA_TTS}",
                TEMP_WAV_GAIN
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True
        )

        t2 = time.time()
        log_debug(f"TTS ffmpeg: {t2 - t1:.2f}s")

        # -------------------------
        # 3. Reproducir audio
        # -------------------------
        subprocess.run(
            [
                "aplay",
                "-D", OUTPUT_DEVICE,
                TEMP_WAV_GAIN
            ],
            check=True
        )

        t3 = time.time()
        log_debug(f"TTS reproducción: {t3 - t2:.2f}s")

    except Exception as e:
        print("❌ Error TTS:", e)

    finally:
        hablando = False

        fin_total = time.time()
        log_debug(f"TTS total: {fin_total - inicio_total:.2f}s")

        for archivo in [TEMP_WAV, TEMP_WAV_GAIN]:
            if os.path.exists(archivo):
                os.remove(archivo)


# =====================================
# Callback micrófono
# =====================================
def callback(indata, frames, time_info, status):
    global hablando

    if status:
        print(status)

    if hablando:
        return

    q.put(indata.copy())


# =====================================
# Warm-up Ollama
# =====================================
def inicializar_ollama():
    print("⏳ Inicializando LLM...")

    try:
        t0 = time.time()

        requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_OLLAMA,
                "prompt": ".",
                "stream": False,
                "keep_alive": "30m",
                "options": {
                    "num_predict": 1
                }
            },
            timeout=300
        )

        t1 = time.time()

        print("✅ Ollama listo")
        log_debug(f"Warmup Ollama: {t1 - t0:.2f}s")

    except Exception as e:
        print("❌ Error inicializando Ollama:", e)


# =====================================
# Consulta LLM con historial
# =====================================
def preguntar_ollama(texto):
    global historial

    system_prompt = (
        "Eres Inti, un robot social con forma de llama. "
        "Acompañas emocionalmente a niños hospitalizados. "
        "Habla con respeto, tranquilidad y alegría moderada. "
        "Tus respuestas deben ser cortas y claras. "
        "No saludes en cada respuesta, solo al inicio. "
        "Continúa la conversación naturalmente. "
        "Evita violencia, muerte o temas sensibles. "
        "Si preguntan por dolor, enfermedad o salud mental, "
        "indica consultar a un profesional de salud."
    )

    prompt_final = construir_prompt(texto)

    try:
        t0 = time.time()

        r = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_OLLAMA,
                "prompt": prompt_final,
                "system": system_prompt,
                "stream": False,
                "keep_alive": "30m",
                "options": {
                    "temperature": 0.7,
                    "num_predict": 80
                }
            },
            timeout=300
        )

        t1 = time.time()
        log_debug(f"LLM respuesta: {t1 - t0:.2f}s")

        respuesta = r.json()["response"].strip()

        guardar_historial(texto, respuesta)

        log_debug(f"Historial actual: {len(historial)} turnos")

        return respuesta

    except Exception as e:
        print("❌ Error Ollama:", e)
        return "Ahora mismo tuve un pequeño problema para responder."


# =====================================
# INICIO
# =====================================
print("📦 Cargando modelo Vosk...")

t0 = time.time()

model = Model(MODEL_PATH)

recognizer = KaldiRecognizer(model, VOSK_RATE)
recognizer.SetWords(True)

t1 = time.time()
log_debug(f"Carga Vosk: {t1 - t0:.2f}s")

# Precarga LLM
inicializar_ollama()

print("🎤 Micrófono activo. Habla con Inti...")


# =====================================
# LOOP PRINCIPAL
# =====================================
with sd.InputStream(
    samplerate=INPUT_RATE,
    device=DEVICE,
    channels=1,
    dtype="int16",
    callback=callback
):

    while True:
        data = q.get()

        audio_16k = scipy.signal.resample_poly(data[:, 0], 1, 3)
        audio_bytes = audio_16k.astype(np.int16).tobytes()

        if recognizer.AcceptWaveform(audio_bytes):

            inicio_total = time.time()

            result = json.loads(recognizer.Result())

            if result.get("text"):

                texto_usuario = result["text"].strip()

                if not texto_usuario:
                    continue

                print("\n🗣️ Usuario:", texto_usuario)
                guardar_log(f"[{time.strftime('%H:%M:%S')}] Usuario: {texto_usuario}")
                # -------------------------
                # LLM
                # -------------------------
                respuesta = preguntar_ollama(texto_usuario)

                print("🤖 Inti:", respuesta)
                guardar_log(f"[{time.strftime('%H:%M:%S')}] Inti: {respuesta}")
                print("-" * 50)

                # -------------------------
                # TTS
                # -------------------------
                hablar(respuesta)

                fin_total = time.time()
                log_debug(f"Interacción total: {fin_total - inicio_total:.2f}s")

                time.sleep(0.2)

        else:
            parcial = json.loads(recognizer.PartialResult())

            if parcial.get("partial"):
                print("Escuchando:", parcial["partial"], end="\r")
