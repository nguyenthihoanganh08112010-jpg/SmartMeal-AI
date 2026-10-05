/* Export the frozen UI captures as a layered visual handoff; never changes app code. */
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const dep=process.env.SM_PSD_DEPS || path.resolve(__dirname,'../../../../tmp/photoshop-export/node_modules');
const {createCanvas,loadImage,ImageData}=require(path.join(dep,'@napi-rs/canvas'));
const {initializeCanvas,writePsdBuffer,readPsd}=require(path.join(dep,'ag-psd'));
initializeCanvas(createCanvas,(w,h)=>new ImageData(w,h));
const out=__dirname;
// Each node is an actual captured state. Edges describe approved transitions, not a claim of backend execution.
const rows=[
['01 · Tài khoản và trạng thái Hồ sơ','Điểm vào: tab Hồ sơ. Xác thực trong wireframe là mô phỏng; không nhập thông tin thật.',[
['A01','audit-home','Chưa đăng nhập','Bấm Đăng nhập/Đăng ký → A02. Không hiển thị danh tính giả.'],
['A02','account-entry','Chọn luồng tài khoản','Đăng nhập → A03. Đăng ký dùng luồng tài khoản hiện có.'],
['A03','account-login','Đăng nhập','Quên mật khẩu → A04. Thành công → H01 hoặc H02 theo hồ sơ.'],
['A04','account-reset','Đặt lại mật khẩu','Nhập email; gửi liên kết trong luồng mô phỏng. Quay lại → A03.'],
['H02','audit-incomplete','Hồ sơ chưa hoàn tất','Tiếp tục → biểu mẫu hồ sơ. Đây là bước riêng với đăng nhập.'],
['H01','audit-member','Hồ sơ đã đăng nhập','Avatar/tên → sửa thông tin. Ô đi tiêu → R01.']],[[0,1,'Chạm nút xanh'],[1,2,'Đăng nhập'],[2,3,'Quên mật khẩu']]],
['02 · Hồ sơ / kiến thức / chuỗi ngày','Giữ lưới thông tin 2×2. Bạn Thỏ và tháp là vị trí chờ tài sản; không phải tranh đã duyệt.',[
['H03','audit-home','Điểm xuất phát','Thỏ: nảy → đổi trạng thái → trở về → hiện kiến thức cạnh bên.'],
['H04','home-pyramid','Tháp toàn màn hình','Chạm tháp để phóng toàn màn hình. Đóng/Quay lại → H03.'],
['H05','audit-streak','Chuỗi ngày sử dụng','Một ngày hợp lệ chỉ cộng một lần; ô có tích màu #CFE6AF.'],
['H06','audit-goal','Lịch sử đổi mục tiêu','Chỉ các thay đổi thực trong tháng. Quay lại → Hồ sơ.'],
['R01','record','Điểm vào Ghi lại','Ô đi tiêu trên Home dẫn tới màn này, không mở thẳng biểu mẫu.']],[[0,1,'Chạm tháp'],[1,0,'Đóng',true]]],
['03 · Sổ tay / xem công thức','Lưu yêu thích độc lập với Nhật ký đã ăn. Chi tiết dùng chung cho Sổ tay, Nhật ký và AI.',[
['S01','saved','Món đơn','Lưới hai cột. Chạm món → C01. Chuyển Combo → S02.'],
['C01','saved-detail','Chi tiết món dùng chung','Ảnh, thông tin có bằng chứng, nguyên liệu, gia vị và bước nấu.'],
['S02','saved-combo','Combo','Thẻ ngang. Chạm combo → C02.'],
['C02','saved-combo-detail','Chi tiết combo dùng chung','Chạm một món thành phần → C01; quay lại đúng combo.'],
['S03','saved-search','Tìm kiếm','Tìm trong món đã lưu; không truy vấn cơ sở dữ liệu calo.'],
['S04','saved-filter','Lọc nguyên liệu','Áp dụng cho Món đơn; không áp cho danh sách Combo.']],[[0,1,'Chạm món'],[2,3,'Chạm combo'],[3,1,'Món thành phần',true],[4,5,'Lọc Món đơn']]],
['04 · Sổ tay / xóa và trạng thái rỗng','Sổ tay xóa trực tiếp khi chạm thùng rác; không áp dụng hộp xác nhận của Nhật ký.',[
['S05','saved-swipe','Vuốt món đơn','Vuốt trái một thẻ để lộ thùng rác; chỉ tác động món đã lưu.'],
['S06','saved-combo-swipe','Vuốt combo','Cùng tài sản thùng rác; giữ danh sách và ngữ cảnh hiện tại.'],
['S07','saved-empty','Chưa có món đã lưu','Trạng thái khi danh sách tương ứng rỗng; không suy ra đã ăn.'],
['S08','saved-none','Không có kết quả','Giữ điều kiện tìm/lọc để người dùng điều chỉnh.']],[]],
['05 · Nhật ký / xóa từng món','Một đợt ăn chứa nhiều bản ghi món. Xóa món giữa không xóa món bên cạnh hoặc giảm số đợt.',[
['D01','update-diary','Một đợt / nhiều món','Vuốt độc lập từng món. Không có chức năng sửa món ở Nhật ký.'],
['D02','diary-after','Hộp xác nhận trên cùng','Lớp nền chặn tương tác danh sách. Hủy → D01, giữ vị trí cuộn.'],
['D03','diary-deleted-middle','Sau xóa món giữa','Các món còn lại và đợt ăn được giữ; bộ đếm đợt không đổi.'],
['D04','diary-deleted-last','Sau xóa món cuối','Ví dụ riêng: đợt trống tự được bỏ; giảm bộ đếm tương ứng đúng một lần.']],[[0,1,'Vuốt → thùng rác'],[1,2,'Xác nhận xóa'],[2,3,'Biến thể: xóa món cuối',true],[1,0,'Hủy',true]]],
['06 · Ghi lại / nhập và lưu','Bắt đầu → biểu mẫu. Thời lượng nhập tay, số dương, đơn vị phút; không tự chọn dữ liệu tùy chọn.',[
['R02','record-empty','Biểu mẫu trống','Ngày giờ của bản ghi. Nút Xóa chỉ xóa dữ liệu chưa lưu.'],
['R03','record-partial','Nhập một phần','Các mục tùy chọn có thể thiếu; không tự điền Bình thường.'],
['R04','record-error','Thời lượng không hợp lệ','Hiển thị lỗi tại trường, chặn lưu. Sửa thời lượng → R05.'],
['R05','record-valid','Sẵn sàng lưu','Lưu tạo đúng một bản ghi; cập nhật đếm ngày và Home.'],
['R06','record-saved','Phân tích sau lưu','Mở ngay phân tích bản ghi vừa lưu. Đã hiểu → R01.'],
['R07','record-missing','Thiếu dữ liệu tùy chọn','Vẫn trình bày quan sát có dữ liệu; không chẩn đoán/cho điểm.']],[[0,1,'Nhập dữ liệu'],[1,2,'Lưu thiếu thời lượng'],[2,3,'Sửa hợp lệ'],[3,4,'Lưu'],[4,5,'Biến thể thiếu dữ liệu',true]]],
['07 · Ghi lại / lịch sử và chỉnh sửa','Lịch sử giữ nhóm ngày. Toàn bộ nội dung dòng dịch chuyển cùng nhau khi vuốt.',[
['R08','record-history','Danh sách lịch sử','Chạm bản ghi → R09; dấu cộng → R02; vuốt → R10.'],
['R09','record-reopened','Mở lại phân tích','Quay lại → R08 giữ cuộn. Không tạo thêm lần đi tiêu.'],
['R10','record-swipe','Vuốt một bản ghi','Dòng bo tròn chuyển cùng nội dung; thùng rác có khung bo tròn.'],
['R11','record-delete','Xác nhận xóa','Xác nhận cập nhật lịch sử, Home, số đếm ngày và đầu vào A8.'],
['R12','audit-edit-record','Chỉnh sửa bản ghi','Giữ ID; thay ngày cập nhật cả ngày cũ và mới. Không cộng lần mới.'],
['R13','record-nohistory','Lịch sử rỗng','Không có bản ghi là thiếu thông tin, không phải xác nhận bằng 0.']],[[0,1,'Chạm bản ghi'],[1,0,'Quay lại',true],[2,3,'Chạm thùng rác']]],
['08 · Phân tích nhật ký / điều kiện và dữ liệu','Chỉ mở qua icon Phân tích nhật ký tại R01. Không tự chạy phân tích bảy ngày sau khi lưu.',[
['R14','record-seven','Điểm vào phân tích','Xét hôm nay và sáu ngày trước. Đóng/Quay lại → R01.'],
['R15','audit-a8-missing','Chưa đủ dữ liệu','Chưa đủ tuổi tài khoản/số bản ghi/bằng chứng: không tạo xu hướng.'],
['R16','audit-a8','Bố cục đủ điều kiện','Nội dung diễn giải phải có bằng chứng; biểu đồ thống kê chưa thiết kế.'],
['R17','audit-offline','Trạng thái ngoại tuyến','Ảnh trạng thái hiện có; đồng bộ thật chưa kết nối trong prototype.']],[[0,1,'Không đủ điều kiện'],[0,2,'Đủ điều kiện',true]]],
['09 · AI / chào, tạo bữa và ghi nhận đã ăn','Toàn màn hình, không có thanh năm tab. Welcome giữ đầu lịch sử; tin mới bên dưới.',[
['I01','update-welcome','Chào / chưa đăng nhập','Gợi ý câu hỏi gửi ngay. Hành động tài khoản mở A02/A03, không gửi chat.'],
['I02','update-auth','Chào / đã đăng nhập','Hiển thị hành động theo xác thực; không làm mất lịch sử hội thoại.'],
['I03','ai-confirm','Xác nhận tạo bữa','Bảng dưới cao 2/3. Kéo xuống/đóng hủy sửa tạm. Quyền nhật ký đồng bộ.'],
['I04','update-results','Nhiều kết quả AI','Thẻ độc lập, mở rộng/ảnh → C01/C02; Đã ăn chỉ lưu lựa chọn vào D01.'],
['I05','update-empty','Không có kết quả hợp lệ','Không bịa món hoặc điểm. Điều chỉnh yêu cầu theo luồng đã duyệt.']],[[0,2,'Yêu cầu tạo lần đầu'],[2,3,'Tạo kết quả'],[2,4,'Không có món hợp lệ',true]]],
['10 · AI / mở lại và thiết lập nhân vật','Quyền nhật ký mặc định TẮT mỗi lần tạo; chỉ áp cho yêu cầu hiện tại. Mở lại không tự xóa hội thoại.',[
['I06','ai-reentry','Mở lại AI','Tiếp tục → cuộc trò chuyện cũ. Đóng → Home. Bắt đầu mới → I07.'],
['I07','ai-new-confirm','Xác nhận bắt đầu mới','Xóa hội thoại và kết quả chưa lưu; giữ dữ liệu đã lưu độc lập.'],
['P01','audit-persona','Hồ sơ AI','Mở bằng bánh răng. Chân dung/nội dung chưa duyệt vẫn là vị trí chờ.'],
['P02','persona-preview','Xem thử nhân vật','Vuốt chỉ xem thử; dấu tích vẫn theo nhân vật đang lưu.'],
['P03','persona-success','Đã lưu lựa chọn','Lưu cập nhật avatar và dấu tích, báo thành công, ở lại trang.'],
['P04','persona-unsaved','Thoát khi chưa lưu','Lưu thay đổi / Không lưu / Tiếp tục chỉnh sửa. Giữ cuộn chat.']],[[0,1,'Bắt đầu mới'],[2,3,'Vuốt ngang'],[3,4,'Lưu'],[3,5,'Quay lại chưa lưu',true]]]
];
const W=4200,RH=1490,H=620+rows.length*RH+300;
const canvas=createCanvas(W,H),ctx=canvas.getContext('2d'),children=[],manifest=[];
function layer(group,name,x,y,w,h,paint,extra={}) {const c=createCanvas(Math.ceil(w),Math.ceil(h));paint(c.getContext('2d'));ctx.drawImage(c,x,y);const l={name,left:x,top:y,canvas:c,...extra};group.push(l);return l;}
function rect(g,name,x,y,w,h,color,r=0){return layer(g,name,x,y,w,h,c=>{c.fillStyle=color;c.beginPath();c.roundRect(0,0,w,h,r);c.fill();});}
function text(g,name,str,x,y,w,size=25,color='#39452D',bold=false){
 const m=createCanvas(1,1).getContext('2d');m.font=`${bold?'bold ':''}${size}px Arial`;let lines=[];
 for(const p of str.split('\n')){let l='';for(const word of p.split(' ')){if(m.measureText((l?l+' ':'')+word).width>w-4&&l){lines.push(l);l=word;}else l+=(l?' ':'')+word;}lines.push(l);}
 const h=lines.length*size*1.35+12,rendered=lines.join('\r');
 return layer(g,name,x,y,w,h,c=>{c.font=m.font;c.fillStyle=color;c.textBaseline='top';lines.forEach((s,i)=>c.fillText(s,0,i*size*1.35+3));},{text:{text:rendered,transform:[1,0,0,1,x,y+size],antiAlias:'smooth',shapeType:'point',style:{font:{name:bold?'Arial-BoldMT':'ArialMT'},fontSize:size,fillColor:{r:parseInt(color.slice(1,3),16),g:parseInt(color.slice(3,5),16),b:parseInt(color.slice(5,7),16)},leading:size*1.35,autoLeading:false},paragraphStyle:{justification:'left'}}});
}
function arrow(g,x1,y1,x2,y2,label,dashed=false,bend=false){
 const minx=Math.min(x1,x2)-12,miny=Math.min(y1,y2)-12,w=Math.abs(x2-x1)+24,h=Math.abs(y2-y1)+24;
 layer(g,'Đường nối · '+label,minx,miny,w,h,c=>{c.strokeStyle=dashed?'#929B88':'#648643';c.fillStyle=c.strokeStyle;c.lineWidth=4;if(dashed)c.setLineDash([10,8]);c.beginPath();c.moveTo(x1-minx,y1-miny);c.lineTo(x2-minx,y2-miny);c.stroke();let a=Math.atan2(y2-y1,x2-x1);c.setLineDash([]);c.beginPath();c.moveTo(x2-minx,y2-miny);c.lineTo(x2-minx-14*Math.cos(a-.45),y2-miny-14*Math.sin(a-.45));c.lineTo(x2-minx-14*Math.cos(a+.45),y2-miny-14*Math.sin(a+.45));c.fill();});
}
(async()=>{
rect(children,'00 · Nền bản đồ',0,0,W,H,'#FFFCF0');
const intro={name:'00 · Hướng dẫn đọc và chỉnh sửa',children:[]};children.push(intro);
text(intro.children,'Tên tài liệu','SMARTMEAL AI',80,50,3500,76,'#39452D',true);
text(intro.children,'Loại tài liệu','BẢN ĐỒ GIAO DIỆN & LUỒNG THAO TÁC',80,150,3900,46,'#39452D',true);
text(intro.children,'Nguồn','Bàn giao từ wireframe đã chốt · 27.09.2026 · Ảnh màn hình là nhân vật chính',80,225,3900,28);
text(intro.children,'Cách đọc','Đọc từng dải từ trái sang phải. Mũi tên = thao tác được ghi tên; nét đứt = nhánh / quay lại. Mã A, H, S, C, D, R, I, P giúp tìm điểm đến ở dải khác. Các màn cạnh nhau không có mũi tên là biến thể, không tự chuyển tiếp.',80,290,3900,27);
text(intro.children,'Điều hướng chính','Hồ sơ → dải 01–02     Nhật ký → 05     Sổ tay → 03–04     Ghi lại → 06–08     AI → 09–10',80,390,3900,30,'#39452D',true);
text(intro.children,'Phạm vi chỉnh sửa','Ảnh là các trạng thái mẫu, không nhất thiết cùng một phiên dữ liệu. PSD tách ảnh / chữ chú thích / mũi tên. Chữ bên trong ảnh UI là bitmap. Tài sản chờ giữ nguyên; không thiết kế lại ứng dụng.',80,460,3900,26);
for(let ri=0;ri<rows.length;ri++){
 const [title,desc,nodes,edges]=rows[ri],y=620+ri*RH,g={name:title,children:[]};children.push(g);
 rect(g.children,'Nền dải',40,y,W-80,RH-35,ri%2?'#F0F4E9':'#FFFFFF',28);
 text(g.children,'Tiêu đề',title,80,y+24,3950,38,'#39452D',true);
 text(g.children,'Nguyên tắc',desc,80,y+83,3940,24);
 for(let ni=0;ni<nodes.length;ni++){
  const [id,file,title,note]=nodes[ni],x=100+ni*675,sy=y+218,ng={name:id+' · '+title,children:[]};g.children.push(ng);
  text(ng.children,'Mã và tên',id+' / '+title,x,y+151,525,24,'#39452D',true);
  const p=path.join(out,'screens',file+'.png'),im=await loadImage(p);
  if(im.width<488||im.height<1000)throw Error('Capture dimensions '+file);
  rect(ng.children,'Viền ảnh',x-3,sy-3,494,1006,'#D4DCCB',16);
  layer(ng.children,'Ảnh màn hình · '+file,x,sy,488,1000,c=>c.drawImage(im,0,0,488,1000,0,0,488,1000));
  text(ng.children,'Ghi chú thao tác',note,x,sy+1022,520,23);
  manifest.push({id,file:'screens/'+file+'.png',sha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),x,y:sy,width:488,height:1000,note});
 }
 for(let ei=0;ei<edges.length;ei++){
  const [a,b,label,dash]=edges[ei];
  if(b===a+1&&!dash){const x=100+a*675+495;arrow(g.children,x,y+680,x+167,y+680,label);text(g.children,'Action · '+label,label,x+4,y+598,155,21);}
  else {const yy=y+1390+(ei%2)*28,x1=100+a*675+244,x2=100+b*675+244;arrow(g.children,x1,yy,x2,yy,label,true);text(g.children,'Branche · '+label,`${nodes[a][0]} → ${nodes[b][0]} · ${label}`,Math.min(x1,x2),yy-30,Math.max(460,Math.abs(x2-x1)),21);}
 }
 console.log('Rendered '+title);
}
text(children,'Limites','Ảnh giữ nguyên nhãn nháp lịch sử của prototype. Wireframe đã được người dùng chốt; tranh, nhân vật và nội dung chờ không vì vậy trở thành tài sản cuối. PSD mô tả tương tác, không chạy tương tác.',80,H-230,W-160,26);
text(children,'Nguồn chi tiết','Đối chiếu báo cáo SMARTMEAL_UX_UI_HANDOFF.md để xem thông số, dữ liệu, quy tắc và các giới hạn kiểm chứng. Không chỉnh mã ứng dụng hoặc PRD trong lần xuất tài liệu này.',80,H-140,W-160,26);
const preview=createCanvas(1260,Math.round(H*1260/W));preview.getContext('2d').drawImage(canvas,0,0,preview.width,preview.height);fs.writeFileSync(path.join(out,'SmartMeal-map-overview.png'),preview.toBuffer('image/png'));
for(let i=0;i<rows.length;i++){const c=createCanvas(2100,RH/2);c.getContext('2d').drawImage(canvas,0,620+i*RH,W,RH,0,0,2100,RH/2);fs.writeFileSync(path.join(out,`flow-${String(i+1).padStart(2,'0')}.png`),c.toBuffer('image/png'));}
const psd={width:W,height:H,canvas,children};console.log('Writing PSD');
const buf=writePsdBuffer(psd,{generateThumbnail:true});fs.writeFileSync(path.join(out,'SmartMeal-UX-UI-Flow-Map.psd'),buf);
const parsed=readPsd(buf,{skipLayerImageData:true,skipCompositeImageData:true,skipThumbnail:true});let layers=0,texts=0,groups=0;function walk(ls){for(const l of ls||[]){layers++;if(l.text)texts++;if(l.children){groups++;walk(l.children);}}}walk(parsed.children);
const qa={createdAt:new Date().toISOString(),width:parsed.width,height:parsed.height,bytes:buf.length,screens:manifest.length,layers,textLayers:texts,groups,checks:{psdRoundTrip:'PASS',screenSources:'PASS',editableTextMetadata:'PASS',nativePhotoshopOpen:'NOT VERIFIED',liveInteractionInPSD:'NOT APPLICABLE'},sha256:crypto.createHash('sha256').update(buf).digest('hex')};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({baseline:'d66f16fef3b6de26d97e54716d140358fa2644fb',screens:manifest},null,2));fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(qa,null,2));console.log(JSON.stringify(qa));
})().catch(e=>{console.error(e);process.exit(1)});
