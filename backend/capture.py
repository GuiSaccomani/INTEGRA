import keyboard
from datetime import datetime
from service.validator import is_ean13, is_upca, is_ean8
from service.database import save_barcode, save_log, get_capture_state, get_check_interval, get_sync_interval
import time

# Estado inicial
capture_state = get_capture_state()
check_interval = get_check_interval()
sync_interval = get_sync_interval()
last_check = datetime.min

# Validadores de código de barras
validators = {
    "EAN-13": is_ean13,
    "UPC-A": is_upca,
    "EAN-8": is_ean8
}

buffer = ""  # Armazena os caracteres até Enter

def process_barcode(barcode):
    """Valida e salva o código de barras."""
    barcode = barcode.strip()
    if not barcode.isdecimal():
        print(f"Ignored input (not numeric): {barcode}")
        return
    for barcode_type, func in validators.items():
        if func(barcode):
            save_barcode(datetime.now(), barcode_type, barcode)
            save_log(datetime.now(), "OK", f"{barcode_type} pattern. Valid barcode captured: {barcode}")
            return
    save_log(datetime.now(), "ERROR", f"Invalid barcode: {barcode}")

def on_key(event):
    """Captura teclas e monta o buffer."""
    global buffer, capture_state
    if not capture_state:
        return

    char = event.name
    if char == "enter":
        if buffer:
            process_barcode(buffer)
            buffer = ""
    elif char == "backspace":
        buffer = buffer[:-1]
    elif len(char) == 1 and char.isprintable():
        buffer += char

def monitor_capture_state():
    """Atualiza periodicamente o estado de captura e logs."""
    global capture_state, last_check
    previous_state = capture_state
    now = datetime.now()
    if now - last_check >= check_interval:
        last_check = now
        capture_state = get_capture_state()
        if previous_state and not capture_state:
            save_log(datetime.now(), "INTERRUPTED", "Keyboard capture stopped")
        elif not previous_state and capture_state:
            save_log(datetime.now(), "RESUMED", "Keyboard capture resumed")

def start_capture():
    """Inicia o hook global de teclado e monitora estado de captura."""
    global last_check
    save_log(datetime.now(), "START", "Keyboard capture started")
    keyboard.on_press(on_key)  # Use on_press para evitar duplicação

    try:
        while True:
            monitor_capture_state()
            time.sleep(0.01)
    except KeyboardInterrupt:
        save_log(datetime.now(), "STOP", "Keyboard capture stopped by user")

if __name__ == "__main__":
    start_capture()
