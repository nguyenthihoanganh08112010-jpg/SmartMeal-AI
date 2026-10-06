import React,{useEffect,useRef} from 'react';
import {AccessibilityInfo,Animated,Pressable,type PressableProps,type ViewStyle} from 'react-native';

/** Small physical response; reduced motion switches instantly without scaling. */
export function MotionPressable({children,style,...props}:Omit<PressableProps,'children'|'style'> & {children:React.ReactNode;style?:ViewStyle|ViewStyle[]}){
 const scale=useRef(new Animated.Value(1)).current;
 const reduced=useRef(true);
 useEffect(()=>{void AccessibilityInfo.isReduceMotionEnabled().then(v=>{reduced.current=v;});const subscription=AccessibilityInfo.addEventListener('reduceMotionChanged',v=>{reduced.current=v;if(v){scale.stopAnimation();scale.setValue(1);}});return()=>{subscription.remove();scale.stopAnimation();};},[scale]);
 const animate=(pressed:boolean)=>{scale.stopAnimation();if(reduced.current){scale.setValue(1);return;}Animated.spring(scale,{toValue:pressed?0.975:1,stiffness:290,damping:23,mass:0.8,useNativeDriver:true}).start();};
 return <Animated.View style={{transform:[{scale}]}}><Pressable {...props} style={style} onPressIn={e=>{animate(true);props.onPressIn?.(e);}} onPressOut={e=>{animate(false);props.onPressOut?.(e);}}>{children}</Pressable></Animated.View>;
}
