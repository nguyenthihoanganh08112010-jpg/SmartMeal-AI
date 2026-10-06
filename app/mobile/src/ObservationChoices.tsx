import React from 'react';
import {View,Text,Pressable,ScrollView} from 'react-native';
import {SHAPES,COLORS} from './domain';
import {palette} from './ui';
export const stoolColors=['#E4E7ED','#F4C823','#BD7D38','#825022','#4B281A','#222732','#21141A'];
export function StoolGlyph({shape,size=42}:{shape?:number;size?:number}){
 const n=shape||0,color='#9C733E';
 return <View accessibilityLabel={shape?SHAPES[shape-1]:'Chưa có hình dạng'} style={{width:size,height:size,alignItems:'center',justifyContent:'center'}}>{n===0?<Text style={{color:palette.muted}}>—</Text>:n===1||n===5||n===6?<View style={{width:36,height:30}}>{Array.from({length:n===1?4:n===5?5:8},(_,i)=><View key={i} style={{position:'absolute',left:(i*11)%27,top:Math.floor(i/3)*9,width:n===6?12:9,height:n===6?10:9,borderRadius:n===5?2:6,backgroundColor:color,transform:[{rotate:`${i*31}deg`}]}}/>)}</View>:n===7?<View style={{width:34,height:13,borderRadius:20,backgroundColor:color,transform:[{rotate:'-8deg'}]}}/>:<View style={{width:34,height:14,borderRadius:9,backgroundColor:color,flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>{n!==4&&[0,1,2,3].map(i=><View key={i} style={{width:n===2?7:1,height:n===2?15:9,borderRadius:4,backgroundColor:n===2?'#AE8752':'#D4B887',transform:[{rotate:'-12deg'}]}}/>)}</View>}</View>;
}
export function ObservationChoices({kind,value,onChange}:{kind:'shape'|'color';value?:number|string;onChange:(v:any)=>void}){
 const items=kind==='shape'?SHAPES:COLORS;
 return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,paddingVertical:6}}>{items.map((label,i)=>{const v=kind==='shape'?i+1:label,selected=value===v;return <Pressable key={label} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{selected}} onPress={()=>onChange(selected?undefined:v)} style={{width:104,height:104,padding:8,borderRadius:18,borderWidth:2,borderColor:selected?palette.primary:'transparent',backgroundColor:selected?'#EAE0F4':'#F6F3FA',alignItems:'center',justifyContent:'center',gap:5}}>{kind==='shape'?<StoolGlyph shape={i+1}/>:<View style={{width:38,height:38,borderRadius:13,backgroundColor:stoolColors[i],borderWidth:1,borderColor:'#D0C9D7'}}/>}<Text style={{fontSize:11,lineHeight:15,textAlign:'center',color:palette.ink}}>{kind==='shape'?`${i+1}. `:''}{label}</Text>{selected&&<Text style={{position:'absolute',top:3,right:7,color:palette.primary,fontWeight:'900'}}>✓</Text>}</Pressable>;})}</ScrollView>;
}
