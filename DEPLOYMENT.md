# Guía de Despliegue Continuo (CD) - Portfolio Web

Esta guía explica cómo funciona el despliegue automático del proyecto Portfolio Web en producción mediante el uso de **GitHub Container Registry (GHCR)** y **Watchtower**.

## Arquitectura de Despliegue

```
[ Push a main ] ──▶ [ GitHub Actions ] ──▶ [ Compila y sube a GHCR ]
                                                   │
                                                   ▼
[ Servidor ] ◀─── [ Watchtower ] (Cada 5 min descarga y reinicia portfolio-web)
```

1. Cada vez que subes cambios a la rama `main` en GitHub, el flujo de trabajo `.github/workflows/docker-build-push.yml` compila la nueva imagen Docker de producción y la publica en `ghcr.io/kore29/portfolio-web:latest`.
2. El contenedor `portfolio-watchtower` en tu servidor monitorea la imagen publicada en GHCR. Cuando detecta cambios, realiza la descarga y reinicia ordenadamente el contenedor `portfolio-web`.

---

## Configuración del Servidor (Paso a Paso)

Para poner en marcha este flujo automático, sigue estos pasos en el servidor de producción:

### Paso 1: Generar un Token de Acceso Personal en GitHub
Dado que las imágenes de paquetes suelen ser privadas por defecto en GHCR, tu servidor necesita permisos para descargarlas:
1. Entra a tu cuenta de GitHub y ve a **Settings** ──▶ **Developer settings** ──▶ **Personal access tokens** ──▶ **Tokens (classic)**.
2. Genera un nuevo token con el alcance (scope) `read:packages` (si ya lo hiciste para Volta, puedes usar el mismo token).
3. Copia el token generado.

### Paso 2: Autenticar Docker en el Servidor
Si aún no lo has hecho, inicia sesión en el registro de paquetes de GitHub utilizando tu usuario y el token de acceso clásico creado en el paso anterior:

```bash
docker login ghcr.io
```

* **Username:** Tu usuario de GitHub.
* **Password:** El Token de Acceso Personal (PAT) clásico.

Este comando guardará tus credenciales de forma segura en `~/.docker/config.json`, archivo que es leído internamente por Watchtower para conectarse a GHCR.

### Paso 3: Iniciar el Proyecto en Producción
Asegúrate de que la red externa de Cloudflare existe:
```bash
docker network create cloudfare-tunnel_default || true
```

Levanta los contenedores en segundo plano:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Este comando levantará:
* `portfolio-web` (consumiendo la imagen de GHCR).
* `portfolio-watchtower` (guardián de actualizaciones).

---

## Verificación y Mantenimiento

* **Ver los logs del despliegue automático:**
  Puedes verificar si Watchtower está buscando e instalando actualizaciones revisando sus logs:
  ```bash
  docker logs -f portfolio-watchtower
  ```
* **Limpieza de disco:**
  Watchtower está configurado con la bandera `--cleanup`, lo que garantiza que las versiones antiguas y en desuso de tus imágenes Docker se eliminen del servidor tras cada actualización exitosa, evitando el desgaste de espacio en disco.

---

## Endpoint de Health Check (Monitoreo de Estado)

El contenedor expone un endpoint dedicado y ligero para herramientas de monitoreo (como Sira, Uptime Kuma o Cloudflare):

* **URL:** `/api/health`
* **Respuesta esperada:** `HTTP 200 OK` con JSON `{"status": "ok", "uptime": ...}`

Configurar Sira o tu monitor de uptime apuntando a `https://tudominio.com/api/health` en lugar de la raíz `/` evita redirecciones de i18n y asegura verificaciones súper rápidas.

---

## Recomendaciones para Evitar Alertas de Downtime (502) en Actualizaciones

Si Watchtower reinicia el contenedor al detectar una nueva versión de la imagen en GHCR, la aplicación tarda ~30 segundos en inicializar Node.js/Next.js:

1. **Monitoreo con reintentos en Sira:** Configura tu monitor Uptime (Sira) con al menos 2 ó 3 reintentos (retry count: 2) con 10-15 segundos de diferencia antes de disparar la alerta de caída a Telegram/Discord.
2. **Healthchecks en Docker:** El servicio `portfolio-web` en `docker-compose.prod.yml` cuenta con `healthcheck` integrado para que Docker reporte el estado `healthy` únicamente cuando Node.js está listo para recibir tráfico.

