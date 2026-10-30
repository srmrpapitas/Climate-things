#!/bin/sh
# Miniatura del capítulo: fondo de títeres (escenas/miniatura*.js, fotograma 1,5) + letras grandes, dato del momento y el episodio en una esquina.
# Uso (desde la raíz, con `python3 -m http.server 8765` en marcha): sh fabrica/titeres/miniatura.sh [1-6]   → out/miniatura-ep0N.jpg (1280×720)
set -e
EP=${1:-3}
case $EP in
  1) ESC=miniatura-ep01; GRANDE='SANCHÍS'; TAM=330; L1='¿APRUEBA O'; L2='SUSPENDE?'; DATO='SUS CUENTAS · 29-N' ;;
  2) ESC=miniatura-ep02; GRANDE='EL PP'; TAM=400; L1='PROMESAS'; L2='VS DATOS'; DATO='FEIJOLO · 29-N' ;;
  6) ESC=miniatura-ep06; GRANDE='72.000'; TAM=400; L1='EN DOS'; L2='DÍAS'; DATO='CEUTA TIENE 83.000' ;;
  5) ESC=miniatura-ep05; GRANDE='31 AÑOS'; TAM=300; L1='¿Y AÚN EN'; L2='LITERA?'; DATO='FALTAN 750.000 CASAS' ;;
  7) ESC=miniatura-ep07; GRANDE='OBEDECE'; TAM=400; L1='NO TE ENSEÑAN'; L2='A PENSAR'; DATO='DESDE PRUSIA, 1763' ;;
  4) ESC=miniatura-ep04; GRANDE='PP + PSOE'; TAM=250; L1='¿DOS FAMILIAS'; L2='O UNA MESA?'; DATO='DE FRANCO A HOY' ;;
  *) ESC=miniatura; GRANDE='VOX'; TAM=400; L1='¿Y AHORA'; L2='QUÉ?'; DATO='ROZA EL 20 % · 29-N' ;;
esac
node fabrica/titeres/fotos.mjs $ESC 1.5 > /dev/null
F=/System/Library/Fonts/Supplemental/Impact.ttf
ffmpeg -v error -y -i out/fotos_$ESC/1.5.png -vf "\
drawbox=x=1590:y=40:w=290:h=120:color=0xFFD400:t=fill,\
drawtext=fontfile=$F:text='EP. $EP':fontsize=100:fontcolor=black:x=1590+(290-tw)/2:y=40+(120-th)/2,\
drawtext=fontfile=$F:text='$GRANDE':fontsize=$TAM:fontcolor=0xFFD400:borderw=16:bordercolor=black:shadowx=14:shadowy=14:shadowcolor=black@0.6:x=55:y=40,\
drawtext=fontfile=$F:text='$L1':fontsize=175:fontcolor=white:borderw=12:bordercolor=black:x=60:y=470,\
drawtext=fontfile=$F:text='$L2':fontsize=175:fontcolor=white:borderw=12:bordercolor=black:x=60:y=655,\
drawbox=x=50:y=880:w=980:h=140:color=0xFFD400:t=fill,\
drawtext=fontfile=$F:expansion=none:text='$DATO':fontsize=110:fontcolor=0xB11D18:x=50+(980-tw)/2:y=880+(140-th)/2,\
scale=1280:720" -q:v 2 out/miniatura-ep0$EP.jpg
echo hecho out/miniatura-ep0$EP.jpg
