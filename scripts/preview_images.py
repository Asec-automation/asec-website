"""Make lightweight copies of site images for the single-file preview (.preview-cache/).
The real site still uses the full-quality files in public/images."""
import os, sys
from PIL import Image
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src, dst = os.path.join(root, 'public'), os.path.join(root, '.preview-cache')
n = 0
for d, _, files in os.walk(os.path.join(src, 'images')):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext not in ('.webp', '.jpg', '.jpeg', '.png'): continue
        a = os.path.join(d, f); b = os.path.join(dst, os.path.relpath(a, src))
        if os.path.exists(b) and os.path.getmtime(b) >= os.path.getmtime(a): continue
        os.makedirs(os.path.dirname(b), exist_ok=True)
        im = Image.open(a)
        if ext == '.png':
            im = im.convert('RGBA'); w, h = im.size
            if w > 600: im = im.resize((600, round(h * 600 / w)), Image.LANCZOS)
            im.save(b, 'PNG', optimize=True)
            if os.path.getsize(b) > os.path.getsize(a): import shutil; shutil.copy(a, b)
        else:
            im = im.convert('RGB'); w, h = im.size
            if w > 900: im = im.resize((900, round(h * 900 / w)), Image.LANCZOS)
            im.save(b, 'WEBP' if ext == '.webp' else 'JPEG', quality=52, **({'method': 6} if ext == '.webp' else {'optimize': True}))
        n += 1
print(f'preview images: {n} updated')
