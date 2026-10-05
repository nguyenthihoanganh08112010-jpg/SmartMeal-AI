/** Replaceable reviewed content. Empty means unavailable, not license to invent facts. */
export type VerifiedContent={id:string;title:string;body:string;source:string;sourceUrl?:string;checkedAt:string;verified:true};
export type PyramidLevel={id:string;label:string;content:string;source?:string;verified:boolean};
export const pyramidLevels:PyramidLevel[]=Array.from({length:5},(_,i)=>({id:`level-${i+1}`,label:`Tầng ${i+1}`,content:'Nội dung nhóm thực phẩm và nguồn kiểm chứng sẽ được bổ sung.',verified:false}));
export const dailyInsights:VerifiedContent[]=[];
export const nutritionGoals:{id:string;label:string;source:string}[]=[];
export const digestiveInterpretations:VerifiedContent[]=[];
export const stickinessLabels=['Sạch','Dính nhẹ','Bám vào bồn cầu'];
