#!/usr/bin/env bash
# indigo | Gram Hesap — VPS ilk kurulum
# Kullanım (sunucuda, repo /opt/gram-hesap altına klonlandıktan sonra):
#   sudo bash deploy/setup-vps.sh
# İlk çalıştırmada .env oluşturur ve durur; AUTH_USERS'ı düzenleyip tekrar çalıştırın.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOMAIN="gramhesap.indigotaki.app"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Bu script root olarak çalışmalı (sudo)."
  exit 1
fi

cd "$APP_DIR"

if [[ ! -f .env ]]; then
  cp deploy/env.example .env
  SECRET="$(openssl rand -base64 32)"
  sed -i "s|^AUTH_SECRET=.*|AUTH_SECRET=${SECRET}|" .env
  chmod 600 .env
  echo "!! .env oluşturuldu. AUTH_USERS değerini düzenleyin:"
  echo "   nano $APP_DIR/.env"
  echo "   Ardından: sudo bash deploy/setup-vps.sh"
  exit 0
fi

if ! docker network inspect atolye-stok_default >/dev/null 2>&1; then
  echo "atolye-stok_default ağı yok — önce atolye-stok çalışıyor olmalı." >&2
  exit 1
fi

echo "==> Docker Compose build & up"
docker compose up -d --build
docker compose ps

echo "==> Caddy site bloğu"
chmod +x deploy/ensure-caddy-gramhesap.sh
deploy/ensure-caddy-gramhesap.sh

CRON_FILE="/etc/cron.d/gramhesap-caddy-ensure"
if [[ ! -f "$CRON_FILE" ]]; then
  echo "*/2 * * * * root $APP_DIR/deploy/ensure-caddy-gramhesap.sh >>/var/log/gramhesap-caddy-ensure.log 2>&1" > "$CRON_FILE"
  echo "    cron eklendi: $CRON_FILE"
fi

echo "==> Kontrol (DNS $DOMAIN → bu sunucu olmalı)"
sleep 3
curl -sS -o /dev/null -w "public giris: %{http_code}\n" --max-time 20 "https://${DOMAIN}/giris" || true
echo "Tamam: https://${DOMAIN}"
