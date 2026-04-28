import queue
import sounddevice as sd
import json
import numpy as np
from vosk import Model, KaldiRecognizer
import scipy.signal

MODEL_PATH = "/home/laboratorioinnovacion/Descargas/vosk-model-small-es-0.42"
DEVICE = 0               # Google voiceHAT
INPUT_RATE = 48000       # rate REAL del mic
VOSK_RATE = 16000        # rate que necesita Vosk

q = queue.Queue()

def callback(indata, frames, time, status):
    if status:
        print(status)
    q.put(indata.copy())

print("Cargando modelo...")
model = Model(MODEL_PATH)
recognizer = KaldiRecognizer(model, VOSK_RATE)
recognizer.SetWords(True)

print("Micrófono activo. Habla (Ctrl+C para salir)")

with sd.InputStream(
    samplerate=INPUT_RATE,
    device=DEVICE,
    channels=1,
    dtype="int16",
    callback=callback
):
    while True:
        data = q.get()

        # 🔁 Convertir 48k → 16k
        audio_16k = scipy.signal.resample_poly(data[:, 0], 1, 3)
        audio_bytes = audio_16k.astype(np.int16).tobytes()

        if recognizer.AcceptWaveform(audio_bytes):
            result = json.loads(recognizer.Result())
            if result.get("text"):
                print("\n Reconocido:", result["text"])
        else:
            parcial = json.loads(recognizer.PartialResult())
            if parcial.get("partial"):
                print("Esperando", parcial["partial"], end="\r")
