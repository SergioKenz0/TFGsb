import subprocess
import os
import uuid
import json

def test_analyze_script_generates_json():
    test_url = "https://github.com/tensorflow/tensorflow"
    filename = f"test_report_{uuid.uuid4().hex[:6]}.json"

    # Ruta al script analyze.py dentro de la carpeta back/
    script_path = os.path.join("back", "analyze.py")

    # Asegurarse de que el token está disponible
    env = os.environ.copy()
    token = env.get("GITHUB_TOKEN")
    assert token is not None, "Variable de entorno GITHUB_TOKEN no definida"

    result = subprocess.run(
        ['python3', script_path, test_url, filename],
        capture_output=True,
        text=True,
        env=env
    )

    # Comprobaciones básicas
    assert result.returncode == 0, f"El script terminó con error: {result.stderr}"
    assert os.path.exists(filename), "El archivo JSON no fue generado"

    with open(filename, 'r') as f:
        data = json.load(f)
        assert isinstance(data, list), "El informe no es una lista JSON"
        assert "repo" in data[0], "Falta clave 'repo' en el análisis"

    os.remove(filename)
    print("✅ Prueba de ejecución directa de analyze.py completada con éxito")
