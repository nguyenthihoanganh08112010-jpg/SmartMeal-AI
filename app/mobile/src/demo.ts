import {dayAt,shiftDay,emptyData,type Recipe,type Recommendation} from './domain';
export const recipes:Recipe[]=[
 {id:'chicken',name:'Gà cùng rau củ',description:'Ví dụ bố cục món đơn',category:'Thịt',image:'chicken',kind:'dish',ingredients:['Thịt gà','Cà rốt'],seasonings:[],steps:['Nội dung công thức chờ nguồn được kiểm chứng.'],nutrients:[],minutes:25},
 {id:'veg',name:'Rau xanh',description:'Ví dụ bố cục món rau',category:'Rau',image:'veg',kind:'dish',ingredients:['Rau xanh'],seasonings:[],steps:['Nội dung công thức chờ nguồn được kiểm chứng.'],nutrients:[],minutes:15},
 {id:'bowl',name:'Bữa ăn cùng nhau',description:'Ví dụ bố cục combo',category:'Combo',image:'bowl',kind:'combo',ingredients:['Thịt gà','Cà rốt','Rau xanh'],seasonings:[],steps:[],nutrients:[],components:['chicken','veg'],minutes:40},
 {id:'berry',name:'Trái cây',description:'Ví dụ bố cục ăn nhẹ',category:'Hoa quả',image:'berry',kind:'dish',ingredients:['Trái cây'],seasonings:[],steps:['Rửa sạch trước khi dùng. Nội dung mẫu.'],nutrients:[],minutes:5}
];
export const foodImages:Record<string,any>={chicken:require('../assets/food-chicken.png'),veg:require('../assets/food-veg.png'),bowl:require('../assets/food-bowl.png'),berry:require('../assets/food-berry.png')};
export function recommendations():Recommendation[]{return recipes.map((r,i)=>({id:'sample-'+r.id,recipeId:r.id,generatedAt:dayAt()+'T11:00:00+07:00',mealType:i===3?'Ăn nhẹ':'Bữa chính',imageReady:true}));}
export function demoData(){const data=emptyData();data.profile={name:'Bạn trải nghiệm',goal:'Khám phá bữa ăn đa dạng (mẫu)',taste:'Thanh đạm',height:165,weight:55};data.firstUse=shiftDay(dayAt(),-20);data.saved=recipes.map(r=>r.id);data.streakDays=[0,-1,-2,-3].map(n=>shiftDay(dayAt(),n));data.records=[0,1,2,3,4,5,7,8,9,10,11,12,13,13].map((n,i)=>({id:'sample-record-'+i,date:shiftDay(dayAt(),-n),time:i%2?'08:30':'17:15',duration:3+i%8,...(i%3?{shape:4,color:'Nâu',feeling:'Bình thường'}:{})}));return data;}
