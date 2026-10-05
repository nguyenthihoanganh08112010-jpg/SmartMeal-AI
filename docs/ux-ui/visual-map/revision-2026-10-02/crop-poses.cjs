const fs=require('fs'),path=require('path');
const deps=process.env.SM_PSD_DEPS||path.resolve(__dirname,'../../../../../tmp/photoshop-export/node_modules');
const {loadImage,createCanvas}=require(path.join(deps,'@napi-rs/canvas'));
const out=path.join(__dirname,'assets');
(async()=>{
  const img=await loadImage('E:/AI APP/Hồ sơ AI/Chibi (1).png');
  function crop(name,x,y,w,h){
    const c=createCanvas(w,h);const ctx=c.getContext('2d');
    ctx.drawImage(img,x,y,w,h,0,0,w,h);
    fs.writeFileSync(path.join(out,name),c.toBuffer('image/png'));
    console.log('wrote',name,w,h);
  }
  crop('hin-thumbs.png',105,158,295,455);
  crop('hin-food.png',368,388,150,130);
  crop('hin-wave.png',760,388,150,130);
  crop('hin-laptop.png',558,388,150,130);
  crop('rice-mascot.png',1025,862,150,150);
})();
