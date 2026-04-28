# Conexión de LLM con el micrófono y ASR (modelo de vosk)

import queue
import sounddevice as sd
import numpy as np
import json
import requests
from scipy.signal import resample
from vosk import Model, KaldiRecognizer

MODEL_PATH = "/home/laboratorioinnovacion/Descargas/vosk-model-small-es-0.42"
INPUT_RATE = 48000
VOSK_RATE = 16000
MODEL_OLLAMA = "gemma3:4b"

q = queue.Queue()

def callback(indata,frames,time,status):
  if status:
    print(status)
  q.put(indata.copy())
def preguntar_ollama(texto):
  system_prompt = ("Eres un robot social creado para acompañar emocionalmente a niños hospitalizados. Tu nombre es Inti, tienes forma de una llama. Debes dirigirte respetuosamente hacia los niños, debes evitar temas sensibles como la violencia o muerte. Las respuestas que brindes deben ser cortas, las preguntas respecto al estado de salud  físico o mental del niño debes referirlas a que se realicen a un profesional de salud como qué hacer si te duele alguna parte del cuerpo o si te sientes enfermo. Evita ser muy cariñoso en exceso, tu rol es ser un compañero no un padre de familia. ")
  r = request.post(
    "http://localhost:11434/api/generate",
    json ={
      "model": MODEL_OLLAMA,
      "prompt": texto,
      "system": system_prompt,
      "stream": False
    },
    timeout=120
  )
  return r.json()["response"]

print("Cargando modelo de vosk")
model = Model(MODEL_PATH)
recognizer = KaldiRecognizer(model,VOSK_RATE)

print("Microfono activo")
with sd.InputStream(
  samplerate = INPUT_RATE,
  channels = 1,
  dtype = "float32",
  callback = callback
):
    while True:
        audio_48k = q.get().flatten()

        # 🔁 RESAMPLE 48k → 16k
        num_samples = int(len(audio_48k) * VOSK_RATE / INPUT_RATE)
        audio_16k = resample(audio_48k, num_samples)

        # convertir a int16 para Vosk
        audio_int16 = (audio_16k * 32767).astype(np.int16)

        if recognizer.AcceptWaveform(audio_int16.tobytes()):
            result = json.loads(recognizer.Result())
            texto = result.get("text", "")

            if texto:
                print("🗣️ Tú:", texto)

                respuesta = preguntar_ollama(texto)
                print("🤖 Ollama:", respuesta)
                print("-" * 40)
