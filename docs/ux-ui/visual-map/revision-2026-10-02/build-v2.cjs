/* SmartMeal AI — "Sửa tự động" redesigned screens.
   Original PSD (SmartMeal-UX-UI-Flow-Map.psd) is never read/written here.
   Outputs a standalone layered PSD + PNG previews. Copy-then-modify only. */
const fs=require('fs'),path=require('path');
const deps=process.env.SM_PSD_DEPS||path.resolve(__dirname,'../../../../../tmp/photoshop-export/node_modules');
const {createCanvas,loadImage,ImageData}=require(path.join(deps,'@napi-rs/canvas'));
const {initializeCanvas,writePsdBuffer}=require(path.join(deps,'ag-psd'));
initializeCanvas(createCanvas,(w,h)=>new ImageData(w,h));

const O=__dirname;
const C={lime:'#BBE11A',yellow:'#E8F957',sky:'#C1E5FB',blue:'#4891E7',navy:'#042C8F',
  ink:'#39452D',paper:'#FFFCF0',white:'#FFFFFF',pale:'#F7FBD9',line:'#E4EBDF',pink:'#F6B8BD',
  muted:'#7B846F',cream:'#FFF7E0',greenSoft:'#E3F2DB',orangeSoft:'#FAF0DA',brownSoft:'#F1EBE7',
  redSoft:'#F6B8BD',shadow:'rgba(60,80,40,.12)'};
const SW=520;
const assets={};const screens=[];const textChecks=[];
function rgb(h){return {r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
function blank(w,h){return createCanvas(Math.ceil(w),Math.ceil(h));}
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}

class Screen{
  constructor(id,title,h,theme='lime'){
    this.id=id;this.title=title;this.h=h;this.theme=theme;this.layers=[];screens.push(this);
    this.canvas=blank(SW,h);this.c=this.canvas.getContext('2d');
    // base background
    if(theme==='ai'){
      const g=this.c.createLinearGradient(0,0,SW*.7,h);
      g.addColorStop(0,C.sky);g.addColorStop(.45,'#DCEFC0');g.addColorStop(1,C.yellow);
      this.c.fillStyle=g;rrect(this.c,0,0,SW,h,34);this.c.fill();
    }else{
      this.c.fillStyle=C.white;rrect(this.c,0,0,SW,h,34);this.c.fill();
    }
  }
  // draw an offscreen layer onto the screen at x,y and record it
  layer(name,x,y,w,h,fn,extra={}){
    const c=blank(w,h);const ctx=c.getContext('2d');fn(ctx,w,h);
    this.c.drawImage(c,x,y);
    this.layers.push({name,left:x,top:y,canvas:c,...extra});
    return c;
  }
  card(name,x,y,w,h,{fill=C.white,r=22,stroke=null,shadow=true}={}){
    this.layer(name,x,y,w,h,ctx=>{
      if(shadow){ctx.shadowColor=C.shadow;ctx.shadowBlur=14;ctx.shadowOffsetY=4;}
      ctx.fillStyle=fill;rrect(ctx,1,1,w-2,h-2,r);ctx.fill();
      ctx.shadowColor='transparent';
      if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;rrect(ctx,1,1,w-2,h-2,r);ctx.stroke();}
    });
  }
  text(name,t,x,y,w,size=19,col=C.ink,bold=false){
    if(t==='✓'){this.layer(name,x,y,26,26,ctx=>{ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(3,13);ctx.lineTo(9,19);ctx.lineTo(23,5);ctx.stroke();});return 26;}
    if(t==='‹'||t==='›'||t==='→'||t==='↑'||t==='⌃'||t==='+'){
      this.layer(name,x,y,30,30,ctx=>{ctx.fillStyle=col;ctx.font=`bold ${size+8}px Arial`;ctx.textBaseline='top';ctx.textAlign='center';ctx.fillText(t,15,2);});return 30;}
    const m=blank(1,1).getContext('2d');m.font=`${bold?'bold ':''}${size}px Arial`;
    const paras=String(t).split('\n');let lines=[];
    for(const para of paras){let l='';for(const word of para.split(' ')){if(m.measureText(l+(l?' ':'')+word).width>w-2&&l){lines.push(l);l=word;}else l+=(l?' ':'')+word;}lines.push(l);}
    const th=Math.ceil(lines.length*size*1.34+8);
    if(y+th>this.h+2)throw new Error(this.id+' OVERFLOW '+name+' '+(y+th)+'/'+this.h);
    this.layer(name,x,y,w,th,ctx=>{ctx.font=m.font;ctx.textBaseline='top';ctx.fillStyle=col;lines.forEach((v,i)=>ctx.fillText(v,0,4+i*size*1.34));},
      {text:{text:lines.join('\r'),transform:[1,0,0,1,x,y+size],antiAlias:'smooth',shapeType:'point',
        style:{font:{name:bold?'Arial-BoldMT':'ArialMT'},fontSize:size,fillColor:rgb(col),leading:size*1.34,autoLeading:false},
        paragraphStyle:{justification:'left'}}});
    textChecks.push({screen:this.id,name,text:t});
    return th;
  }
  img(key,name,x,y,w,h,r=18){
    const a=assets[key];if(!a){this.placeholder(name,x,y,w,h);return;}
    this.layer(name,x,y,w,h,ctx=>{
      ctx.save();rrect(ctx,0,0,w,h,r);ctx.clip();ctx.drawImage(a,0,0,a.width,a.height,0,0,w,h);ctx.restore();
    });
  }
  placeholder(name,x,y,w,h,label='Chờ ảnh'){
    this.layer(name,x,y,w,h,ctx=>{
      ctx.fillStyle=C.paper;rrect(ctx,0,0,w,h,14);ctx.fill();
      ctx.setLineDash([6,5]);ctx.strokeStyle=C.line;ctx.lineWidth=1.5;rrect(ctx,1,1,w-2,h-2,14);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle=C.muted;ctx.font='14px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('['+label+']',w/2,h/2);
    });
  }
  pill(label,x,y,w=160,active=false,fill){
    this.layer('Pill · '+label,x,y,w,40,ctx=>{
      ctx.fillStyle=fill||(active?C.lime:C.pale);rrect(ctx,0,0,w,40,20);ctx.fill();});
    this.text('Chữ pill · '+label,label,x+14,y+9,w-20,16,C.ink,active);
  }
  button(label,x,y,w=220,fill=C.lime){
    this.layer('Nút · '+label,x,y,w,52,ctx=>{
      ctx.shadowColor=C.shadow;ctx.shadowBlur=10;ctx.shadowOffsetY=3;
      ctx.fillStyle=fill;rrect(ctx,0,0,w,52,26);ctx.fill();ctx.shadowColor='transparent';});
    this.text('Chữ nút · '+label,label,x,y+13,w,19,C.ink,true);
  }
}

