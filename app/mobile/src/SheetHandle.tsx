import React,{useRef} from 'react';
import {View,PanResponder,Platform} from 'react-native';
export function SheetHandle({onDismiss}:{onDismiss:()=>void}){
 const start=useRef<number|null>(null);const dismiss=useRef(onDismiss);dismiss.current=onDismiss;
 const responder=useRef(PanResponder.create({onStartShouldSetPanResponder:()=>true,onMoveShouldSetPanResponder:(_,g)=>g.dy>5,onPanResponderRelease:(_,g)=>{if(g.dy>35)dismiss.current();}})).current;
 const bar=<View style={{width:110,height:6,borderRadius:3,backgroundColor:'#39452D'}}/>;
 if(Platform.OS==='web')return <div aria-label="Kéo xuống để hủy thay đổi tạm" style={{alignSelf:'center',width:180,height:32,display:'flex',justifyContent:'center',alignItems:'center',touchAction:'none',userSelect:'none',cursor:'grab'}} onPointerDown={e=>{start.current=e.clientY;e.currentTarget.setPointerCapture(e.pointerId);e.preventDefault();}} onPointerUp={e=>{if(start.current!==null&&e.clientY-start.current>35)dismiss.current();start.current=null;}} onPointerCancel={()=>{start.current=null;}}>{bar}</div>;
 return <View {...responder.panHandlers} accessibilityLabel="Kéo xuống để hủy thay đổi tạm" style={{alignSelf:'center',width:180,height:32,alignItems:'center',justifyContent:'center'}}>{bar}</View>;
}
