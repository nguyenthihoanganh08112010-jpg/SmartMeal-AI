import React from 'react';
import {View,Text} from 'react-native';
import {palette} from './ui';
const ticks=[15,16,18.5,25,30,35,40];
export function BmiScale({value}:{value:number|null}){
 const valid=value!==null&&Number.isFinite(value)&&value>0;
 const point=valid?Math.max(0,Math.min(1,(value!-15)/25)):0;
 return <View style={{gap:8}}><Text style={{fontSize:11,color:palette.muted}}>BMI (kg/m²)</Text><Text style={{fontSize:42,fontWeight:'800',color:palette.ink}}>{valid?value!.toFixed(1):'—'}</Text><View style={{paddingTop:20,paddingBottom:20}}>{valid&&<Text accessibilityLabel={`BMI ${value}`} style={{position:'absolute',top:0,left:`${point*100}%`,marginLeft:-5,color:palette.primary,fontSize:17,fontWeight:'900'}}>↓</Text>}<View style={{height:10,flexDirection:'row',gap:2}}>{['#577FBB','#74AFCD','#A7C698','#E4CD80','#DFAD89','#CA899D'].map((color,i)=><View key={color} style={{flex:ticks[i+1]-ticks[i],backgroundColor:color,borderRadius:6,borderWidth:1,borderColor:'#504260'}}/>)}</View>{ticks.map((t,i)=><Text key={t} style={{position:'absolute',top:i<3?32:43,left:`${(t-15)/25*100}%`,marginLeft:i===6?-12:i===0?0:-6,fontSize:8,color:palette.muted}}>{t}</Text>)}</View>{!valid&&<Text style={{fontSize:11,color:palette.muted}}>Chưa có đủ dữ liệu hồ sơ.</Text>}</View>;
}
