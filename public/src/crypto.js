import {validateState} from './model.js';
const encoder=new TextEncoder();
const b64=bytes=>{let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);};
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const hex=b=>Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');
async function derive(password,salt){const k=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:600000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
export async function encryptState(state,password){
  if(typeof password!=='string'||password.length<12||password.length>1024)throw Error('Brug en adgangssætning på 12–1.024 tegn.');
  validateState(state);const payload=JSON.stringify(state);const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const hash=hex(await crypto.subtle.digest('SHA-256',encoder.encode(payload)));
  const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv},await derive(password,salt),encoder.encode(JSON.stringify({payload,hash})));
  return {format:'vores-ferie-encrypted',version:1,kdf:'PBKDF2-SHA256',iterations:600000,salt:b64(salt),iv:b64(iv),data:b64(new Uint8Array(ciphertext))};
}
export async function decryptState(envelope,password){
  if(!envelope||envelope.format!=='vores-ferie-encrypted'||envelope.version!==1||envelope.kdf!=='PBKDF2-SHA256'||envelope.iterations!==600000||typeof envelope.salt!=='string'||envelope.salt.length!==24||typeof envelope.iv!=='string'||envelope.iv.length!==16||typeof envelope.data!=='string'||envelope.data.length>140e6)throw Error('Filen er ikke en understøttet Vores Ferie-backup.');
  let decoded;
  try{decoded=JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(envelope.iv)},await derive(password,bytes(envelope.salt)),bytes(envelope.data))));}catch{throw Error('Forkert adgangssætning, eller filen er beskadiget.');}
  if(typeof decoded.payload!=='string'||hex(await crypto.subtle.digest('SHA-256',encoder.encode(decoded.payload)))!==decoded.hash)throw Error('Backupfilens integritet kunne ikke bekræftes.');
  return validateState(JSON.parse(decoded.payload));
}
