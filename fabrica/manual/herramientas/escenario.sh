#!/bin/sh
# Escenario gratis: genera un dibujo del teatro de sombras en local con FLUX.1 schnell (Apache-2.0) y stable-diffusion.cpp. Sin ElevenLabs.
# Uso: sh fabrica/manual/herramientas/escenario.sh SALIDA.png "qué sale en la escena" [semilla]
#   Tarda ≈ 15 min por imagen con la máquina libre (≈ 30 si hay un render a la vez). Lanzarlo en segundo plano.
#   Instalar el motor la primera vez: sh fabrica/instalar_todo.sh --flux
set -e
M=/home/user/modelos/flux; SD=/home/user/sdcpp/build/bin/sd-cli
ESTILO="Lotte Reiniger style silhouette animation still, shadow puppet theater. Flat pure black paper cut-out puppets, articulated, with visible round pin joints at shoulders, elbows and knees and very thin control rods, intricate lace-like cut-out details and curling ornamental edges, elongated spidery limbs. All figures shown full body, standing on a straight dark stage floor line at the bottom, clearly separated from each other with empty space between them. Backdrop: aged stained parchment paper glowing warm amber from an oil lamp behind it, soft dark vignette, faint grey paper cut-out layers in the background."
$SD --diffusion-model $M/flux1-schnell-Q4_0.gguf --vae $M/ae-f16.gguf --clip_l $M/clip_l-Q8_0.gguf --t5xxl $M/t5xxl-Q3_K.gguf \
  --cfg-scale 1.0 --sampling-method euler --steps 4 -W 1024 -H 576 -s "${3:-7}" --mmap -o "$1" \
  -p "$ESTILO $2 Sepia and amber, cinematic, no text."