/* ---------- shared chrome ---------- */
function navAssets(){
  const image=assets['nav-source'];const clips=[[25,11,74,60],[117,11,164,61],[209,12,254,61],[301,9,347,63],[392,0,458,74]];
  clips.forEach((b,i)=>{const w=b[2]-b[0],h=b[3]-b[1];const c=blank(w,h);const x=c.getContext('2d');
    x.drawImage(image,b[0],b[1],w,h,0,0,w,h);
    if(i<4){const d=x.getImageData(0,0,w,h);for(let k=0;k<d.data.length;k+=4){const r=d.data[k],g=d.data[k+1],bl=d.data[k+2];if(r>170&&g>205&&bl<115)d.data[k+3]=0;}x.putImageData(d,0,0);}
    assets['icon-'+i]=c;});
}
function nonAIHeader(s,title,subtitle){
  s.layer('Dải đầu lime',0,0,SW,118,ctx=>{ctx.fillStyle=C.lime;rrect(ctx,0,0,SW,118,34);ctx.fill();
    ctx.fillRect(0,70,SW,48);});
  s.text('Quay lại','‹',22,34,40,30,C.navy,true);
  s.text('Tiêu đề màn',title,72,36,380,25,C.ink,true);
  if(subtitle)s.text('Phụ đề',subtitle,74,70,380,14,C.muted,false);
  // content white panel starts at y=100
}
function bottomNav(s,active='Nhật ký'){
  const y=s.h-96;
  if(active==='Nhật ký'){['Bữa sáng','Bữa trưa','Bữa tối','Ăn nhẹ'].forEach((t,i)=>s.pill(t,22+i*120,y-78,112,false,C.pale));}
  s.layer('Thanh nav 4 tab',16,y,488,72,ctx=>{ctx.shadowColor=C.shadow;ctx.shadowBlur=12;ctx.shadowOffsetY=3;
    ctx.fillStyle=C.yellow;rrect(ctx,0,0,488,72,36);ctx.fill();ctx.shadowColor='transparent';});
  const names=['Hồ sơ','Nhật ký','Sổ tay','Ghi lại'];
  for(let i=0;i<4;i++){const x=26+i*104;
    if(names[i]===active){s.layer('Tab chọn · '+active,x,y+6,92,60,ctx=>{ctx.fillStyle=C.lime;rrect(ctx,0,0,92,60,30);ctx.fill();});}
    if(assets['icon-'+i])s.layer('Icon nav '+i,x+24,y+15,44,42,ctx=>ctx.drawImage(assets['icon-'+i],0,0,44,42));
  }
  if(assets['icon-4'])s.layer('Icon mascot AI',430,y-6,64,66,ctx=>{ctx.save();rrect(ctx,0,0,64,66,20);ctx.clip();ctx.drawImage(assets['icon-4'],0,0,64,66);ctx.restore();});
}
function aiHeader(s,title){
  s.layer('Dải đầu sky',0,0,SW,104,ctx=>{ctx.fillStyle=C.sky;rrect(ctx,0,0,SW,104,34);ctx.fill();ctx.fillRect(0,60,SW,44);});
  s.layer('Nút quay lại tròn',20,30,44,44,ctx=>{ctx.fillStyle=C.yellow;rrect(ctx,0,0,44,44,22);ctx.fill();});
  s.text('Back','‹',28,38,30,24,C.navy,true);
  // avatar
  if(assets['ai-avatar'])s.layer('Avatar HIN',74,20,64,64,ctx=>{ctx.save();rrect(ctx,0,0,64,64,32);ctx.clip();ctx.drawImage(assets['ai-avatar'],0,0,64,64);ctx.restore();});
  s.text('Tên AI','HIN',150,28,220,24,C.ink,true);
  s.text('Phong cách','Phong cách cún con',151,60,220,14,C.muted,false);
  s.layer('Nút cài đặt tròn',452,28,46,46,ctx=>{ctx.fillStyle='#EAF4FD';rrect(ctx,0,0,46,46,23);ctx.fill();ctx.strokeStyle=C.blue;ctx.lineWidth=1.5;rrect(ctx,1,1,44,44,22);ctx.stroke();
    // gear
    ctx.strokeStyle=C.blue;ctx.lineWidth=2;ctx.beginPath();ctx.arc(23,23,7,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.arc(23,23,2.5,0,Math.PI*2);ctx.stroke();
    for(let a=0;a<6;a++){const an=a*Math.PI/3;ctx.beginPath();ctx.moveTo(23+Math.cos(an)*9,23+Math.sin(an)*9);ctx.lineTo(23+Math.cos(an)*12,23+Math.sin(an)*12);ctx.stroke();}});
}
function aiInputBar(s){
  const y=s.h-86;
  s.layer('Thanh nhập AI',16,y,488,66,ctx=>{ctx.shadowColor=C.shadow;ctx.shadowBlur=12;ctx.shadowOffsetY=3;
    ctx.fillStyle='#F1FABD';rrect(ctx,0,0,488,66,33);ctx.fill();ctx.shadowColor='transparent';ctx.strokeStyle=C.white;ctx.lineWidth=2;rrect(ctx,1,1,486,64,32);ctx.stroke();});
  s.layer('Toggle nhật ký',30,y+18,30,30,ctx=>{ctx.strokeStyle=C.blue;ctx.lineWidth=2.5;rrect(ctx,4,4,22,22,11);ctx.stroke();});
  s.text('Placeholder nhập','Nhắn với AI',78,y+24,300,18,C.muted,false);
  s.layer('Icon micro',404,y+16,36,36,ctx=>{ctx.strokeStyle='#7C943B';ctx.lineWidth=2.5;rrect(ctx,13,3,10,22,5);ctx.stroke();ctx.beginPath();ctx.arc(18,26,11,Math.PI,0);ctx.stroke();});
  s.layer('Nút gửi',448,y+14,40,40,ctx=>{ctx.fillStyle=C.sky;rrect(ctx,0,0,40,40,20);ctx.fill();});
  s.text('Gửi','↑',458,20,24,24,C.blue,true);
}
function welcomeCard(s,y,loggedIn){
  s.card('Thẻ chào',22,y,476,470,{r:28});
  s.text('Xin chào!','Xin chào!',44,y+22,400,28,C.ink,true);
  s.text('Giới thiệu','Tôi có thể giúp bạn tìm món và combo theo nguyên liệu, thời gian và mục tiêu của bạn.',44,y+66,432,19);
  s.text('Câu hỏi bắt đầu','Bạn muốn bắt đầu từ đâu?',44,y+140,432,19,C.ink,true);
  const rows=[['Gợi ý bữa ăn theo nguyên liệu tôi có',C.orangeSoft,'#F58330'],
              ['Tôi muốn tìm món phù hợp với mục tiêu',C.greenSoft,'#77AF56'],
              ['Giúp tôi chọn một combo bữa ăn',C.brownSoft,'#B4A08D'],
              [loggedIn?'Đăng xuất':'Đăng nhập',C.white,'#B4A08D']];
  rows.forEach(([t,fill,col],i)=>{const yy=y+182+i*66;
    s.layer('Dòng gợi ý '+i,40,yy,440,54,ctx=>{ctx.fillStyle=fill;rrect(ctx,0,0,440,54,27);ctx.fill();});
    s.layer('Số thứ tự '+i,54,yy+13,28,28,ctx=>{ctx.fillStyle=col;rrect(ctx,0,0,28,28,14);ctx.fill();});
    s.text('Số #'+i,'#',60,yy+17,20,15,C.white,true);
    s.text('Chữ gợi ý '+i,t,94,yy+16,300,16);
    s.text('Mũi tên gợi ý '+i,'→',446,yy+15,26,20,'#ADB2A4');});
  return y+470;
}

/* ---------- GROUP 05: Nhật ký ---------- */
function calendar(s,y){
  s.text('Tuần trước','‹',22,y-4,36,26,C.navy,true);
  s.text('Ngày đang xem','20 tháng 9, 2026',84,y,360,20,C.ink,true);
  s.text('Tuần sau','›',472,y-4,30,26,C.navy,true);
  const ds=['T2','T3','T4','T5','T6','T7','CN'];
  ds.forEach((t,i)=>{const x=24+i*68;s.text('Thứ '+t,t,x+10,y+44,55,15,C.muted,false);
    s.layer('Ô ngày '+(14+i),x,y+72,58,50,ctx=>{ctx.fillStyle=i===6?C.lime:C.pale;rrect(ctx,0,0,58,50,22);ctx.fill();});
    s.text('Số ngày '+(14+i),''+(14+i),x+17,y+85,40,17,C.ink,i===6);});
}
function diary(id,mode){
  const empty=mode==='last';
  const h=mode==='modal'?1560:empty?900:mode==='after'?1620:1760;
  const s=new Screen(id,'Nhật ký',h,'lime');
  nonAIHeader(s,'Nhật ký');
  calendar(s,140);
  // summary ring card
  s.card('Thẻ tổng đợt',22,290,476,180,{fill:C.pale,r:26,shadow:false});
  s.layer('Vòng tổng đợt',44,312,138,138,ctx=>{
    ctx.lineWidth=14;ctx.strokeStyle=C.yellow;ctx.beginPath();ctx.arc(69,69,54,0,Math.PI*2);ctx.stroke();
    ctx.lineWidth=14;ctx.strokeStyle=C.lime;ctx.beginPath();ctx.arc(69,69,54,-Math.PI/2,Math.PI*.9);ctx.stroke();});
  s.text('Số đợt',empty?'0':'3',86,340,60,42,C.ink,true);
  s.text('Nhãn đợt','đợt ăn',84,402,70,15,C.muted,false);
  s.text('Bữa chính','Bữa chính   '+(empty?'0':'2'),210,330,260,20,C.ink,true);
  s.text('Ăn nhẹ','Ăn nhẹ       '+(empty?'0':'1'),210,385,260,20);
  s.text('Ghi chú mẫu','Dữ liệu minh họa',24,486,460,14,C.muted,false);
  if(empty){
    s.placeholder('Chưa ghi nhận bữa ăn',22,530,476,150,'Chưa ghi nhận bữa ăn');
    bottomNav(s);return s;
  }
  s.text('Nhóm chất tiêu đề','Các món đã ăn cung cấp nhóm chất nào?',24,524,466,20,C.ink,true);
  s.card('Thẻ nhóm chất',22,568,476,86,{r:18,shadow:false});
  ['Tinh bột','Đạm','Rau'].forEach((t,i)=>{s.text('Nhóm chất '+i,t,40+i*150,580,140,16,C.ink,true);
    s.text('Bằng chứng '+i,'Chưa có dữ liệu\nxác minh',40+i*150,606,140,13,C.muted,false);});
  let y=680;
  const data=[['Bữa sáng','07:30 · 1 đợt',[['Món trứng · mẫu',null]]],
              ['Bữa trưa','12:15 · 1 đợt',[['Món gà · mẫu','food-chicken'],...(mode==='after'?[]:[['Món rau · mẫu','food-veg']]),['Món cơm · mẫu',null]]],
              ['Ăn nhẹ','15:00 · 1 đợt',[['Combo B · mẫu',null]]]];
  for(const [title,time,items] of data){
    s.text('Nhóm bữa · '+title,title,24,y,260,20,C.ink,true);
    s.text('Giờ · '+title,time,280,y+3,210,15,C.muted,false);y+=44;
    for(const [name,img] of items){
      s.card('Bản ghi món · '+name,22,y,476,118,{r:20,stroke:C.line});
      if(img)s.img(img,'Ảnh món · '+name,36,y+14,96,90,14);else s.placeholder('Chờ ảnh · '+name,36,y+14,96,90,'Ảnh món');
      s.text('Tên món',name,150,y+22,300,19,C.ink,true);
      s.text('Trạng thái món','Đã xác nhận ăn · mẫu',150,y+60,300,14,C.muted,false);
      s.text('Mở chi tiết','›',462,y+38,26,26,C.navy,true);y+=130;
    }
    y+=20;
  }
  bottomNav(s);
  if(mode==='modal'){
    s.layer('Lớp chặn',0,0,SW,s.h,ctx=>{ctx.fillStyle='rgba(30,49,36,.42)';ctx.fillRect(0,0,SW,s.h);});
    const my=560;s.card('Hộp thoại xóa',40,my,440,220,{r:26});
    s.text('Tiêu đề hộp','Xóa món đã ăn?',64,my+24,400,23,C.ink,true);
    s.text('Nội dung hộp','Chỉ xóa Món rau đang chọn. Các món khác và Sổ tay được giữ nguyên.',64,my+66,392,17);
    s.button('Xóa',64,my+150,180,C.lime);
    s.button('Hủy',264,my+150,180,C.pale);
  }
  return s;
}

/* ---------- GROUP 06: Ghi lại form ---------- */
const shapes=['Cục nhỏ cứng','Thỏi dài lồi lõm','Thỏi dài nứt nẻ','Thỏi dài mịn','Hạt mềm','Dạng bùn','Dạng nước'];
const colors=['Trắng xám','Vàng','Nâu nhạt','Nâu','Nâu đậm','Xanh lá','Đen','Rất đậm','Đỏ','Đỏ sẫm'];
function choiceGrid(s,title,values,y,cols,h,selected,illustrated){
  s.text('Trường · '+title,title,24,y,472,20,C.ink,true);y+=38;
  const w=(476-(cols-1)*12)/cols;
  values.forEach((v,i)=>{const xx=24+(i%cols)*(w+12),yy=y+Math.floor(i/cols)*(h+12);
    s.layer('Lựa chọn · '+v,xx,yy,w,h,ctx=>{ctx.fillStyle=selected===v?C.pale:C.white;rrect(ctx,0,0,w,h,16);ctx.fill();
      ctx.strokeStyle=selected===v?C.lime:C.line;ctx.lineWidth=1.5;rrect(ctx,1,1,w-2,h-2,15);ctx.stroke();});
    if(illustrated)s.placeholder('Chờ hình · '+v,xx+10,yy+10,w-20,h-44,'Minh họa');
    s.text('Giá trị · '+v,v,xx+8,yy+(illustrated?h-36:14),w-16,14,C.ink,selected===v);
    if(selected===v)s.text('Đã chọn','✓',xx+w-26,yy+4,22,16,C.navy,true);});
  return y+Math.ceil(values.length/cols)*(h+12)+18;
}
function form(id,mode){
  const s=new Screen(id,'Phân',2150,'lime');
  nonAIHeader(s,'Phân','Nhập / chưa phê duyệt · dữ liệu mẫu');
  let y=150;
  for(const [l,v] of [['Thời lượng đi tiêu *',mode==='empty'||mode==='partial'?'':mode==='error'?'0':'4'],['Ngày ghi nhận','20/09/2026'],['Giờ ghi nhận','14:45']]){
    s.text('Nhãn '+l,l,24,y,280,18,C.ink,true);
    s.layer('Ô nhập '+l,300,y-4,196,46,ctx=>{ctx.fillStyle=C.pale;rrect(ctx,0,0,196,46,14);ctx.fill();
      ctx.strokeStyle=mode==='error'&&l.includes('*')?'#C36840':C.line;ctx.lineWidth=1.5;rrect(ctx,1,1,194,44,13);ctx.stroke();});
    s.text('Giá trị '+l,v+(l.includes('*')&&v?' phút':''),316,y+8,170,17);y+=66;
  }
  if(mode==='error'){s.layer('Thẻ lỗi',22,y-8,476,56,ctx=>{ctx.fillStyle='#FFF0CB';rrect(ctx,0,0,476,56,14);ctx.fill();});
    s.text('Lỗi thời lượng','Nhập thời lượng lớn hơn 0, đơn vị phút.',36,y+10,440,16,'#98500D');}
  y+=70;
  const filled=['valid','edit'].includes(mode);
  y=choiceGrid(s,'Hình dạng',shapes,y,3,120,filled?'Thỏi dài mịn':mode==='partial'?'Thỏi dài nứt nẻ':'',true);
  y=choiceGrid(s,'Màu sắc',colors,y,4,86,filled?'Nâu':'',false);
  y=choiceGrid(s,'Lượng phân',['Ít','Bình thường','Nhiều'],y,3,60,filled?'Bình thường':'');
  y=choiceGrid(s,'Cảm giác khi đi ngoài',['Trơn tru','Bình thường','Khó','Chưa hết'],y,2,58,filled?'Trơn tru':'');
  y=choiceGrid(s,'Độ dính',['Rất sạch','Dính nhẹ','Bám bồn cầu'],y,3,120,filled?'Rất sạch':'',true);
  s.text('Ghi chú tùy chọn','Các đặc điểm có thể bỏ trống. Không tự chọn giá trị thay bạn.',24,y,466,15,C.muted,false);y+=40;
  s.button('Xóa',24,y,220,C.yellow);s.button('Lưu',266,y,232,C.lime);
  return s;
}
function analysis(id,missing,fromHistory){
  const s=new Screen(id,'Phân tích',1500,'lime');
  nonAIHeader(s,'Phân tích');
  s.card('Thẻ tóm tắt',22,138,476,230,{fill:C.pale,r:24,shadow:false});
  s.text('Ngày giờ','20/09/2026 · '+(missing?'06:45':'14:45'),42,158,430,16,C.muted,false);
  s.text('Tên phần','Thông tin đã ghi nhận',42,196,430,23,C.ink,true);
  s.text('Tóm tắt','Thời lượng: '+(missing?'8':'4')+' phút\nHình dạng: '+(missing?'Thỏi dài nứt nẻ':'Thỏi dài mịn')+'\nCảm giác: '+(missing?'Chưa có dữ liệu':'Trơn tru'),42,238,430,18);
  let y=390;
  const vals=[['Hình dạng',missing?'Thỏi dài nứt nẻ':'Thỏi dài mịn'],['Màu sắc',missing?'Vàng':'Nâu'],['Thời lượng',missing?'8 phút':'4 phút'],['Độ dính',missing?'Chưa có dữ liệu':'Rất sạch'],['Lượng phân',missing?'Chưa có dữ liệu':'Bình thường'],['Cảm giác',missing?'Chưa có dữ liệu':'Trơn tru']];
  for(const [l,v] of vals){s.card('Quan sát · '+l,22,y,476,120,{r:20,stroke:C.line});
    s.placeholder('Chờ hình · '+l,36,y+16,88,88,'Minh họa');
    s.text('Tên đặc điểm',l,140,y+14,340,19,C.ink,true);
    s.text('Giá trị',v,140,y+48,340,17);
    s.text('Diễn giải','[Diễn giải đã kiểm chứng — chờ]',140,y+82,340,13,C.muted,false);y+=134;}
  s.button(fromHistory?'Quay lại Lịch sử':'Đã hiểu',24,y,476,C.lime);
  return s;
}

/* ---------- GROUP 07: Lịch sử & chỉnh sửa ---------- */
function history(id,mode){
  const empty=mode==='empty';
  const s=new Screen(id,'Lịch sử',empty?760:1240,'lime');
  nonAIHeader(s,'Lịch sử');
  s.text('Thêm bản ghi','+',452,30,40,32,C.navy,true);
  if(empty){s.placeholder('Chưa có bản ghi',22,160,476,280,'Chưa có bản ghi');
    s.text('Ghi chú trống','Không có dữ liệu không có nghĩa là đã ghi nhận 0 lần.',38,470,444,17,C.muted,false);return s;}
  let y=140;
  const rows=[['Hôm nay','Thỏi dài mịn','14:45','4 phút'],['','Thỏi dài nứt nẻ','06:45','8 phút'],['Hôm qua','Thỏi dài mịn','20:25','5 phút'],['22/08/2026','Thỏi dài lồi lõm','11:14','Chưa ghi nhận']];
  rows.forEach(([day,shape,time,dur],i)=>{
    if(day){s.text('Nhóm ngày',day,24,y,476,19,C.ink,true);y+=38;}
    const shift=(mode==='swipe'||mode==='modal')&&i===0?80:0;
    if(shift){s.layer('Nút xóa vuốt',416-shift+0,y,82,140,ctx=>{ctx.fillStyle=C.redSoft;rrect(ctx,0,0,82,140,20);ctx.fill();});
      s.text('Chữ xóa','Xóa',432-shift+0,y+92,60,16,C.ink,true);}
    s.card('Khung bản ghi',22-shift,y,476,140,{r:22,fill:C.pale,shadow:false});
    s.placeholder('Hình gốc',36-shift,y+26,76,88,'Minh họa');
    s.text('Tên hình dạng',shape,128-shift,y+20,260,19,C.ink,true);
    s.text('Giờ',time,128-shift,y+56,140,17);
    s.text('Thời lượng',dur,280-shift,y+56,150,15,C.muted,false);
    s.pill('Sửa',128-shift,y+92,76,false);
    s.text('Mở phân tích','›',466-shift,y+44,24,26,C.navy,true);y+=158;
  });
  if(mode==='modal'){
    s.layer('Lớp chặn',0,0,SW,s.h,ctx=>{ctx.fillStyle='rgba(30,49,36,.42)';ctx.fillRect(0,0,SW,s.h);});
    const my=430;s.card('Hộp thoại xóa lịch sử',40,my,440,220,{r:26});
    s.text('Tiêu đề','Xóa bản ghi?',64,my+24,400,23,C.ink,true);
    s.text('Nội dung','Xóa bản ghi đang chọn và cập nhật số lần đi tiêu, lịch sử, lịch Home.',64,my+66,392,17);
    s.button('Xóa',64,my+150,180,C.lime);s.button('Hủy',264,my+150,180,C.pale);
  }
  return s;
}

/* ---------- GROUP 10: AI mở lại & Hồ sơ AI ---------- */
function reentry(id,newChat){
  const s=new Screen(id,newChat?'Mở lại AI':'Mở lại AI',1180,'ai');
  aiHeader(s,'Mở lại AI');
  s.img('hin-thumbs','Nhân vật HIN',150,120,220,300,20);
  welcomeCard(s,430,true);
  const my=930;
  s.layer('Lớp chặn',0,0,SW,s.h,ctx=>{ctx.fillStyle='rgba(30,49,36,.35)';ctx.fillRect(0,0,SW,s.h);});
  s.card('Hộp thoại mở lại',40,my,440,newChat?200:250,{r:26});
  s.text('Tiêu đề',newChat?'Xác nhận bắt đầu mới':'Tiếp tục hay bắt đầu mới?',64,my+22,400,21,C.ink,true);
  s.text('Nội dung',newChat?'Thay thế hội thoại và xóa kết quả chưa lưu. Dữ liệu đã lưu độc lập vẫn giữ.':'Bạn có thể tiếp tục cuộc trò chuyện hiện có.',64,my+62,392,16);
  if(newChat){s.button('Xác nhận bắt đầu mới',64,my+130,392,C.lime);s.button('Hủy',64,my+192,392,C.pale);}
  else{s.button('Tiếp tục',64,my+128,392,C.lime);s.button('Bắt đầu mới',64,my+196,392,C.pale);}
  return s;
}
function persona(id,state){
  const s=new Screen(id,'Hồ sơ AI',1700,'ai');
  aiHeader(s,'Hồ sơ AI');
  s.text('Lưu','Lưu',448,120,60,18,C.navy,true);
  const preview=state!=='initial';
  s.card('Khung chân dung',80,130,360,430,{fill:'#EFF6FB',r:28,shadow:false});
  s.img('hin-thumbs','Chân dung nhân vật',110,150,300,380,20);
  if(state==='initial'||state==='success'){s.layer('Dấu tích đang dùng',96,540,34,34,ctx=>{ctx.fillStyle=C.lime;rrect(ctx,0,0,34,34,17);ctx.fill();});s.text('Tick','✓',104,546,20,18,C.navy,true);}
  // pagination dots
  for(let i=0;i<3;i++)s.layer('Chấm trang '+i,225+i*26,600,i===(preview?1:0)?20:9,9,ctx=>{ctx.fillStyle=i===(preview?1:0)?C.blue:'#ACC3D3';rrect(ctx,0,0,i===(preview?1:0)?20:9,9,4);ctx.fill();});
  s.text('Trạng thái lưu',state==='success'?'Đã lưu lựa chọn':preview?'Đang xem thử · chưa lưu':'Đang sử dụng',118,622,350,16,C.navy,false);
  s.card('Thẻ thông tin',22,660,476,150,{r:24});
  s.text('Tên nhãn','Tên',42,682,120,18,C.ink,true);
  s.text('Tên giá trị',preview?'[Nhân vật B]':'[Nhân vật A]',180,684,300,17);
  s.text('Giới thiệu nhãn','Giới thiệu',42,736,120,18,C.ink,true);
  s.text('Giới thiệu giá trị','Chưa thiết lập',180,738,300,16,C.muted,false);
  s.card('Thẻ mô tả',22,830,476,330,{r:24});
  s.text('Thiết lập nhân vật','Thiết lập nhân vật',42,852,420,19,C.ink,true);
  s.text('Chưa thiết lập','Chưa thiết lập',42,886,420,15,C.muted,false);
  for(let i=0;i<3;i++)s.layer('Dòng trống '+i,42,922+i*22,390-i*30,8,ctx=>{ctx.fillStyle='#F2F5F6';rrect(ctx,0,0,390-i*30,8,4);ctx.fill();});
  s.text('Phong cách đối thoại','Phong cách đối thoại',42,1000,420,19,C.ink,true);
  s.text('Chưa thiết lập 2','Chưa thiết lập',42,1034,420,15,C.muted,false);
  for(let i=0;i<2;i++)s.layer('Dline 2 '+i,42,1070+i*22,390-i*45,8,ctx=>{ctx.fillStyle='#F2F5F6';rrect(ctx,0,0,390-i*45,8,4);ctx.fill();});
  s.card('Thẻ thiết lập chung',22,1180,476,260,{r:24});
  [['Độ dài trả lời','[Lựa chọn chờ duyệt]'],['Giọng đọc','[Danh sách chờ duyệt]'],['Tốc độ đọc','[Giá trị chờ duyệt]']].forEach(([t,v],i)=>{
    s.text('Tên thiết lập',t,42,1200+i*80,420,18,C.ink,true);
    s.text('Giá trị chờ',v,42,1232+i*80,420,15,C.muted,false);});
  if(state==='unsaved'){
    const my=760;s.layer('Lớp chặn',0,0,SW,s.h,ctx=>{ctx.fillStyle='rgba(30,49,36,.35)';ctx.fillRect(0,0,SW,s.h);});
    s.card('Hộp thoại lưu',40,my,440,250,{r:26});
    s.text('Tiêu đề','Lưu thay đổi?',64,my+22,400,21,C.ink,true);
    s.text('Nội dung','Bạn đang xem thử một nhân vật khác.',64,my+62,392,16);
    s.button('Lưu thay đổi',64,my+120,392,C.lime);s.button('Không lưu',64,my+184,392,C.pale);
  }
  return s;
}

/* ---------- I04: AI results ---------- */
function aiResults(){
  const s=new Screen('I04','Nhiều kết quả AI',5600,'ai');
  aiHeader(s,'Kết quả AI');
  let y=120;
  // user message bubble (right, green)
  s.layer('Tin người dùng',108,y,388,80,ctx=>{ctx.fillStyle=C.greenSoft;rrect(ctx,0,0,388,80,24);ctx.fill();});
  s.text('Yêu cầu mẫu','Gợi ý món và combo trong 30 phút.',128,y+16,350,18);
  s.text('Giờ mẫu','12:10 · mẫu',360,y+50,120,13,C.muted,false);y+=100;
  // AI response
  s.card('Tin AI',22,y,476,150,{r:24});
  s.img('ai-avatar','Avatar trong tin AI',40,y+18,44,44,22);
  s.text('Phản hồi','Kết quả minh họa',96,y+20,380,20,C.ink,true);
  s.text('Giới hạn','Không sử dụng nhật ký tiêu hóa cho yêu cầu này.',96,y+54,380,16);
  s.pill('▷ Phát giọng đọc',40,y+96,210,false,C.pale);y+=172;
  // evidence card
  s.card('Thẻ bằng chứng GIB',22,y,476,120,{fill:C.pale,r:22,shadow:false});
  s.text('Bằng chứng','T = 30 phút · Chưa có dữ liệu dinh dưỡng đã xác minh. Giữ cùng nhóm chờ đánh giá G/I/B.',40,y+16,440,17);
  y+=140;
  s.text('Nhóm thời gian','Các lựa chọn trong thời gian',24,y,466,21,C.ink,true);y+=44;
  const data=[['Món gà · mẫu','20','Bữa chính','food-chicken','Gà'],['Món rau · mẫu','15','Bữa chính','food-veg','Rau'],['Món cơm · mẫu','25','Bữa chính',null,'Gạo'],['Combo A · mẫu','30','Bữa chính',null,'Gà, rau, cơm'],['Món táo · mẫu','5','Ăn nhẹ',null,'Táo'],['Combo B · mẫu','35','Bữa chính',null,'Cá, rau, cơm']];
  data.forEach(([name,min,kind,img,ing],i)=>{
    if(i===5){s.text('Nhóm dự phòng','Dự phòng · vượt 5 phút',24,y,466,21,C.ink,true);y+=44;}
    const ch=600;
    s.card('Thẻ kết quả · '+name,22,y,476,ch,{r:26});
    if(img)s.img(img,'Ảnh · '+name,150,y+18,220,150,16);else s.placeholder('Chờ ảnh · '+name,100,y+18,320,150,name.startsWith('Combo')?'Ảnh cả bữa':'Ảnh món');
    s.text('Tên kết quả',name,44,y+182,400,22,C.ink,true);
    s.text('Thu gọn','⌃',454,y+182,26,20,C.navy,true);
    s.text('Nhóm đánh giá','Cùng nhóm chờ đánh giá G/I/B',44,y+222,430,15,C.muted,false);
    s.pill(min+' phút · '+kind,44,y+252,300,true);
    s.text('Tóm tắt','[Tóm tắt có bằng chứng]',44,y+300,430,15,C.muted,false);
    s.text('Thành phần',(name.startsWith('Combo')?'Các món: ':'Nguyên liệu: ')+ing+' · mẫu',44,y+332,430,16);
    s.text('Cách làm','Cách làm',44,y+372,430,18,C.ink,true);
    s.text('Các bước','1. [Bước nấu đã xác minh]\n2. [Bước tiếp theo]\n[Gia vị và thay thế đã xác minh]',44,y+404,430,15,C.muted,false);
    s.layer('Checkbox chọn',44,y+512,26,26,ctx=>{ctx.strokeStyle=C.blue;ctx.lineWidth=2;rrect(ctx,1,1,24,24,6);ctx.stroke();});
    s.text('Nhãn chọn','Chọn món đã ăn',84,y+514,240,16);
    s.pill('Lưu vào Sổ tay',300,y+506,170,false,C.pale);
    y+=ch+20;
  });
  // save-eaten card
  s.card('Thẻ lưu đã ăn',22,y+2,476,150,{r:24});
  s.text('Ngày ăn nhãn','Ngày ăn',44,y+18,160,18,C.ink,true);
  s.layer('Chọn ngày',220,y+14,240,42,ctx=>{ctx.fillStyle=C.pale;rrect(ctx,0,0,240,42,14);ctx.fill();});
  s.text('Ngày mẫu','20/09/2026',240,y+24,200,16);
  s.button('Đã ăn',44,y+78,420,C.lime);y+=176;
  s.text('Lưu có chọn lọc','Chỉ ghi các món đã chọn. Bữa chính và Ăn nhẹ lưu riêng; không tạo đợt trùng.',26,y,470,15,C.muted,false);
  aiInputBar(s);
  return s;
}

/* ---------- assemble ---------- */
const groups=[];
function group(name,ids,notes){groups.push({name,ids,notes});}
(async()=>{
  for(const f of fs.readdirSync(path.join(O,'assets')).filter(x=>x.endsWith('.png'))){
    try{assets[f.slice(0,-4)]=await loadImage(path.join(O,'assets',f));}catch(e){}
  }
  navAssets();

  diary('D01','normal');diary('D02','modal');diary('D03','after');diary('D04','last');
  group('05 · Nhật ký / xóa từng món',['D01','D02','D03','D04'],
    ['Vuốt từng món → xác nhận D02','Xóa chỉ món đang chọn; Hủy quay lại D01','Giữ các món khác và số đợt','Món cuối: bỏ đợt rỗng, giảm đúng một đợt']);

  form('R02','empty');form('R03','partial');form('R04','error');form('R05','valid');analysis('R06',false);analysis('R07',true);
  group('06 · Ghi lại / nhập và lưu',['R02','R03','R04','R05','R06','R07'],
    ['Biểu mẫu đủ trường, chưa chọn sẵn','Nhập một phần; không tự điền tùy chọn','Thời lượng lỗi: không cho lưu','Hợp lệ → Lưu → phân tích R06','Đã hiểu → màn Ghi lại','Thiếu tùy chọn: vẫn phân tích phần có dữ liệu']);

  history('R08');analysis('R09',false,true);history('R10','swipe');history('R11','modal');form('R12','edit');history('R13','empty');
  group('07 · Ghi lại / lịch sử và chỉnh sửa',['R08','R09','R10','R11','R12','R13'],
    ['Lịch sử đủ nhóm ngày → chọn bản ghi','Quay lại Lịch sử, không tạo bản ghi mới','Toàn bộ dòng dịch chuyển để lộ Xóa','Hủy giữ dữ liệu; Xóa cập nhật đếm','Chỉnh sửa giữ ID, không tính lần mới','Chưa có bản ghi: không suy diễn bằng 0']);

  reentry('I06',false);reentry('I07',true);persona('P01','initial');persona('P02','preview');persona('P03','success');persona('P04','unsaved');
  group('10 · AI / mở lại và Hồ sơ AI',['I06','I07','P01','P02','P03','P04'],
    ['Tiếp tục / Bắt đầu mới / đóng về Hồ sơ','Dữ liệu đã lưu độc lập vẫn giữ','Vuốt chỉ xem thử, không tự lưu','Dấu tích vẫn ở nhân vật đã lưu','Lưu ở lại trang; đồng bộ avatar','Ba lựa chọn khi chưa lưu']);

  aiResults();
  group('09 · AI / nhiều kết quả (I04)',['I04'],
    ['Thẻ độc lập, mở rộng/ảnh → C01/C02; Đã ăn chỉ lưu lựa chọn vào D01.']);

  // layout
  const MW=5200;let yy=180;const layout=[];
  groups.forEach(g=>{const max=Math.max(...g.ids.map(id=>screens.find(s=>s.id===id).h));layout.push({...g,y:yy,height:max+300});yy+=max+380;});
  const MH=yy+80;
  const full=blank(MW,MH);const fc=full.getContext('2d');
  fc.fillStyle=C.paper;fc.fillRect(0,0,MW,MH);
  const tree=[];
  function mapText(str,x,y,w,sz,arr,bold=true,col=C.ink){
    const h=sz+10;const cc=blank(w,h);const cx=cc.getContext('2d');
    cx.font=`${bold?'bold ':''}${sz}px Arial`;cx.fillStyle=col;cx.textBaseline='top';cx.fillText(str,0,0);
    fc.save();fc.font=cx.font;fc.fillStyle=col;fc.textBaseline='top';fc.fillText(str,x,y);fc.restore();
    arr.push({name:'Chú thích · '+String(str).slice(0,20),left:x,top:y,canvas:cc});
  }
  mapText('SỬA TỰ ĐỘNG · 02.10.2026',42,30,4900,40,tree);
  mapText('Bản cập nhật riêng · Toàn bộ nội dung hiển thị · File gốc được giữ nguyên',42,92,4900,22,tree,false,C.muted);

  for(const g of layout){
    const gg={name:g.name,children:[]};tree.push(gg);
    mapText(g.name,38,g.y,4950,28,gg.children);
    g.ids.forEach((id,i)=>{
      const s=screens.find(v=>v.id===id);const x=40+i*820,sy=g.y+110;
      mapText(id+' / '+s.title,x,g.y+58,760,19,gg.children,false,C.navy);
      // white mask behind phone
      fc.save();fc.fillStyle='#FFFFFF';rrect(fc,x-8,sy-8,SW+16,s.h+16,40);fc.fill();fc.restore();
      fc.drawImage(s.canvas,x,sy);
      gg.children.push({name:id+' · '+s.title,children:s.layers.map(l=>({...l,left:l.left+x,top:l.top+sy,text:l.text?{...l.text,transform:[1,0,0,1,l.text.transform[4]+x,l.text.transform[5]+sy]}:undefined}))});
      mapText(g.notes[i],x,sy+s.h+18,760,17,gg.children,false,C.muted);
      fs.writeFileSync(path.join(O,'v2-'+id+'.png'),s.canvas.toBuffer('image/png'));
    });
    // arrows between first two
    if(g.ids.length>1){const a=0,b=1;const x=40+a*820+SW+12;const hA=screens.find(s=>s.id===g.ids[a]).h;const hB=screens.find(s=>s.id===g.ids[b]).h;const ay=g.y+110+Math.min(hA,hB)*.45;
      const ac=blank(150,24);const cc=ac.getContext('2d');cc.strokeStyle=C.blue;cc.lineWidth=3;cc.beginPath();cc.moveTo(4,12);cc.lineTo(130,12);cc.stroke();cc.fillStyle=C.blue;cc.beginPath();cc.moveTo(142,12);cc.lineTo(128,5);cc.lineTo(128,19);cc.fill();
      fc.drawImage(ac,x,ay);gg.children.push({name:'Mũi tên · '+g.ids[a]+'→'+g.ids[b],left:x,top:ay,canvas:ac});}
  }
  // overview preview
  const ov=blank(1100,Math.ceil(MH*1100/MW));ov.getContext('2d').drawImage(full,0,0,ov.width,ov.height);
  fs.writeFileSync(path.join(O,'v2-overview.png'),ov.toBuffer('image/png'));
  // group previews
  for(const g of layout){const pv=blank(1600,Math.ceil(g.height*1600/MW));pv.getContext('2d').drawImage(full,0,g.y,MW,g.height,0,0,pv.width,pv.height);fs.writeFileSync(path.join(O,'v2-group-'+g.name.slice(0,2)+'.png'),pv.toBuffer('image/png'));}

  console.log('Writing PSD',MW,MH,screens.length,'screens');
  fs.writeFileSync(path.join(O,'Sua-tu-dong.psd'),writePsdBuffer({width:MW,height:MH,canvas:full,children:[{name:'Sửa tự động',children:tree}]}));
  fs.writeFileSync(path.join(O,'v2-layout.json'),JSON.stringify({width:MW,height:MH,groups:layout,screens:screens.map(s=>({id:s.id,title:s.title,height:s.h})),textChecks},null,2));
  console.log('DONE',screens.length,'screens');
})().catch(e=>{console.error('BUILD ERROR',e);process.exit(1);});
