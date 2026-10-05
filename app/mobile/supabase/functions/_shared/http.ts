import {createClient} from 'npm:@supabase/supabase-js@2.117.2';
export const headers={'Access-Control-Allow-Origin':Deno.env.get('APP_WEB_ORIGIN')||'http://localhost:8770','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json'};
export const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
export async function context(req:Request){
 if(req.method!=='POST')throw new Error('Phương thức không hợp lệ.');
 const url=Deno.env.get('SUPABASE_URL')!,auth=req.headers.get('Authorization');
 if(!auth?.startsWith('Bearer '))throw new Error('Cần đăng nhập.');
 const c=createClient(url,Deno.env.get('SUPABASE_ANON_KEY')!,{global:{headers:{Authorization:auth}}});
 const {data,error}=await c.auth.getUser();if(error||!data.user)throw new Error('Phiên đăng nhập hết hạn.');
 const admin=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
 return {user:data.user,admin};
}
export async function quota(admin:any,user:string,kind:string){const limit=Number(Deno.env.get('DAILY_'+kind.toUpperCase()+'_LIMIT')||0);const {data,error}=await admin.rpc('smartmeal_consume',{p_user:user,p_kind:kind,p_limit:limit});if(error||!data)throw new Error('Chưa có hạn mức dịch vụ hoặc đã đạt giới hạn hôm nay.');}
export async function openai(path:string,body:unknown){
 const key=Deno.env.get('OPENAI_API_KEY');if(!key)throw new Error('Dịch vụ AI chưa được cấu hình.');
 const r=await fetch('https://api.openai.com/v1/'+path,{method:'POST',headers:{Authorization:'Bearer '+key,...(body instanceof FormData?{}:{'Content-Type':'application/json'})},body:body instanceof FormData?body:JSON.stringify(body)});
 if(!r.ok)throw new Error('Dịch vụ AI chưa hoàn tất. Dữ liệu đang nhập được giữ lại.');return r.json();
}
