# Autor: kenzO

import requests
import json
import sys
from urllib.parse import urlparse

# Configuración inicial
GITHUB_API_URL = "https://api.github.com/graphql"
GITHUB_TOKEN = ""  # Sustituye por tu token

# Encabezados de autenticación
HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}"
}

# Función para extraer owner y repo_name de la URL
def obtener_owner_repo(url):
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.strip('/').split('/')
    if len(path_parts) == 2:
        return path_parts[0], path_parts[1]  # owner, repo_name
    else:
        raise ValueError("La URL proporcionada no es válida.")

def ejecutar_consulta(query):
    response = requests.post(
        GITHUB_API_URL,
        json={'query': query},
        headers=HEADERS
    )
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Query fallida: {response.status_code}, {response.text}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Error: Debes proporcionar la URL del repositorio como argumento.")
        sys.exit(1)

    url_repo = sys.argv[1]  # Se obtiene la URL del primer argumento

    try:
        # Obtener owner y repo_name de la URL
        owner, repo_name = obtener_owner_repo(url_repo)

        # Consulta GraphQL para obtener datos del repositorio
        QUERY = f"""
        {{
          repository(owner: "{owner}", name: "{repo_name}") {{
            name
            createdAt
            stargazerCount
            forkCount
            issues {{
              totalCount
            }}
            closedIssues: issues(states: CLOSED) {{
              totalCount
            }}
            defaultBranchRef {{
              target {{
                ... on Commit {{
                  history {{
                    totalCount
                  }}
                }}
              }}
            }}
          }}
        }}
        """

        # Ejecutar la consulta y extraer los datos
        data = ejecutar_consulta(QUERY)
        repo_data = data["data"]["repository"]

        # Mostrar los datos extraídos
        print(f"Repositorio: {repo_data['name']}")
        print(f"Año de creación: {repo_data['createdAt'].split('-')[0]}")
        print(f"Estrellas: {repo_data['stargazerCount']}")
        print(f"Forks: {repo_data['forkCount']}")
        print(f"Issues abiertas: {repo_data['issues']['totalCount']}")
        print(f"Issues cerradas: {repo_data['closedIssues']['totalCount']}")
        print(f"Número total de commits: {repo_data['defaultBranchRef']['target']['history']['totalCount']}")

        # Guardar los datos en un archivo JSON
        json_filename = f"repositorio_{repo_data['name']}.json"
        with open(json_filename, "w") as archivo_json:
            json.dump(repo_data, archivo_json, indent=4)

        print(f"✅ Datos guardados en {json_filename}")

    except ValueError as ve:
        print(f"❌ Error en la URL: {ve}")
        sys.exit(1)
    except Exception as e:
        print(f"⚠️ Error en la consulta: {e}")
        sys.exit(1)
