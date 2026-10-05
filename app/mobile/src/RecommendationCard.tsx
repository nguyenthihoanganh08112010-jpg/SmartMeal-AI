import React from 'react';
import {Pressable,View} from 'react-native';
import {type Recipe,verifiedNutrients} from './domain';
import {Button,Card,Label,Title,palette,s} from './ui';
import {FoodImage} from './FoodImage';
import {Eyebrow,Icon} from './Fresh';
export function RecommendationCard({recipe,group,exceeded,expanded,selected,saved,imageFor,onOpen,onExpand,onSelect,onSave,onComponent,catalog}:{recipe:Recipe;group:string;exceeded:number;expanded:boolean;selected:boolean;saved:boolean;imageFor:(p:Recipe)=>any;onOpen:()=>void;onExpand:()=>void;onSelect:()=>void;onSave:()=>void;onComponent:(id:string)=>void;catalog:Recipe[]}){
 return <Card style={{padding:14,gap:14}}><Pressable accessibilityRole="button" accessibilityLabel={'Xem '+recipe.name} onPress={onOpen}><FoodImage source={imageFor(recipe)} style={{width:'100%',height:200,borderRadius:20,resizeMode:'cover'}}/></Pressable><Eyebrow>{recipe.kind==='combo'?'COMBO':'MÓN ĐƠN'} · {recipe.minutes} PHÚT</Eyebrow><Pressable accessibilityRole="button" accessibilityState={{expanded}} accessibilityLabel={(expanded?'Thu gọn ':'Mở rộng ')+recipe.name} onPress={onExpand}><View style={s.row}><View style={{flex:1}}><Title>{recipe.name}</Title></View><View style={{transform:[{rotate:expanded?'-90deg':'90deg'}]}}><Icon name="arrow"/></View></View></Pressable><Label small>{group}{exceeded?` · vượt ${exceeded} phút`:''}</Label>
  {expanded&&<View style={{gap:10,borderTopWidth:1,borderColor:'#E7ECE4',paddingTop:14}}><Label>{verifiedNutrients(recipe).join(' · ')||'Chưa có dữ liệu dinh dưỡng được kiểm chứng.'}</Label><Label>Nguyên liệu chính: {recipe.ingredients.join(', ')}</Label><Label>Gia vị: {recipe.seasonings.join(', ')||'Chưa có dữ liệu'}</Label>{recipe.steps.map((step,i)=><Label key={i}>{i+1}. {step}</Label>)}{recipe.kind==='combo'&&recipe.components?.map(id=><Button key={id} title={catalog.find(x=>x.id===id)?.name||'Xem món thành phần'} quiet onPress={()=>onComponent(id)}/>)}<Label small>{recipe.seasoningSubstitutions?.join(' · ')||'Chưa có thay thế gia vị được kiểm chứng.'}</Label></View>}
  <Button title={selected?'✓ Đã chọn':'Chọn món đã ăn'} quiet={!selected} onPress={onSelect}/><Button title={saved?'Đã lưu':'Lưu vào Sổ tay'} quiet disabled={saved} onPress={onSave}/>
 </Card>;
}
