from PIL import Image
from pathlib import Path
import hashlib,json
base=Path('docs/ux-ui/visual-map'); o=base/'revision-2026-10-02'; a=o/'assets';a.mkdir(exist_ok=True)
p=base/'SmartMeal-UX-UI-Flow-Map.psd';im=Image.open(p); im.load()
# Exact source crops: no generated replacement artwork.
crops={'nav-source':(116,6810,574,6884),'ai-header':(100,14772,588,14882),'ai-avatar':(183,14786,259,14861),'food-chicken':(175,6180,338,6310),'food-veg':(405,6405,558,6520),'food-bowl':(170,6630,337,6770),'food-berry':(425,6635,560,6770)}
for n,b in crops.items():im.crop(b).save(a/(n+'.png'))
trash=Image.open('app/wireframe/assets/diary-swipe.jpg').convert('RGB');trash=trash.resize((384,683));trash.crop((319,267,352,310)).save(a/'trash-original.png')
(o/'source-fingerprint.json').write_text(json.dumps({'path':str(p),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'assetCrops':crops},indent=2),encoding='utf-8')
