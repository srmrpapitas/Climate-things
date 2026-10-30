#!/bin/sh
# Borrador del ep. 7 a 30 fps (FPS=30), 4 escenas a la vez, y montaje.
cd /Users/nicholasreich/Documents/Climate-things
[ -d out/rafaga60 ] || node fabrica/titeres/rafaga.mjs out/rafaga60 60 || exit 1
ESC="07-elite 07-hoy 07-pensar 07-solucion 07-prusia 07-memoria 07-falacias 07-final 07-gancho 07-matiz 07-estonia intro-07"
echo $ESC | tr ' ' '\n' | xargs -P 4 -I{} sh -c 'FPS=30 node fabrica/titeres/grabar.mjs {} out/{}.mp4 > out/log-{}.txt 2>&1 && echo "ok {}" || (echo "FALLO {}"; tail -5 out/log-{}.txt)'
python3 fabrica/titeres/montar.py out/espanistan-07-borrador.mp4 07
