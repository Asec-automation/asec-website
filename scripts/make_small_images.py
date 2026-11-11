"""Create 800px-wide copies (name-800.webp) of large photos for phones.
Originals are untouched; the site serves the small copy to small screens via srcset.
Run after adding new images:  python3 scripts/make_small_images.py"""
import glob, json, os
from PIL import Image
W = 800
out = {}
for f in sorted(glob.glob('public/images/**/*.webp', recursive=True)):
    if f.endswith('-800.webp'): continue
    im = Image.open(f)
    if im.width <= 1000: continue
    small = f[:-5] + '-800.webp'
    if not os.path.exists(small) or os.path.getmtime(small) < os.path.getmtime(f):
        h = round(im.height * W / im.width)
        im.convert('RGB').resize((W, h), Image.LANCZOS).save(small, 'WEBP', quality=82, method=6)
    out['/' + f[len('public/'):]] = {'small': '/' + small[len('public/'):], 'w': im.width}
json.dump(out, open('src/config/small-images.json', 'w'), indent=1)
print(len(out), 'small copies')
