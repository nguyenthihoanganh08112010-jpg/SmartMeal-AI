import {useEffect,useRef,useState} from 'react';
import * as Speech from 'expo-speech';
/** Android has no native pause: stop and resume at the last spoken word boundary. */
export function useReader(){
 const [active,setActive]=useState<string|null>(null),[paused,setPaused]=useState(false);
 const cursor=useRef(0),run=useRef(0),text=useRef(''),id=useRef<string|null>(null),lock=useRef(false);
 const [rate,setRate]=useState(1),[voice,setVoice]=useState<string|undefined>(),[voices,setVoices]=useState<Speech.Voice[]>([]);
 useEffect(()=>{void Speech.getAvailableVoicesAsync().then(v=>setVoices(v.filter(v=>v.language.startsWith('vi')))).catch(()=>{});return()=>{run.current++;void Speech.stop();};},[]);
 const toggle=async(nextId:string,nextText:string)=>{
  if(lock.current)return;lock.current=true;
  try{
   const same=id.current===nextId;
   const token=++run.current;await Speech.stop();
   if(same&&!paused){setPaused(true);return;}
   if(!same){cursor.current=0;text.current=nextText;id.current=nextId;}
   setActive(nextId);setPaused(false);const offset=cursor.current;
   Speech.speak(text.current.slice(offset),{language:'vi-VN',voice,rate,onBoundary:(event:any)=>{if(run.current===token)cursor.current=offset+(event.charIndex||0);},onDone:()=>{if(run.current===token){id.current=null;setActive(null);cursor.current=0;}},onError:()=>{if(run.current===token){setPaused(true);}}});
  }finally{lock.current=false;}
 };
 return {active,paused,toggle,rate,setRate,voice,setVoice,voices};
}
