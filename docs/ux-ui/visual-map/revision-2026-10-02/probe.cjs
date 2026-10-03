const path=require('path');
const deps=process.env.SM_PSD_DEPS||path.resolve(__dirname,'../../../../../tmp/photoshop-export/node_modules');
const {loadImage,createCanvas}=require(path.join(deps,'@napi-rs/canvas'));
(async()=>{
  for(const f of ['E:/AI APP/Hồ sơ AI/Chibi (1).png','E:/AI APP/Hồ sơ AI/Chibi (2).png','E:/AI APP/Hồ sơ AI/Bản anime.png','E:/AI APP/Linh vật/icon.png','E:/AI APP/Linh vật/Hạt cơm pixel .png']){
    try{const im=await loadImage(f);console.log(f,'=>',im.width,im.height);}catch(e){console.log(f,'ERR',e.message);}
  }
})();
