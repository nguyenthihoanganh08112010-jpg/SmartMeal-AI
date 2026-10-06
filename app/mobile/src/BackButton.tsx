import React from 'react';
import {Pressable,View} from 'react-native';
import {palette} from './ui';
export function BackButton({onPress}:{onPress:()=>void}){return <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={onPress} style={{width:48,height:48,alignItems:'center',justifyContent:'center'}}><View style={{width:17,height:17,borderLeftWidth:4,borderBottomWidth:4,borderColor:palette.primary,transform:[{rotate:'45deg'}]}}/></Pressable>;}
