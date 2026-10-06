import {BrandMascot} from './BrandMascot';
import {Pyramid} from './InteractivePyramid';
export {Pyramid} from './InteractivePyramid';
import {MotionPressable} from './MotionPressable';
import {pyramidLevels,dailyInsights} from './content';
import React, {useEffect, useRef, useState} from 'react';
import {AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Button, Card, Label, Title, palette, s} from './ui';
import {dayAt, shiftDay, streak, goalReviewDue, type AppData} from './domain';

/** One geometric, two-pixel outline family. No legacy screenshot icon assets. */
export function Icon({name, color=palette.ink, size=24}:{name:string;color?:string;size?:number}) {
 const line={position:'absolute' as const,backgroundColor:color,borderRadius:2};
 const box=(left:number,top:number,width:number,height:number,r=3)=><View style={{position:'absolute',left,top,width,height,borderWidth:1.8,borderColor:color,borderRadius:r}}/>;
 const contents:Record<string,React.ReactNode>={
  profile:<>{box(8,2,8,8,8)}{box(4,14,16,9,7)}</>,
  diary:<>{box(3,5,18,17,4)}<View style={[line,{left:3,top:10,width:18,height:2}]}/>{[7,15].map(x=><View key={x} style={[line,{left:x,top:2,width:2,height:6}]}/>)}</>,
  notebook:<>{box(4,3,17,19,3)}<View style={[line,{left:8,top:3,height:19,width:2}]}/><View style={[line,{left:12,top:8,height:2,width:6}]}/></>,
  log:<>{box(3,3,18,18,7)}<View style={[line,{left:7,top:11,height:2,width:10}]}/><View style={[line,{left:11,top:7,height:10,width:2}]}/></>,
  ai:<>{box(2,4,20,15,6)}{[7,12,17].map(x=><View key={x} style={[line,{left:x-1,top:10,height:3,width:3}]}/>)}<View style={[line,{left:6,top:18,width:2,height:5,transform:[{rotate:'25deg'}]}]}/></>,
  trash:<>{box(6,7,12,15,3)}<View style={[line,{left:4,top:5,height:2,width:16}]}/><View style={[line,{left:9,top:2,height:2,width:6}]}/>{[10,14].map(x=><View key={x} style={[line,{left:x,top:11,height:7,width:1.5}]}/>)}</>,
  arrow:<><View style={[line,{left:5,top:11,height:2,width:14}]}/><View style={{position:'absolute',left:11,top:7,width:9,height:9,borderTopWidth:2,borderRightWidth:2,borderColor:color,transform:[{rotate:'45deg'}]}}/></>,
  search:<>{box(3,2,14,14,9)}<View style={[line,{left:16,top:14,height:9,width:2,transform:[{rotate:'-45deg'}]}]}/></>,
  settings:<>{box(3,3,18,18,6)}{box(8,8,8,8,5)}</>,
  mic:<>{box(9,2,6,13,4)}<View style={{position:'absolute',left:5,top:8,width:14,height:11,borderWidth:1.8,borderTopWidth:0,borderColor:color,borderBottomLeftRadius:8,borderBottomRightRadius:8}}/><View style={[line,{left:11,top:19,height:4,width:2}]}/></>,
  keyboard:<>{box(2,5,20,15,3)}{[6,11,16].map(x=><View key={x} style={[line,{left:x,top:10,width:2,height:2}]}/>)}<View style={[line,{left:7,top:15,width:10,height:2}]}/></>,
 };
 return <View accessibilityElementsHidden importantForAccessibility="no" style={{width:size,height:size}}><View style={{width:24,height:24,transform:[{scale:size/24}],transformOrigin:'top left'}}>{contents[name]||contents.ai}</View></View>;
}

export const sectionTints=['#F8F7FB','#F8F7FB','#F8F7FB','#F8F7FB','#F8F7FB'];
export function Eyebrow({children}:{children:React.ReactNode}) {return <Text style={f.eyebrow}>{children}</Text>;}

