const fs=require('fs'),path=require('path');
const deps=process.env.SM_PSD_DEPS||path.resolve(__dirname,'../../../../../tmp/photoshop-export/node_modules');
const {loadImage}=require(path.join(deps,'@napi-rs/canvas'));
(async()=>{
  const src=path.join(__dirname,'reference-09-full.png');
  const img=await loadImage(src);
  console.log('size',img.width,img.height);
  // crop into 3 horizontal bands to fit under 4000px each
  const bands=[0,1,2].map(i=>{
    const x=i*1400, w=Math.min(1400,img.width-x);
    const c=require(path.join(deps,'@napi-rs/canvas')).createCanvas(w,img.height);
    const ctx=c.getContext('2d');
    ctx.drawImage(img,x,0,w,img.height,0,0,w,img.height);
    fs.writeFileSync(path.join(__dirname,'crop-09-'+i+'.png'),c.toBuffer('image/png'));
    console.log('wrote band',i,w);
  });
})();
