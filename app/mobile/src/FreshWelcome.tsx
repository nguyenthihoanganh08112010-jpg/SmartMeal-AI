import React from 'react';
import {View,Text,Image,Pressable} from 'react-native';
import {Label,palette,s} from './ui';
import {Eyebrow,Icon,f} from './Fresh';
export function Welcome({persona,signed,onAccount,onSuggestion}:{persona:{name:string;image:any};signed:boolean;onAccount:(mode:string)=>void;onSuggestion:(text:string)=>void}){
 return <View style={{gap:22,paddingVertical:12}}>
  <View style={[s.row,{alignItems:'center'}]}><View style={{flex:1,gap:10}}><Eyebrow>BẾP NHỎ · Ý TƯỞNG MỚI</Eyebrow><Text style={f.display}>Hôm nay,{ '\n'}mình nấu gì?</Text></View><Image source={persona.image} style={{width:92,height:112,borderRadius:32,resizeMode:'cover'}}/></View>
  <Label>Kể {persona.name} nghe nguyên liệu bạn đang có. Mình cùng tìm món phù hợp với thời gian và lựa chọn của bạn.</Label>
  <View style={{gap:10}}>{['Gợi ý bữa ăn theo nguyên liệu tôi có','Giúp tôi chọn một combo bữa ăn'].map((text,i)=><Pressable key={text} accessibilityRole="button" onPress={()=>onSuggestion(text)} style={({pressed})=>[f.glass,s.row,{padding:19,opacity:pressed?0.6:1}]}><View style={{width:30,height:30,borderRadius:10,backgroundColor:i?'#D8E8F1':'#DEECCF',justifyContent:'center',alignItems:'center'}}><Text style={{fontWeight:'800',color:palette.ink}}>0{i+1}</Text></View><Text style={{flex:1,fontSize:15,lineHeight:22,fontWeight:'600',color:palette.ink}}>{text}</Text><Icon name="arrow" size={20}/></Pressable>)}</View>
  <View style={[s.row,{justifyContent:'center'}]}>{(signed?['Đăng xuất']:['Đăng nhập','Đăng ký']).map(mode=><Pressable key={mode} accessibilityRole="button" onPress={()=>onAccount(mode)} style={{padding:12}}><Text style={{fontSize:13,fontWeight:'600',color:palette.primary}}>{mode}</Text></Pressable>)}</View>
 </View>;
}
