import subprocess
import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        print(f" Datos recibidos: {data}")  
        
        if not data or 'repo_url' not in data:
            return jsonify({"error": "URL del repositorio no proporcionada"}), 400
        
        repo_url = data['repo_url']
        print(f" Analizando: {repo_url}")  

        # Ejecutar el script de análisis sin necesidad de input()
        result = subprocess.run(
            ['python3', 'prueba1.py', repo_url], 
            capture_output=True, text=True
        )

        # 🚨 Ver errores del script si hay fallos
        if result.stderr:
            print(f" Error en el script: {result.stderr}")
            return jsonify({"error": result.stderr}), 500

        # 📜 Ver la salida del script
        print(f" Salida del script: {result.stdout}")

        # Construir el nombre del archivo JSON esperado
        repo_name = repo_url.split("/")[-1]
        json_filename = f"repositorio_{repo_name}.json"

        # Verificar si el archivo JSON fue creado
        if not os.path.exists(json_filename):
            return jsonify({"error": "El archivo JSON de salida no fue generado."}), 500

        # Leer el JSON generado
        with open(json_filename, 'r') as f:
            try:
                repo_data = json.load(f)
            except json.JSONDecodeError:
                return jsonify({"error": "El archivo JSON está corrupto o vacío."}), 500

        return jsonify(repo_data)

    except Exception as e:
        print(f" Error en backend: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
