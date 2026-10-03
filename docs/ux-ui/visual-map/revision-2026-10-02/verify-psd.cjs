const path=require('path');const deps=process.env.SM_PSD_DEPS||path.resolve(__dirname,'../../../../../tmp/photoshop-export/node_modules');
const {createCanvas,ImageData}=require(path.join(deps,'@napi-rs/canvas'));
const {readPsd,initializeCanvas}=require(path.join(deps,'ag-psd'));
initializeCanvas(createCanvas,(w,h)=>new ImageData(w,h));
const fs=require('fs');
(async()=>{
  const buf=fs.readFileSync(path.join(__dirname,'Sua-tu-dong.psd'));
  const psd=readPsd(buf,{resources:false,skipImageData:true});
  console.log('canvas',psd.width,psd.height,'top children',psd.children.length);
  function walk(n,depth){const pad='  '.repeat(depth);const kids=(n.children||[]).length;
    console.log(pad+'· '+n.name+(kids?' ('+kids+' children)':'')+(n.text?' [TEXT]':''));
    if(depth<2)(n.children||[]).forEach(c=>walk(c,depth+1));}
  psd.children.forEach(c=>walk(c,0));
})();
