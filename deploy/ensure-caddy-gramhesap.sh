#!/bin/sh
# gramhesap.indigotaki.app bloğunu paylaşılan atolye-stok Caddyfile'ına ekler (yoksa).
# atolye-stok redeploy Caddyfile'ı ezerse geri yazar.
# Cron: */2 * * * * root /opt/gram-hesap/deploy/ensure-caddy-gramhesap.sh >>/var/log/gramhesap-caddy-ensure.log 2>&1
set -eu

CADDYFILE="${CADDYFILE:-/opt/atolye-stok/deploy/Caddyfile}"
COMPOSE_DIR="${COMPOSE_DIR:-/opt/atolye-stok}"
SITE_SRC="${SITE_SRC:-/opt/gram-hesap/deploy/caddy-sites/gramhesap.caddy}"
MARKER="gramhesap.indigotaki.app"

log() {
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) [ensure-caddy-gramhesap] $*"
}

if [ ! -f "$CADDYFILE" ]; then
  log "HATA: Caddyfile yok: $CADDYFILE"
  exit 1
fi

if [ ! -f "$SITE_SRC" ]; then
  log "HATA: site dosyası yok: $SITE_SRC"
  exit 1
fi

if grep -q "$MARKER" "$CADDYFILE"; then
  log "ok — $MARKER zaten Caddyfile içinde"
  exit 0
fi

log "eksik — $MARKER ekleniyor"
printf '\n' >> "$CADDYFILE"
cat "$SITE_SRC" >> "$CADDYFILE"

cd "$COMPOSE_DIR"
docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile \
  || docker compose up -d caddy
log "caddy yenilendi — $MARKER eklendi"
