import React,{useEffect,useState} from 'react';
import {Image,StyleSheet,Text,View,type ImageSourcePropType,type ImageStyle,type StyleProp,type ViewStyle} from 'react-native';
import {palette} from './ui';
export function FoodImage({source,style}:{source:ImageSourcePropType;style:StyleProp<ImageStyle>}){
 const [failed,setFailed]=useState(false);
 const key=JSON.stringify(source);useEffect(()=>setFailed(false),[key]);
 const flat=StyleSheet.flatten(style)||{};
 return <View style={[flat as ViewStyle,{overflow:'hidden',backgroundColor:'#EDF0E8'}]}>{failed?<View style={{flex:1,alignItems:'center',justifyContent:'center',padding:12}}><Text style={{color:palette.muted,fontSize:12,textAlign:'center'}}>Chưa tải được ảnh. Kết nối lại để làm mới dữ liệu.</Text></View>:<Image source={source} style={[StyleSheet.absoluteFill,{resizeMode:flat.resizeMode||'cover'}]} onError={()=>setFailed(true)}/>}</View>;
}
