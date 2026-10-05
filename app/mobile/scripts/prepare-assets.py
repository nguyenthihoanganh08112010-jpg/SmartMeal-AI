from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1]
source=Path('E:/AI APP/Hồ sơ AI/Chibi (1).png')
im=Image.open(source)
# Crop the supplied character portraits, not generated replacements.
boxes={'hin':(28,863,247,1032),'didi':(278,863,482,1032),'lin':(516,863,723,1032),'anh':(757,863,970,1032),'rice':(996,862,1190,1040)}
out=root/'assets/personas';out.mkdir(parents=True,exist_ok=True)
for name,box in boxes.items(): im.crop(box).save(out/(name+'.png'))
(out/'provenance.json').write_text(json.dumps({'source':source.name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'crops':boxes,'note':'User supplied portraits; regular rice from Chibi (1), no pixel rice.'},ensure_ascii=False,indent=2),encoding='utf-8')
nav=Image.open(root.parents[1]/'docs/ux-ui/visual-map/revision-2026-10-02/assets/nav-source.png').convert('RGBA')
for index,box in enumerate([(27,16,75,58),(116,16,163,58),(199,16,262,58),(299,12,345,60),(385,0,453,73)]):
    icon=nav.crop(box)
    if index<4:
        pixels=icon.load()
        for y in range(icon.height):
            for x in range(icon.width):
                r,g,b,a=pixels[x,y]
                if r>140 and g>160 and b<140: pixels[x,y]=(r,g,b,0)
    icon.save(root/'assets'/('nav-'+str(index)+'.png'))
