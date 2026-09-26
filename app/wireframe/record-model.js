const DigestModel = (()=>{
 const day=s=>Math.floor(Date.parse(s+'T00:00:00Z')/86400000);
 const distinct=rs=>[...new Map(rs.map(r=>[r.id,r])).values()];
 const duration=v=>String(v??'').trim()!==''&&Number.isFinite(Number(v))&&Number(v)>0;
 const count=(rs,date)=>distinct(rs).filter(r=>r.date===date).length;
 const save=(rs,r)=>{if(!duration(r.duration))throw Error('duration');if(!r.id||!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!r.time)throw Error('date');return [...rs.filter(x=>x.id!==r.id),{...r,duration:Number(r.duration)}];};
 const remove=(rs,id)=>rs.filter(r=>r.id!==id);
 const eligibility=(rs,today,firstUse,evidence=false)=>{const records=distinct(rs).filter(r=>day(r.date)>=day(today)-6&&day(r.date)<=day(today));const age=day(today)-day(firstUse);return {records,age,ageOK:age>=7,countOK:records.length>=3,statisticsOK:age>=7&&records.length>=3,trendOK:false};};
 return {duration,count,save,remove,eligibility,distinct};
})();
if(typeof module!=='undefined')module.exports=DigestModel;