export function Home({data,signed,onAccount,onProfile,onLog,onPyramid,onHistory,onDemo,onRenew,canDemo,insight,setInsight}:{insight:boolean;setInsight:(v:boolean)=>void;data:AppData;signed:boolean;onAccount:()=>void;onProfile:()=>void;onLog:()=>void;onPyramid:()=>void;onHistory:()=>void;onDemo:()=>void;onRenew:()=>void;canDemo:boolean}) {
 const [interacting,setInteracting]=useState(false),[reduced,setReduced]=useState(false);
 const motion=useRef(new Animated.Value(0)).current;
 useEffect(()=>{void AccessibilityInfo.isReduceMotionEnabled().then(setReduced);const h=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);return()=>h.remove();},[]);
 const insightContent=dailyInsights.length?dailyInsights[Math.floor(Date.parse(dayAt())/86400000)%dailyInsights.length]:null;
 const count=data.records.filter(r=>r.date>=shiftDay(dayAt(),-6)&&r.date<=dayAt()).length;
 const bmi=data.profile.height&&data.profile.weight&&data.profile.height>0&&data.profile.weight>0?(data.profile.weight/(data.profile.height/100)**2).toFixed(1):null;
 const interact=()=>{if(interacting)return;setInteracting(true);Animated.sequence([Animated.timing(motion,{toValue:1,duration:reduced?0:180,useNativeDriver:true}),Animated.timing(motion,{toValue:0,duration:reduced?0:240,useNativeDriver:true})]).start(()=>{setInteracting(false);setInsight(true);});};
 return <>
  <View style={[s.row,{justifyContent:'space-between'}]}><View style={{flex:1}}><Eyebrow>MỘT NGÀY CÙNG SMARTMEAL</Eyebrow><Text style={f.display}>{signed?`Chào ${data.profile.name||'bạn'}.`:'Ăn ngon,\nsống nhẹ nhàng.'}</Text></View>{signed&&<Pressable accessibilityLabel="Thông tin tài khoản" onPress={onProfile} style={f.roundIcon}><Icon name="profile"/></Pressable>}</View>
  {!signed&&<Button title="Đăng nhập/Đăng ký →" onPress={onAccount}/>}
  <Pyramid onOpen={onPyramid}/>
  <Card><Eyebrow>MỤC TIÊU CỦA BẠN</Eyebrow><Title>{data.profile.goal||'Bắt đầu từ điều bạn cần'}</Title><Label small>{signed?'Mục tiêu và khẩu vị giúp chuẩn bị điều kiện tạo món.':'Đăng nhập để lưu lựa chọn và theo dõi những gì bạn ghi.'}</Label>{signed&&(!data.profile.goal||!data.profile.taste)?<Button title="Tiếp tục" onPress={onProfile}/>:signed?<View style={s.row}><Button title={goalReviewDue(data)?"Đến lịch xem lại mục tiêu":"Xem lại mục tiêu"} quiet={!goalReviewDue(data)} onPress={onRenew}/><Button title="Lịch sử" quiet onPress={onHistory}/></View>:null}</Card>
  <View style={[s.row,{alignItems:'stretch'}]}><Card style={{flex:1,backgroundColor:'#F1EFF6'}}><Eyebrow>BMI</Eyebrow><Text style={f.metric}>{bmi||'—'}</Text><Label small>{bmi?'Tính từ hồ sơ đã nhập':'Chưa có đủ chiều cao và cân nặng'}</Label></Card><Card style={{flex:1,backgroundColor:'#EDEAF3'}}><Eyebrow>CHUỖI SỬ DỤNG</Eyebrow><Text style={f.metric}>{streak(data.streakDays,dayAt())}<Text style={{fontSize:14}}> ngày</Text></Text><View style={{flexDirection:'row',gap:4}}>{Array.from({length:7},(_,i)=>{const d=shiftDay(dayAt(),i-6),earned=data.streakDays.includes(d);return <View key={d} accessibilityLabel={`${d}: ${earned?'đã sử dụng':'chưa ghi nhận'}`} style={{flex:1,height:20,borderRadius:6,backgroundColor:earned?palette.primary:'#CFD9E5',alignItems:'center'}}><Text style={{color:'white',fontSize:12}}>{earned?'✓':''}</Text></View>;})}</View></Card></View>
  <Pressable accessibilityRole="button" accessibilityLabel="Đi tiêu trong tuần, mở Ghi lại" onPress={onLog}><Card style={{backgroundColor:'#ECE9F7'}}><View style={s.row}><View style={{flex:1}}><Eyebrow>GHI NHẬN CƠ THỂ</Eyebrow><Title>{count?`${count} bản ghi trong 7 ngày`:'Chưa ghi nhận trong 7 ngày'}</Title><Label small>Thiếu bản ghi không có nghĩa là không đi tiêu.</Label></View><Icon name="arrow"/></View></Card></Pressable>
  <Card><Eyebrow>GÓC KIẾN THỨC MỖI NGÀY</Eyebrow><View style={s.row}><Pressable accessibilityRole="button" accessibilityLabel="Chạm Mầm để mở kiến thức" onPress={interact}><Animated.View style={{width:84,height:108,borderRadius:34,backgroundColor:'transparent',justifyContent:'center',alignItems:'center',transform:[{translateY:motion.interpolate({inputRange:[0,1],outputRange:[0,-8]})},{rotate:motion.interpolate({inputRange:[0,1],outputRange:['0deg','5deg']})}]}}><BrandMascot size={100}/></Animated.View></Pressable><View style={{flex:1}}><Title>{insight?(insightContent?.title||'Kiến thức hôm nay'):'Một ý nhỏ, mỗi ngày'}</Title><Label small>{insight?(insightContent?.body||'Nội dung kiểm chứng đang chờ bổ sung.'):'Chạm Mầm để mở góc kiến thức.'}</Label></View></View></Card>
  {canDemo&&<Button title="Trải nghiệm bằng dữ liệu mẫu" quiet onPress={onDemo}/>}
 </>;
}
export const f=StyleSheet.create({display:{fontSize:34,lineHeight:42,fontWeight:'600',letterSpacing:-1.3,color:palette.ink},metric:{fontSize:34,fontWeight:'600',letterSpacing:-1,color:palette.ink},eyebrow:{fontSize:10,lineHeight:16,letterSpacing:1.4,fontWeight:'600',color:palette.primary},pyramid:{padding:26,borderRadius:28,overflow:'hidden',gap:9},glass:{padding:16,borderRadius:20,backgroundColor:'rgba(255,255,255,.88)',borderWidth:1,borderColor:'rgba(255,255,255,.85)',gap:8},roundIcon:{width:48,height:48,borderRadius:18,backgroundColor:'#EEE9F5',alignItems:'center',justifyContent:'center'}});
