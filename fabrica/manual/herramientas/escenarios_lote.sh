#!/bin/sh
# Genera en lote los escenarios de un capítulo con FLUX local y les pone el pergamino. Lanzar en tmux (≈ 15 min por escena).
# Uso: sh escenarios_lote.sh historias/espanistan/sombras/epNN/escenas.txt [semilla]
#   escenas.txt: una línea por escena, «nombre|qué sale». Salida: epNN/flux/nombre.png (crudo) y epNN/nombre.webp (con pergamino).
#   Si se corta, relanzar: salta las escenas que ya existen.
H=$(dirname "$0"); D=$(dirname "$1"); mkdir -p "$D/flux"
until [ -x /home/user/sdcpp/build/bin/sd-cli ] && [ -s /home/user/modelos/flux/flux1-schnell-Q4_0.gguf ] && [ -s /home/user/modelos/flux/t5xxl-Q3_K.gguf ]; do sleep 30; done
while IFS='|' read -r n p; do
  [ -n "$n" ] || continue; [ -s "$D/$n.webp" ] && continue
  [ -s "$D/flux/$n.png" ] || sh "$H/escenario.sh" "$D/flux/$n.png" "$p" "${2:-11}" > /dev/null 2>&1
  /home/user/qw/bin/python -I "$H/pergamino.py" "$D/flux/$n.png" "$D/$n.webp"
done < "$1"
echo "LOTE HECHO"
