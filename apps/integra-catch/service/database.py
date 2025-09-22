import os
import uuid
from datetime import timedelta
import oracledb
from dotenv import load_dotenv


base_path = os.path.dirname(os.path.abspath(__file__))

# Procurar o .env subindo até 5 níveis acima (flexível)
dotenv_path = None
current_path = base_path
for _ in range(5):
    candidate = os.path.join(current_path, ".env")
    if os.path.isfile(candidate):
        dotenv_path = candidate
        break
    current_path = os.path.dirname(current_path)

if dotenv_path is None:
    raise FileNotFoundError("Arquivo .env não encontrado! Verifique onde está o .env.")

load_dotenv(dotenv_path)
print("[DEBUG] Carregando .env de:", dotenv_path)

user = os.getenv("ORACLE_USER")
password = os.getenv("ORACLE_PASSWORD")
host = os.getenv("ORACLE_HOST")
port = os.getenv("ORACLE_PORT")
service = os.getenv("ORACLE_SERVICE")

if not all([user, password, host, port, service]):
    raise ValueError("Alguma variável de conexão com o Oracle está faltando no .env!")

dsn = oracledb.makedsn(host, port, service_name=service)
conn = oracledb.connect(user=user, password=password, dsn=dsn)

def save_barcode(timestamp, barcode_type: str, barcode: str):
    try:
        sale_id = str(uuid.uuid4())
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO sales (sale_id, sale_timestamp, sale_barcode_type, sale_barcode)
            VALUES (:id, :timestamp, :barcode_type, :barcode)
            """,
            {
                "id": sale_id,
                "timestamp": timestamp,
                "barcode_type": barcode_type,
                "barcode": barcode
            }
        )
        conn.commit()
        print(f"[OK] Código '{barcode}' ({barcode_type}) salvo no banco.")
    except Exception as e:
        print("Erro ao salvar código:", e)
        conn.rollback()
    finally:
        cursor.close()

def save_log(log_timestamp, log_type: int, log_content: str):
    try:
        log_id = str(uuid.uuid4())
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO logs (log_id, log_timestamp, log_type, log_content)
            VALUES (:log_id, :log_timestamp, :log_type, :log_content)
            """,
            {
                "log_id": log_id,
                "log_timestamp": log_timestamp,
                "log_type": log_type,
                "log_content": log_content
            }
        )
        conn.commit()
        print(f"[OK] Log salvo no banco.")
    except Exception as e:
        print("Erro ao salvar log:", e)
        conn.rollback()
    finally:
        cursor.close()

def get_capture_state():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT cfg_capture_state FROM cfg WHERE ROWNUM = 1")
        result = cursor.fetchone()
        return bool(result[0]) if result else False
    except Exception as e:
        print("Erro ao ler cfg_capture_state:", e)
        return False
    finally:
        cursor.close()

def get_sync_interval():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT cfg_sync_interval FROM cfg WHERE ROWNUM = 1")
        result = cursor.fetchone()
        return timedelta(seconds=int(result[0])) if result else timedelta(seconds=10)
    except Exception as e:
        print("Erro ao ler cfg_sync_interval:", e)
        return timedelta(seconds=10)
    finally:
        cursor.close()

def get_check_interval():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT cfg_check_interval FROM cfg WHERE ROWNUM = 1")
        result = cursor.fetchone()
        return timedelta(seconds=int(result[0])) if result else timedelta(seconds=10)
    except Exception as e:
        print("Erro ao ler cfg_check_interval:", e)
        return timedelta(seconds=10)
    finally:
        cursor.close()

def close_connection():
    try:
        conn.close()
    except Exception as e:
        print("Erro ao fechar conexão:", e)
