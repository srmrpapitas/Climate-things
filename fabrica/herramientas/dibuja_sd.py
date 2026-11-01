# Dibujos clave de anime en local, gratis y sin límite: Stable Diffusion 1.5 (Counterfeit-V2.5) en la CPU, opcionalmente
# guiado por las líneas de otro dibujo (ControlNet lineart_anime) o partiendo de una imagen (img2img).
# Uso: ~/sd/bin/python -I fabrica/herramientas/dibuja_sd.py "prompt" salida.png [--ini img --fuerza .6] [--lineas img --peso 1]
#      [--ancho 512 --alto 768 --pasos 25 --semilla 1 --n 1]
# El modelo vive en ~/.cache/huggingface (se bajó con snapshot_download); venv en ~/sd (torch 2.2.2, el último para Intel Mac).
import argparse, time, torch
from PIL import Image
from diffusers import (StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, StableDiffusionControlNetPipeline,
                       StableDiffusionControlNetImg2ImgPipeline, ControlNetModel, DPMSolverMultistepScheduler)

MODELO, LINEAS = 'gsdf/Counterfeit-V2.5', 'lllyasviel/control_v11p_sd15s2_lineart_anime'
NEG = ('lowres, bad anatomy, bad hands, extra fingers, missing fingers, blurry, jpeg artifacts, text, watermark, signature, '
       'worst quality, low quality, 3d, realistic photo, deformed, extra limbs')
a = argparse.ArgumentParser()
a.add_argument('prompt'); a.add_argument('salida'); a.add_argument('--neg', default=NEG)
a.add_argument('--ini'); a.add_argument('--fuerza', type=float, default=.6)
a.add_argument('--lineas'); a.add_argument('--peso', type=float, default=1.0)
a.add_argument('--ancho', type=int, default=512); a.add_argument('--alto', type=int, default=768)
a.add_argument('--pasos', type=int, default=25); a.add_argument('--semilla', type=int, default=1); a.add_argument('--n', type=int, default=1)
o = a.parse_args()
torch.set_num_threads(6)
cn = ControlNetModel.from_pretrained(LINEAS, variant='fp16', torch_dtype=torch.float32) if o.lineas else None
Clase = {(0, 0): StableDiffusionPipeline, (1, 0): StableDiffusionImg2ImgPipeline,
         (0, 1): StableDiffusionControlNetPipeline, (1, 1): StableDiffusionControlNetImg2ImgPipeline}[(bool(o.ini), bool(cn))]
pipe = Clase.from_pretrained(MODELO, torch_dtype=torch.float32, safety_checker=None, requires_safety_checker=False, **({'controlnet': cn} if cn else {}))
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True)
pipe.enable_attention_slicing()
abre = lambda p: Image.open(p).convert('RGB').resize((o.ancho, o.alto), Image.LANCZOS)
kw = dict(prompt=o.prompt, negative_prompt=o.neg, num_inference_steps=o.pasos, guidance_scale=7)
if o.ini: kw.update(image=abre(o.ini), strength=o.fuerza)
else: kw.update(width=o.ancho, height=o.alto)
if cn:
    from PIL import ImageOps                                            # lineart_anime quiere líneas blancas sobre negro
    lin = ImageOps.invert(abre(o.lineas).convert('L')).convert('RGB')
    kw.update(**({'control_image': lin} if o.ini else {'image': lin}), controlnet_conditioning_scale=o.peso)
for i in range(o.n):
    t = time.time(); img = pipe(**kw, generator=torch.Generator().manual_seed(o.semilla + i)).images[0]
    sal = o.salida if o.n == 1 else o.salida.replace('.png', f'-{i}.png'); img.save(sal); print(sal, f'{time.time() - t:.0f} s', flush=True)
