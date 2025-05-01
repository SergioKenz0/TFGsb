import subprocess
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

PRELOADED_DIR = "data/preloaded"
GENERATED_DIR = "data/generated"

app = Flask(__name__)
CORS(app)

# Cargar todos los reports
def cargar_reports():
    reports = []
    for carpeta in [PRELOADED_DIR, GENERATED_DIR]:
        if not os.path.exists(carpeta):
            os.makedirs(carpeta)
        for nombre in sorted(os.listdir(carpeta)):
            if nombre.endswith(".json"):
                path = os.path.join(carpeta, nombre)
                try:
                    with open(path, 'r') as f:
                        data = json.load(f)
                        if isinstance(data, list):  # ahora es una lista de análisis por repo
                            reports.append({
                                "filename": nombre,
                                "repos": data
                            })
                        else:
                            print(f"⚠️ Formato inválido en {nombre}: se esperaba una lista")
                except json.JSONDecodeError:
                    print(f"⚠️ Error al parsear {nombre}")
                except Exception as e:
                    print(f"⚠️ Error al cargar {nombre}: {e}")
    return reports

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        urls = data.get('repo_urls')
        if not urls or not isinstance(urls, list):
            return jsonify({"error": "Debe enviar una lista de URLs"}), 400
        if len(urls) > 5:
            return jsonify({"error": "Límite de 5 repositorios por análisis"}), 400

        existing_reports = [
            f for f in os.listdir(GENERATED_DIR) if f.startswith("report") and f.endswith(".json")
        ]
        next_index = len(existing_reports) + len(os.listdir(PRELOADED_DIR)) + 1
        output_filename = f"report{next_index}.json"
        output_path = os.path.join(GENERATED_DIR, output_filename)

        result = subprocess.run(
            ['python3', 'prueba1.py', *urls, output_path],
            capture_output=True,
            text=True
        )

        if result.stderr:
            print(f"❌ Error en el script: {result.stderr}")
            return jsonify({"error": result.stderr}), 500

        if not os.path.exists(output_path):
            return jsonify({"error": "El archivo JSON de salida no fue generado."}), 500

        with open(output_path, 'r') as f:
            json_data = json.load(f)

        return jsonify(json_data)

    except Exception as e:
        print(f"❌ Error en backend: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/reports', methods=['GET'])
def get_reports():
    try:
        reports = cargar_reports()
        return jsonify(reports)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
