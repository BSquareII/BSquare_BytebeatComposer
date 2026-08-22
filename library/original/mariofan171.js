/* --- Wavetable creators --- */
/*   -   codePointAt()    -   */
cw=makeCharWave=(wave="")=>{
  const cp=[];
  for(const ch of wave) cp.push(ch.codePointAt(0));
  const wLen=cp.length;
  if(!wLen) return _=>0;

  let sum=0;
  for(let i=0;i<wLen;i++) sum+=cp[i];
  const mean=sum/wLen;

  const s=new Float32Array(wLen);
  let maxAbs=0;
  for(let i=0;i<wLen;i++){
    const d=cp[i]-mean;
    const ad=abs(d);
    if(ad>maxAbs) maxAbs=ad;
    s[i]=d;
  }
  if(!maxAbs) maxAbs=1;
  for(let i=0;i<wLen;i++) s[i]/=maxAbs;

  return tone=>{
    if(!tone) return 0;
    return s[((tone*wLen)/256|0)%wLen];
  };
},

/*   -     parseInt()     -   */
pw=makeParseWave=(wave="")=>{
  const wLen=wave.length;
  if(!wLen) return _=>0;

  const s=new Float32Array(wLen);
  let sum=0;
  for(let i=0;i<wLen;i++){
    const v=parseInt(wave[i],36)||0;
    s[i]=v;
    sum+=v;
  }
  const mean=sum/wLen;

  let maxAbs=0;
  for(let i=0;i<wLen;i++){
    const d=s[i]-mean;
    const ad=abs(d);
    if(ad>maxAbs) maxAbs=ad;
    s[i]=d;
  }
  if(!maxAbs) maxAbs=1;
  for(let i=0;i<wLen;i++) s[i]/=maxAbs;

  return tone=>{
    if(!tone) return 0;
    return s[((tone*wLen)/256|0)%wLen];
  };
},

/* --- Wavetable creators --- */
/*   -      Example       -   */
pWav=pw("MarioFan171"),
pWavB=pw("LuigiFan342"),

i1=pWav(t*2**([7,,,,7,,7,,7,,,,7,,7,,5,,,,,,7,,7,,,,,,,,5,,,,,,7,,7,,,,,,7,,5,,,,3,,,,0,,,,,,,,5,,5,,5,,5,,5,,,,3,,0,,3,,,,5,,,,5,,,,,,,,10,,10,,10,,10,,10,,,,10,,,,7,7,7,7,,,,,,,,,,,,,][t>>12&127]/12)),

i2=pWavB(t/2*2**([0,0,-2,-2,-4,-4,-2,0][t>>16&7]/12)),

i1/3+i2/3