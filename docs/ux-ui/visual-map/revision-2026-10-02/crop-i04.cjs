const path=require('path');const deps=process.env.SM_PSD_DEPS||path.resolve(__dirname,'../../../../../tmp/photoshop-export/node_modules');
const {loadImage,createCanvas}=require(path.join(deps,'@napi-rs/canvas'));
(async()=>{
  const im=await loadImage(path.join(__dirname,'v2-I04.png'));
  console.log('I04',im.width,im.height);
  const bands=3;const bh=Math.ceil(im.height/bands);
  for(let i=0;i<bands;i++){const c=createCanvas(im.width,bh);const x=c.getContext('2d');x.drawImage(im,0,i*bh,im.width,bh,0,0,im.width,bh);
    require('fs').writeFileSync(path.join(__dirname,'v2-I04-band'+i+'.png'),c.toBuffer('image/png'));}
})();
