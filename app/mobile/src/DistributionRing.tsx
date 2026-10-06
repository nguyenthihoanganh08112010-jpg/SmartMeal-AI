import React from 'react';
import {View,Text} from 'react-native';
import {palette} from './ui';
const colors=['#79619E','#AD93C9','#C6B6DB','#625278','#B8A8C7','#918395','#DED4E9'];
export function DistributionRing({items}:{items:{label:string;count:number;percent:number}[]}){
 const total=items.reduce((sum,x)=>sum+x.count,0);
 if(!total)return null;
 return <View style={{gap:14,alignItems:'center'}}><View accessible accessibilityLabel={items.map(x=>`${x.label}: ${x.count}, ${Math.round(x.percent)} phần trăm`).join('; ')} style={{width:150,height:150}}>{Array.from({length:180},(_,i)=>{const fraction=(i+.5)/180;let cumulative=0;const index=items.findIndex(x=>{cumulative+=x.count/total;return fraction<=cumulative;});const angle=i*2*Math.PI/180;return <View key={i} style={{position:'absolute',left:73.5+56*Math.sin(angle),top:58-56*Math.cos(angle),width:3,height:34,backgroundColor:colors[Math.max(0,index)%colors.length],transform:[{rotate:`${i*2}deg`}]}}/>;})}<View style={{position:'absolute',top:39,left:39,width:72,height:72,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:24,fontWeight:'800',color:palette.ink}}>{total}</Text><Text style={{fontSize:10,color:palette.muted}}>bản ghi</Text></View></View><View style={{width:'100%',gap:9}}>{items.map((item,i)=><View key={item.label} style={{flexDirection:'row',gap:8,alignItems:'center'}}><View style={{width:10,height:10,borderRadius:5,backgroundColor:colors[i%colors.length]}}/><Text style={{flex:1,color:palette.ink,fontSize:13}}>{item.label}</Text><Text style={{fontSize:12,color:palette.muted}}>{item.count} · {Math.round(item.percent)}%</Text></View>)}</View></View>;
}
