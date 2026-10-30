# El ejemplo perfecto (lo que hay que copiar)

**Vídeo de referencia:** `~/Downloads/Video-37505.mp4`. Es un reel de 87 s que explica por qué la pantalla del móvil nota el dedo y no un boli.
El usuario lo da como **modelo perfecto** de estos vídeos (29-10-2026). Antes de hacer uno nuevo, compararlo con este.

## Medidas del ejemplo
- Formato: 720×1280 a 30 fps y 87 s, con el volumen medio a −17 dB (pico a 0 dB).
- **La voz arranca en el segundo 0** y es **una narración seguida**. Las pausas suelen durar ≈ 0,2 s y las largas llegan a 0,85 s, solo en los cambios de idea.
  Nada de huecos iguales entre frases.
- **Solo 2 cortes en 87 s.** Todo lo demás son movimientos de cámara y transformaciones del mismo objeto:
  - el dedo se convierte en un corte del cristal, luego en un móvil y luego en el guante;
  - la cámara entra en la rejilla y sale de ella.

## Reglas que salen de él
1. **Cada palabra tiene su imagen en el instante exacto en que se dice.** Si dice «guantes», aparecen los guantes; si dice «gota», cae la gota.
2. **Los subtítulos van palabra a palabra, arriba y en el centro:**
   - las palabras ya dichas en gris;
   - la que suena en blanco y negrita;
   - la palabra clave dentro de un recuadro de selección azul con tiradores, y a veces un emoji.
3. **Un solo mundo visual de principio a fin:** fondo azul noche con motas, formas limpias y luz dorada, y etiquetas en mayúsculas con línea guía.
4. **Los datos se ven en pantalla:** números que cambian en directo y la fuente en pequeño (por ejemplo, «Texas Instruments»).
5. **Estructura:** una pregunta en el gancho, la explicación paso a paso y un remate que da la vuelta al principio.
   Cierra con «envíaselo a…» y un gesto de compartir.
6. **Cosas nuevas cada 1–2 s, pero sin saltos:** la cámara viaja entre las ideas en vez de cortar.

## Cómo se aplica en `fabrica/explicado/`
- La voz se graba por escena, de una tirada (`voz.py`, con la voz de Tony). Nunca frase suelta ni una voz distinta a mitad del vídeo.
- Las transiciones entre mundos deben ser viajes de cámara (paneo o zoom de un sitio a otro), no cortes con destello.
- El vídeo final se normaliza a ≈ −16 LUFS para que suene tan alto como el ejemplo.
- **La voz siempre encima:** en el ejemplo, entre frase y frase hay silencio casi total. `grabar.mjs` baja solo efectos y música cuando habla Tony (sidechain). Efectos a ×0,5 y música a 0,09: el fondo queda ≈ 9 dB por debajo de la voz.
- **Antes de mandar, comprobar:** espectrograma comparado con el del ejemplo (`showspectrumpic`), y transcripción de cada bloque y del vídeo final con la del guion (que no falte ni se corte ninguna palabra).
