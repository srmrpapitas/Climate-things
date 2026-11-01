#!/bin/sh
# Hoja de contacto: todas las fotos .jpg de una carpeta (en orden) en una sola imagen, para revisar planos de un vistazo.
# Uso: sh fabrica/herramientas/hoja.sh out/prueba.mp4.fotos out/hoja.jpg [columnas=6] [desde=1] [cuantas=24]
# (ffmpeg con xstack; sin drawtext, que se cuelga con fontconfig; < /dev/null para que no espere teclado)
dir=$1; sal=$2; cols=${3:-6}; desde=${4:-1}; n=${5:-24}
set -- $(ls "$dir"/*.jpg | sort -t- -k2 -g | tail -n +"$desde" | head -n "$n")
[ $# -eq 0 ] && { echo "sin fotos en $dir"; exit 1; }
ent=""; fil=""; lay=""; i=0
for f in "$@"; do
  ent="$ent -i $f"; fil="$fil[$i]scale=270:480[v$i];"
  x=$(( (i % cols) * 270 )); y=$(( (i / cols) * 480 )); lay="$lay${lay:+|}${x}_${y}"; i=$((i + 1))
done
pads=""; j=0; while [ $j -lt $i ]; do pads="$pads[v$j]"; j=$((j + 1)); done
ffmpeg -v error -y $ent -filter_complex "${fil}${pads}xstack=inputs=$i:layout=$lay:fill=black" -frames:v 1 -update 1 -q:v 3 "$sal" < /dev/null && echo "$sal ($i fotos)"
