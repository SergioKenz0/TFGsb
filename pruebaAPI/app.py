import subprocess
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        print(f"🔍 Datos recibidos: {data}")  
        
        if not data or 'repo_url' not in data:
            return jsonify({"error": "URL del repositorio no proporcionada"}), 400
        
        repo_url = data['repo_url']
        print(f"📡 Analizando: {repo_url}")  

        # Ejecutar el script de análisis sin necesidad de input()
        result = subprocess.run(
            ['python3', 'prueba1.py', repo_url], 
            capture_output=True, text=True
        )

        # 🚨 Ver errores del script si hay fallos
        if result.stderr:
            print(f"❌ Error en el script: {result.stderr}")
            return jsonify({"error": result.stderr}), 500

        # 📜 Ver la salida del script
        print(f"✅ Salida del script: {result.stdout}")

        # Leer el JSON generado
        repo_name = repo_url.split("/")[-1]
        json_filename = f"repositorio_{repo_name}.json"

        with open(json_filename, 'r') as f:
            repo_data = json.load(f)

        return jsonify(repo_data)

    except Exception as e:
        print(f"⚠️ Error en backend: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
