#!/bin/zsh
# Hace solo, sin vigilancia: el ep. 3 entero con la voz de Danny y Leónidas, y regraba los actos de títeres 1, 2 y 7.
# Deja los vídeos en el Escritorio. Registro: fabrica/videos/espanistan-03-danny/noche.log
set -e
R=/Users/nicholasreich/Documents/Climate-things; V=$R/fabrica/videos/espanistan-03-danny
cd $R
while pgrep -f "generar.py escenas.json" >/dev/null || pgrep -f "grabar.mjs" >/dev/null; do sleep 20; done
echo "1/4 voces de Acascar nuevas · $(date)"
cd $V && python3 hacer_escenas.py && rm -f assets/voz{04,07,10,14,17}.mp3 tiempos/{04,07,10,14,17}.json
~/qw/bin/python -I ../../generar.py escenas.json
echo "2/4 render del capítulo · $(date)"
python3 ../../manual/herramientas/render_partes.py . out/espanistan-03.mp4
mkdir -p ~/Desktop/Espanistan-03 && cp out/espanistan-03.mp4 ~/Desktop/Espanistan-03/Espanistan-03-capitulo-entero.mp4
echo "3/4 actos de títeres · $(date)"
cd $R
for e in fuego condesa balanza; do node fabrica/titeres/grabar.mjs $e out/$e.mp4; done
n=1; for e in fuego condesa nace-vox desierto subida mano-daga balanza; do [ -f out/$e.mp4 ] && cp out/$e.mp4 ~/Desktop/Espanistan-03/acto-$n-$e.mp4; n=$((n+1)); done
echo "4/4 hecho · $(date)"
