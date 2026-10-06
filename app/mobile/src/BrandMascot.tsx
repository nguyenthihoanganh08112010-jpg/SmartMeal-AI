import React from 'react';
import {Image} from 'react-native';
export const brandMascot=require('../assets/brand/sprout-3d.png');
export function BrandMascot({size=120}:{size?:number}){return <Image accessibilityLabel="Linh vật Mầm" source={brandMascot} resizeMode="contain" style={{width:size,height:size}}/>;}
