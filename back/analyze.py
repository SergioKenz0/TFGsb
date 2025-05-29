import requests
import json
import sys
import os
import re
from urllib.parse import urlparse
from datetime import datetime, timedelta
from collections import defaultdict

# === CONFIG ===
GITHUB_API_URL = "https://api.github.com/graphql"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

if not GITHUB_TOKEN:
    print(" No se encontró el token de GitHub en las variables de entorno.")
    sys.exit(1)

HEADERS = {"Authorization": f"Bearer {GITHUB_TOKEN}"}

# === FUNCIONES  BÁSICAS ===

def obtener_owner_repo(url):
    parsed_url = urlparse(url)
    parts = parsed_url.path.strip("/").split("/")
    if len(parts) == 2:
        return parts[0], parts[1]
    raise ValueError("URL de repositorio no válida")

def ejecutar_consulta(query):
    response = requests.post(GITHUB_API_URL, json={"query": query}, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Query fallida: {response.status_code} - {response.text}")

def calcular_dias(fecha1, fecha2):
    try:
        f1 = datetime.fromisoformat(fecha1.replace("Z", "+00:00"))
        f2 = datetime.fromisoformat(fecha2.replace("Z", "+00:00"))
        return (f2 - f1).days
    except:
        return "N/A"

# === MÉTRICAS  COMPLEJAS ===

def calcular_promedio_dias_entre_commits(fechas_iso):
    fechas = [datetime.fromisoformat(f.replace("Z", "+00:00")) for f in fechas_iso]
    fechas.sort()
    if len(fechas) < 2:
        return "N/A"
    diferencias = [(fechas[i+1] - fechas[i]).days for i in range(len(fechas) - 1)]
    promedio = sum(diferencias) / len(diferencias)
    return round(promedio, 2)

def calcular_tiempo_medio_respuesta(owner, repo):
    query = f"""
    {{
      repository(owner: "{owner}", name: "{repo}") {{
        issues(first: 50, orderBy: {{field: CREATED_AT, direction: DESC}}) {{
          nodes {{
            createdAt
            comments(first: 1) {{
              nodes {{
                createdAt
              }}
            }}
          }}
        }}
      }}
    }}
    """
    data = ejecutar_consulta(query)
    issues = data["data"]["repository"]["issues"]["nodes"]
    tiempos_respuesta = []
    for issue in issues:
        created_at = issue["createdAt"]
        if issue["comments"]["nodes"]:
            first_response = issue["comments"]["nodes"][0]["createdAt"]
            dias = calcular_dias(created_at, first_response)
            if dias != "N/A":
                tiempos_respuesta.append(dias)
    return round(sum(tiempos_respuesta) / len(tiempos_respuesta), 2) if tiempos_respuesta else "N/A"

def calcular_merge_time(owner, repo):
    query = f"""
    {{
      repository(owner: "{owner}", name: "{repo}") {{
        pullRequests(first: 50, states: MERGED, orderBy: {{field: CREATED_AT, direction: DESC}}) {{
          nodes {{
            createdAt
            mergedAt
          }}
        }}
      }}
    }}
    """
    data = ejecutar_consulta(query)
    prs = data["data"]["repository"]["pullRequests"]["nodes"]
    dias = [
        calcular_dias(pr["createdAt"], pr["mergedAt"])
        for pr in prs if pr["createdAt"] and pr["mergedAt"]
    ]
    return round(sum(dias) / len(dias), 2) if dias else "N/A"

def calcular_ratio_contrib_externos(contribuidores, owner):
    externos = 0
    for c in contribuidores:
        login = c["login"].lower()
        if owner.lower() not in login:
            externos += 1
    if len(contribuidores) == 0:
        return "N/A"
    return round((externos / len(contribuidores)) * 100, 2)

def detectar_cobertura_tests(readme_text):
    if not readme_text:
        return "N/A"

    patrones = [
        r'coverage[\\s:-]+(\\d{1,3})\\s?%',
        r'(\\d{1,3})\\s?%[\\s-]*(coverage|cobertura)',
        r'img\\.shields\\.io.*coverage.*[-/](\\d{1,3})%?',
        r'codecov\\.io.*badge.*?(\\d{1,3})%?',
        r'coveralls\\.io.*badge.*?(\\d{1,3})%?'
    ]

    for patron in patrones:
        match = re.search(patron, readme_text, re.IGNORECASE)
        if match:
            try:
                porcentaje = int(match.group(1))
                if 0 <= porcentaje <= 100:
                    return f"{porcentaje}%"
            except:
                continue

    return "N/A"

# === ANÁLISIS DE COMMIT Y ACTIVIDAD ===

def obtener_commits(owner, repo):
    query = f"""
    {{
      repository(owner: "{owner}", name: "{repo}") {{
        defaultBranchRef {{
          target {{
            ... on Commit {{
              history(first: 100) {{
                edges {{
                  node {{
                    committedDate
                    author {{
                      user {{
                        login
                      }}
                    }}
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
    }}
    """
    data = ejecutar_consulta(query)
    edges = data["data"]["repository"]["defaultBranchRef"]["target"]["history"]["edges"]
    if not edges:
        return {
            "first_commit": "Fecha no disponible",
            "last_commit": "Fecha no disponible",
            "contributors": [],
            "commit_activity": [],
            "active_contributors": 0,
            "active_lifespan_days": "N/A",
            "commit_dates": []
        }

    commits = [e["node"] for e in edges]
    first_commit = commits[-1]["committedDate"]
    last_commit = commits[0]["committedDate"]

    contrib_dict = defaultdict(int)
    commit_week = defaultdict(int)
    for c in commits:
        login = c["author"]["user"]["login"] if c["author"]["user"] else "Anónimo"
        contrib_dict[login] += 1
        fecha = datetime.fromisoformat(c["committedDate"].replace("Z", "+00:00"))
        semana = fecha - timedelta(days=fecha.weekday())
        commit_week[semana.strftime("%Y-%m-%d")] += 1

    total_commits = sum(contrib_dict.values())
    contributors = [{"login": k, "commits": v} for k, v in sorted(contrib_dict.items(), key=lambda x: -x[1])]
    active_contributors = [c for c in contributors if c["commits"] >= total_commits * 0.1]
    activity = [{"week": w, "count": c} for w, c in sorted(commit_week.items())]
    active_lifespan_days = calcular_dias(activity[0]["week"] + "T00:00:00Z", activity[-1]["week"] + "T00:00:00Z") if activity else "N/A"

    return {
        "first_commit": first_commit,
        "last_commit": last_commit,
        "contributors": contributors,
        "active_contributors": len(active_contributors),
        "commit_activity": activity,
        "active_lifespan_days": active_lifespan_days,
        "commit_dates": [c["committedDate"] for c in commits]
    }

def obtener_datos_propietario(owner):
    query = f"""
    {{
      user(login: "{owner}") {{
        __typename
        location
      }}
      organization(login: "{owner}") {{
        __typename
        location
      }}
    }}
    """
    data = ejecutar_consulta(query)
    if data["data"]["user"]:
        return data["data"]["user"]["__typename"], data["data"]["user"].get("location", "Ubicación no disponible")
    elif data["data"]["organization"]:
        return data["data"]["organization"]["__typename"], data["data"]["organization"].get("location", "Ubicación no disponible")
    else:
        return "Desconocido", "Ubicación no disponible"

# === ANÁLISIS DEL REPOSITORIO ===

def analizar_repo(owner, repo):
    commit_info = obtener_commits(owner, repo)
    issue_response_time = calcular_tiempo_medio_respuesta(owner, repo)
    merge_time = calcular_merge_time(owner, repo)

    query = f"""
    {{
      repository(owner: "{owner}", name: "{repo}") {{
        name
        url
        createdAt
        stargazerCount
        forkCount
        watchers {{ totalCount }}
        diskUsage
        issues {{ totalCount }}
        closedIssues: issues(states: CLOSED) {{ totalCount }}
        pullRequests {{ totalCount }}
        languages(first: 5, orderBy: {{field: SIZE, direction: DESC}}) {{
          edges {{
            size
            node {{ name }}
          }}
        }}
        licenseInfo {{ name }}
        object(expression: "HEAD:README.md") {{ ... on Blob {{ text }} }}
        owner {{ login }}
      }}
    }}
    """
    data = ejecutar_consulta(query)
    repo_data = data["data"]["repository"]
    owner_type, owner_location = obtener_datos_propietario(owner)

    total_lang = sum(l["size"] for l in repo_data["languages"]["edges"])
    lang_breakdown = [
        {"name": l["node"]["name"], "percentage": round((l["size"] / total_lang) * 100, 2)}
        for l in repo_data["languages"]["edges"]
    ] if total_lang > 0 else []
    readme_text = repo_data["object"]["text"] if repo_data["object"] else ""
    test_coverage = detectar_cobertura_tests(readme_text)

    return {
        "repo": {
            "name": repo_data["name"],
            "owner": owner,
            "url": repo_data["url"],
            "owner_type": owner_type,
            "owner_location": owner_location,
            "created_at": repo_data["createdAt"],
            "first_commit": commit_info["first_commit"],
            "last_commit": commit_info["last_commit"]
        },
        "metrics": {
            "stars": repo_data["stargazerCount"],
            "forks": repo_data["forkCount"],
            "watchers": repo_data["watchers"]["totalCount"],
            "disk_usage_kb": repo_data["diskUsage"],
            "open_issues": repo_data["issues"]["totalCount"],
            "closed_issues": repo_data["closedIssues"]["totalCount"],
            "branches": "N/A",
            "pull_requests": {
                "total": repo_data["pullRequests"]["totalCount"],
                "open": "N/A",
                "closed": "N/A"
            },
            "contributors": {
                "total": len(commit_info["contributors"]),
                "active": commit_info["active_contributors"],
                "by_commit": commit_info["contributors"]
            }
        },
        "activity": {
            "lifespan_days": calcular_dias(repo_data["createdAt"], commit_info["last_commit"]),
            "inactive_for_days": calcular_dias(commit_info["last_commit"], datetime.utcnow().isoformat()),
            "commit_activity": commit_info["commit_activity"],
            "active_lifespan_days": commit_info["active_lifespan_days"]
        },
        "languages": {
            "main": lang_breakdown[0]["name"] if lang_breakdown else "Desconocido",
            "breakdown": lang_breakdown
        },
        "license": repo_data["licenseInfo"]["name"] if repo_data["licenseInfo"] else "Sin licencia",
        "best_practices": {
            "readme": repo_data["object"] is not None,
            "license": repo_data["licenseInfo"] is not None,
            "contributing": False,
            "code_of_conduct": False,
            "issue_templates": False,
            "pull_request_template": False
        },
        "advanced_metrics": {
            "avg_days_between_commits": calcular_promedio_dias_entre_commits(commit_info["commit_dates"]),
            "issue_closure_rate": round((repo_data["closedIssues"]["totalCount"] / (repo_data["issues"]["totalCount"] + 1e-6)) * 100, 2),
            "avg_response_time_issues": issue_response_time,
            "avg_merge_time": merge_time,
            "external_contributors_ratio": calcular_ratio_contrib_externos(commit_info["contributors"], owner),
            "test_coverage": test_coverage
        }
    }

# === EJECUCIÓN PRINCIPAL ===

if __name__ == "__main__":
    urls = sys.argv[1:-1]
    output_file = sys.argv[-1]

    if not urls:
        print(" Debes proporcionar al menos una URL.")
        sys.exit(1)

    results = []
    for url in urls:
        try:
            owner, repo = obtener_owner_repo(url)
            print(f"🔍 Analizando: {owner}/{repo}")
            results.append(analizar_repo(owner, repo))
        except Exception as e:
            print(f" Error con {url}: {e}")

    with open(output_file, "w") as f:
        json.dump({"fecha": datetime.utcnow().isoformat(), "repos": results}, f, indent=2)

    print(f"✅ Reporte guardado en {output_file}")
