ollama list

ollama run gemma3:4b
ollama run gemma3:1b
ollama run stablelm2:latest

- verbose (Indicar los tokens gastado y todo eso)


Código para comunicación con micrófono y LLM:

import queue
import sounddevice as sd
import numpy as np
import json
import requests
import scipy.signal 
from vosk import Model, KaldiRecognizer

# ========= CONFIG =========
MODEL_PATH = "/home/laboratorioinnovacion/Descargas/vosk-model-small-es-0.42"
INPUT_RATE = 48000
VOSK_RATE = 16000
DEVICE = 0
MODEL_OLLAMA = "gemma3:4b"
# ==========================

q = queue.Queue()

def callback(indata, frames, time, status):
    if status:
        print(status)
    q.put(indata.copy())

def preguntar_ollama(texto):
    
    system_prompt=(
        "Eres un robot social creado para acompañar emocionalmente a niños hospitalizados. Tu nombre es Inti, tienes forma de una llama. Debes dirigirte respetuosamente hacia los niños, debes evitar temas sensibles como la violencia o muerte. Las respuestas que brindes deben ser cortas, las preguntas respecto al estado de salud  físico o mental del niño debes referirlas a que se realicen a un profesional de salud como qué hacer si te duele alguna parte del cuerpo o si te sientes enfermo. Evita ser muy cariñoso en exceso, tu rol es ser un compañero no un padre de familia. "
        
        )
    
    r = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": MODEL_OLLAMA,
            "prompt": texto,
            "system": system_prompt,
            "stream": False
        },
        timeout=120
    )
    return r.json()["response"]

print("Cargando modelo Vosk...")
model = Model(MODEL_PATH)
recognizer = KaldiRecognizer(model, VOSK_RATE)
recognizer.SetWords(True)

print("🎤 Micrófono activo (48k → 16k). Habla...")

with sd.InputStream(
    samplerate=INPUT_RATE,
    device = DEVICE,
    channels=1,
    dtype="int16",
    callback=callback
):
    while True:
        data = q.get()

        # 🔁 RESAMPLE 48k → 16k
        audio_16k = scipy.signal.resample_poly(data[:,0],1,3)
        audio_bytes = audio_16k.astype(np.int16).tobytes()

        if recognizer.AcceptWaveform(audio_bytes):
            result = json.loads(recognizer.Result())
            if result.get("text"):
                print("\n Reconocido:", result["text"])
                
                respuesta = preguntar_ollama(result["text"])
                print("🤖 Ollama:", respuesta)
                print("-" * 40)
        else:
            parcial = json.loads(recognizer.PartialResult())
            if parcial.get("partial"):
                print("Esperando", parcial["partial"], end="\r")


