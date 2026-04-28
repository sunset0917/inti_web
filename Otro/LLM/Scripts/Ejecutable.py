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

MODEL_PATH = "/home/laboratorioinnovacion/Descargas/vosk-model-small-es-0.42"

INPUT_RATE = 48000
VOSK_RATE = 16000
DEVICE = 1                         # Micrófono USB

MODEL_OLLAMA = "gemma3:1b"
OLLAMA_URL = "http://localhost:11434/api/generate"

PIPER_BIN = "/home/laboratorioinnovacion/piper/piper/piper"
PIPER_MODEL = "/home/laboratorioinnovacion/piper/modelos/es_AR-daniela-high.onnx"

OUTPUT_DEVICE = "plughw:2,0"       # VoiceHAT / parlante
GANANCIA_TTS = "0.10"             # 0.5 a 1.0 recomendado

TEMP_WAV = "/tmp/inti_tts.wav"
TEMP_WAV_GAIN = "/tmp/inti_tts_gain.wav"

# =====================================

q = queue.Queue()
hablando = False


# =====================================
# TTS - Piper + control de ganancia
# =====================================
def hablar(texto):
    global hablando

    texto = texto.strip().replace("\n", " ")

    if not texto:
        return

    hablando = True

    try:
        # 1. Generar WAV limpio desde Piper
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

        # 2. Ajustar volumen digital
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

        # 3. Reproducir WAV final
        subprocess.run(
            [
                "aplay",
                "-D", OUTPUT_DEVICE,
                TEMP_WAV_GAIN
            ],
            check=True
        )

    except Exception as e:
        print("❌ Error TTS:", e)

    finally:
        hablando = False

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

    # mientras habla no escuchamos
    if hablando:
        return

    q.put(indata.copy())


# =====================================
# Warm-up Ollama (precarga modelo)
# =====================================
def inicializar_ollama():
    print("⏳ Inicializando LLM...")

    try:
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

        print("✅ Ollama listo")

    except Exception as e:
        print("❌ Error inicializando Ollama:", e)


# =====================================
# Consulta LLM
# =====================================
def preguntar_ollama(texto):

    system_prompt = (
        "Eres Inti, un robot social con forma de llama. "
        "Acompañas emocionalmente a niños hospitalizados. "
        "Habla con respeto, tranquilidad y alegría moderada. "
        "Tus respuestas deben ser cortas y claras. "
        "Evita violencia, muerte o temas sensibles. "
        "Si preguntan por dolor, enfermedad o salud mental, "
        "indica consultar a un profesional de salud."
    )

    try:
        r = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_OLLAMA,
                "prompt": texto,
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

        return r.json()["response"].strip()

    except Exception as e:
        return "Ahora mismo tuve un pequeño problema para responder."


# =====================================
# INICIO
# =====================================
print("📦 Cargando modelo Vosk...")

model = Model(MODEL_PATH)

recognizer = KaldiRecognizer(model, VOSK_RATE)
recognizer.SetWords(True)

# Precargar LLM
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

        # 48k -> 16k para Vosk
        audio_16k = scipy.signal.resample_poly(data[:, 0], 1, 3)
        audio_bytes = audio_16k.astype(np.int16).tobytes()

        if recognizer.AcceptWaveform(audio_bytes):

            result = json.loads(recognizer.Result())

            if result.get("text"):

                texto_usuario = result["text"].strip()

                if not texto_usuario:
                    continue

                print("\n🗣️ Usuario:", texto_usuario)

                respuesta = preguntar_ollama(texto_usuario)

                print("🤖 Inti:", respuesta)
                print("-" * 50)

                hablar(respuesta)

                time.sleep(0.2)

        else:
            parcial = json.loads(recognizer.PartialResult())

            if parcial.get("partial"):
                print("Escuchando:", parcial["partial"], end="\r")
