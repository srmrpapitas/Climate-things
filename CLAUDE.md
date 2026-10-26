# Fábrica de videos

**Antes de nada, leer `fabrica/manual/COMO-HACER-UN-VIDEO.md` (el proceso), `fabrica/manual/PLAN-15.md` (cómo ahorrar), `fabrica/manual/RETOMAR.md` (trabajo en curso) y `fabrica/manual/README.md`**: voz, música, efectos, render y herramientas.

## Reglas de trabajo (ahorro de tokens)
- Producir un video = escribir/editar SOLO `videos/<slug>.yaml`. No abrir ni reescribir plantillas salvo que se pida.
- Formato y tipos de escena: `esqueletos/README.md`. Reglas obligatorias: `reglas/retencion.md` (validar R8 antes de renderizar).
- No leer `assets/`, `out/`, `node_modules/` ni videos/imágenes. No hacer capturas para revisar: el usuario revisa el render y pide cambios por número de escena.
- Ediciones mínimas (Edit sobre líneas), nunca reescribir archivos completos.
- Respuestas cortas: qué cambió y el comando de render. Sin resúmenes largos.

## Flujo
1. Tema + plataforma → guion en el YAML (aplica R1–R7).
2. Checklist R8.
3. Render local (comando por definir según el motor elegido).
4. Ajustes por escena → re-render.
