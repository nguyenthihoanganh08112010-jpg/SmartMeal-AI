import {FoodImage} from './FoodImage';
import React from 'react';
import {Image,Pressable,Text,View} from 'react-native';
import {verifiedNutrients,type Recipe} from './domain';
import {Card,Label,Title,palette,s} from './ui';
import {Eyebrow,Icon,f} from './Fresh';
export function RecipeDetail({recipe,catalog,imageFor,onComponent}:{recipe:Recipe;catalog:Recipe[];imageFor:(r:Recipe)=>any;onComponent:(id:string)=>void}){
 return <><FoodImage source={imageFor(recipe)} style={{width:'100%',aspectRatio:1.15,borderRadius:32,resizeMode:'cover'}}/><Eyebrow>{recipe.kind==='combo'?'MỘT BỮA CÙNG NHAU':'MÓN ĐƠN'} · {recipe.minutes} PHÚT</Eyebrow><Text style={f.display}>{recipe.name}</Text><Label>{recipe.description}</Label>
  <Card style={{backgroundColor:'#EAF0DE'}}><Title>Thông tin có nguồn</Title><Label>{verifiedNutrients(recipe).length?verifiedNutrients(recipe).join(' · '):'Chưa có dữ liệu dinh dưỡng được kiểm chứng.'}</Label></Card>
  {recipe.kind==='combo'?<><Label>Loại bữa: {recipe.mealType||'Chưa có dữ liệu'}</Label><Title>Các món trong combo</Title>{recipe.components?.map(id=>{const item=catalog.find(p=>p.id===id);return item?<Pressable key={id} accessibilityRole="button" accessibilityLabel={'Xem '+item.name} onPress={()=>onComponent(id)}><Card><View style={s.row}><FoodImage source={imageFor(item)} style={{width:64,height:64,borderRadius:18}}/><View style={{flex:1}}><Label>{item.name}</Label></View><Icon name="arrow"/></View></Card></Pressable>:null;})}</>:<><Card><Eyebrow>CHUẨN BỊ</Eyebrow><Title>Nguyên liệu chính</Title>{recipe.ingredients.map(i=><Label key={i}>{i}</Label>)}<View style={s.divider}/><Title>Gia vị</Title><Label>{recipe.seasonings.join(' · ')||'Chưa có dữ liệu.'}</Label></Card><Card><Title>Cùng bắt tay vào làm</Title>{recipe.steps.map((step,index)=><View key={index} style={[s.row,{alignItems:'flex-start',marginVertical:6}]}><View style={{width:32,height:32,borderRadius:11,backgroundColor:palette.green,alignItems:'center',justifyContent:'center'}}><Text style={{color:palette.ink,fontWeight:'800'}}>{index+1}</Text></View><View style={{flex:1}}><Label>{step}</Label></View></View>)}</Card><Card><Title>Thay thế gia vị</Title><Label>{recipe.seasoningSubstitutions?.join(' · ')||'Chưa có phương án thay thế được kiểm chứng.'}</Label></Card></>}
 </>;
}
