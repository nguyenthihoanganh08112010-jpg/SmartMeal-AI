import React,{useEffect,useRef,useState} from 'react';
import {Animated,Image,PanResponder,Pressable,Text,View} from 'react-native';
import {personas} from './personas';
import {palette} from './ui';

/** Preview motion is independent of the persisted active persona. */
export function PersonaCarousel({preview,saved,onPreview,reducedMotion}:{preview:string;saved:string;onPreview:(id:string)=>void;reducedMotion:boolean}){
 const [width,setWidth]=useState(320);
 const index=Math.max(0,personas.findIndex(p=>p.id===preview));
 const card=width*.74,step=card+18,height=card*1.2;
 const position=useRef(new Animated.Value(index)).current;
 const latest=useRef({index,step,onPreview,reducedMotion});latest.current={index,step,onPreview,reducedMotion};
 const origin=useRef(index);
 const settle=(next:number)=>{const v=latest.current;if(v.reducedMotion)position.setValue(next);else Animated.spring(position,{toValue:next,stiffness:190,damping:24,mass:0.95,useNativeDriver:false}).start();};
 useEffect(()=>{settle(index);},[index,reducedMotion]);
 useEffect(()=>()=>position.stopAnimation(),[position]);
 const responder=useRef(PanResponder.create({
  onMoveShouldSetPanResponder:(_,g)=>Math.abs(g.dx)>8&&Math.abs(g.dx)>Math.abs(g.dy)*1.3,
  onPanResponderGrant:()=>{position.stopAnimation();origin.current=latest.current.index;},
  onPanResponderMove:(_,g)=>{const raw=origin.current-g.dx/latest.current.step,last=personas.length-1;position.setValue(raw<0?raw*.22:raw>last?last+(raw-last)*.22:raw);},
  onPanResponderRelease:(_,g)=>{const v=latest.current;const advance=Math.abs(g.dx)>v.step*.18||Math.abs(g.vx)>.45;const next=Math.max(0,Math.min(personas.length-1,origin.current+(advance?(g.dx<0?1:-1):0)));v.onPreview(personas[next].id);settle(next);},
  onPanResponderTerminate:()=>settle(latest.current.index),
 })).current;
 return <View style={{gap:12}}>
  <View onLayout={e=>setWidth(e.nativeEvent.layout.width)} {...responder.panHandlers} style={{height:height+52,overflow:'hidden',marginHorizontal:-20}}>
   {personas.map((p,i)=><Animated.View key={p.id} style={{position:'absolute',left:(width-card)/2,top:14,width:card,height,zIndex:i===index?2:1,transform:[{translateX:position.interpolate({inputRange:[i-1,i,i+1],outputRange:[step,0,-step]})},{translateY:position.interpolate({inputRange:[i-1,i,i+1],outputRange:[28,0,28],extrapolate:'clamp'})},{rotate:position.interpolate({inputRange:[i-1,i,i+1],outputRange:['9deg','0deg','-9deg'],extrapolate:'clamp'})},{scale:position.interpolate({inputRange:[i-1,i,i+1],outputRange:[.88,1,.88],extrapolate:'clamp'})}]}}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Xem ${p.name}${p.id===saved?', nhân vật đang dùng':''}`} accessibilityState={{selected:p.id===preview}} onPress={()=>onPreview(p.id)} style={{flex:1,padding:9,borderRadius:28,backgroundColor:'white',boxShadow:'0px 12px 26px rgba(70,45,95,.08)'}}>
     <View style={{flex:1,borderRadius:20,overflow:'hidden',backgroundColor:p.colors[1]}}><Image source={p.image} style={{width:'100%',height:'100%',resizeMode:'contain'}}/>
      {p.id===saved&&<View accessibilityLabel="Nhân vật đã lưu" style={{position:'absolute',bottom:14,alignSelf:'center',width:46,height:46,borderRadius:23,backgroundColor:'white',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:29,fontWeight:'900',color:palette.primary}}>✓</Text></View>}
     </View>
    </Pressable>
   </Animated.View>)}
  </View>
  <View style={{flexDirection:'row',justifyContent:'center'}}>{personas.map((p,i)=><Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Xem ${p.name}`} accessibilityState={{selected:p.id===preview}} onPress={()=>onPreview(p.id)} style={{minWidth:44,height:44,alignItems:'center',justifyContent:'center'}}><Animated.View style={{height:8,borderRadius:4,backgroundColor:p.id===preview?palette.primary:'#DCD5E8',width:position.interpolate({inputRange:[i-1,i,i+1],outputRange:[8,26,8],extrapolate:'clamp'})}}/></Pressable>)}</View>
 </View>;
}
