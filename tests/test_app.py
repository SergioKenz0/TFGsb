import os
import pytest
import requests

BASE_URL = "http://localhost:5000"
TOKEN = os.getenv("GITHUB_TOKEN")  

@pytest.mark.skipif(not TOKEN, reason="GITHUB_TOKEN no definido en el entorno")
def test_analyze_ok():
    payload = {
        "repo_urls": ["https://github.com/tensorflow/tensorflow"],
        "token": TOKEN
    }
    response = requests.post(f"{BASE_URL}/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "repo" in data[0]
    print("✅ Informe generado correctamente")

def test_analyze_missing_token():
    payload = {
        "repo_urls": ["https://github.com/tensorflow/tensorflow"]
        # No se incluye 'token'
    }
    response = requests.post(f"{BASE_URL}/analyze", json=payload)
    assert response.status_code == 400
    assert "token" in response.json().get("error", "").lower()
    print("✅ Error detectado correctamente por token faltante")

def test_get_reports():
    response = requests.get(f"{BASE_URL}/reports")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for report in data:
        assert "filename" in report
        assert "repos" in report
    print("✅ Listado de informes cargado correctamente")
