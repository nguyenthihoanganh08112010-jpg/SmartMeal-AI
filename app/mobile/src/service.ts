import 'react-native-url-polyfill/auto';
import {Platform} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import type {AppData,Recipe,Recommendation} from './domain';
const url=process.env.EXPO_PUBLIC_SUPABASE_URL;
const key=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const connected=!!url&&!!key;
// Native sessions use OS-protected storage. Web preview sessions stay in memory.
const memory=new Map<string,string>();
const storage={getItem:async(k:string)=>Platform.OS==='web'?memory.get(k)||null:SecureStore.getItemAsync(k),setItem:async(k:string,v:string)=>{if(Platform.OS==='web')memory.set(k,v);else await SecureStore.setItemAsync(k,v);},removeItem:async(k:string)=>{if(Platform.OS==='web')memory.delete(k);else await SecureStore.deleteItemAsync(k);}};
export const supabase=connected?createClient(url!,key!,{auth:{storage,autoRefreshToken:true,persistSession:true,detectSessionInUrl:false}}):null;
const client=()=>{if(!supabase)throw new Error('Chưa kết nối máy chủ. Bạn có thể trải nghiệm bằng dữ liệu mẫu.');return supabase;};
export function setSession(_value:string){/* Supabase Auth owns sessions. */}
function checked<T extends {data?:unknown;error:any}>(result:T):T['data']{if(result.error)throw new Error(result.error.message||'Không thể lưu. Dữ liệu đang nhập được giữ lại.');return result.data;}
async function invoke<T>(name:string,body:Record<string,unknown>|FormData):Promise<T>{const result=await client().functions.invoke(name,{body});if(result.error){let message=result.error.message;try{const detail=await result.error.context?.json?.();if(typeof detail?.message==='string')message=detail.message;}catch{}throw new Error(message||'Chưa kết nối được dịch vụ.');}return result.data as T;}
async function resolveImages(recipes:Recipe[]){return Promise.all(recipes.map(async r=>{if(r.image.startsWith('http'))return r;const signed=checked(await client().storage.from('meal-images').createSignedUrl(r.image,3600));return {...r,imageId:r.imageId||r.image,image:signed!.signedUrl};}));}
type AccountSnapshot={data:AppData;revision:number;recipes:Recipe[];recommendations:Recommendation[];offline?:boolean};
// Account-scoped read cache only. No deferred writes or cross-account fallback.
const cacheKey=(id:string)=>'smartmeal-account-read-v2:'+id;
async function cacheSnapshot(result:AccountSnapshot){try{const session=checked(await client().auth.getSession());if(session.session)await AsyncStorage.setItem(cacheKey(session.session.user.id),JSON.stringify(result));}catch{/* Cache failure must not turn an acknowledged server operation into a failed save. */}}
async function patchCache(patch:(snapshot:AccountSnapshot)=>AccountSnapshot){try{const session=checked(await client().auth.getSession());if(!session.session)return;const key=cacheKey(session.session.user.id),old=await AsyncStorage.getItem(key);if(old)await AsyncStorage.setItem(key,JSON.stringify(patch(JSON.parse(old))));}catch{/* The authoritative operation has already succeeded. */}}
async function load():Promise<AccountSnapshot>{const result=checked(await client().rpc('smartmeal_load')) as AccountSnapshot;result.recipes=await resolveImages(result.recipes);await cacheSnapshot(result);return result;}
export const service={
 chat:async(message:string,conditions:unknown,history:unknown[])=>invoke<{reply:string;mealRequest:boolean;clear:boolean;ingredients:string|null;goal:string|null;taste:string|null;mealType:string|null;time:number|null}>('conversation',{message,conditions,history}),
 login:async(email:string,password:string)=>{checked(await client().auth.signInWithPassword({email,password}));return {token:'',...await load()};},
 signup:async(email:string,password:string)=>checked(await client().auth.signUp({email,password})),
 verify:async(email:string,token:string)=>checked(await client().auth.verifyOtp({email,token,type:'signup'})),
 reset:async(email:string)=>checked(await client().auth.resetPasswordForEmail(email)),
 recover:async(email:string,token:string,password:string)=>{checked(await client().auth.verifyOtp({email,token,type:'recovery'}));return checked(await client().auth.updateUser({password}));},
 restore:async()=>{const session=checked(await client().auth.getSession());if(!session.session)return null;try{return await load();}catch(error){if(!/network|fetch|offline|connection|mạng/i.test((error as Error).message))throw error;const cached=await AsyncStorage.getItem(cacheKey(session.session.user.id));if(cached)return {...JSON.parse(cached) as AccountSnapshot,offline:true};throw error;}},
 load,
 save:async(data:AppData,revision:number)=>{const result=checked(await client().rpc('smartmeal_save',{new_data:data,expected_revision:revision})) as {revision:number};await patchCache(old=>({...old,data,revision:result.revision}));return result;},
  generate:async(conditions:unknown,useJournal:boolean)=>{const result=await invoke<{recipes:Recipe[];recommendations:Recommendation[]}>('generate-meal',{conditions,useJournal});result.recipes=await resolveImages(result.recipes);await patchCache(old=>({...old,recipes:[...old.recipes.filter(p=>!result.recipes.some(r=>r.id===p.id)),...result.recipes],recommendations:[...old.recommendations,...result.recommendations]}));return result;},
 transcribe:async(uri:string)=>{const form=new FormData();if(Platform.OS==='web')form.append('audio',await (await fetch(uri)).blob(),'voice.webm');else form.append('audio',{uri,name:'voice.m4a',type:'audio/mp4'} as any);const result=await invoke<{text:string}>('transcribe',form);return result.text;},
 requestDeletion:async()=>checked(await client().rpc('smartmeal_request_deletion')),
 logout:async()=>{const session=checked(await client().auth.getSession());const result=checked(await client().auth.signOut());if(session.session)await AsyncStorage.removeItem(cacheKey(session.session.user.id));return result;},
};
