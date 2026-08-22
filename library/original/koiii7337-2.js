// Infinitely Instantiable 1-Pole Filters || feeshbread
// Every call = New Filter Instance
// What you're seeing here is feeshbread's Dead Data Reverb
t||(fx=[],dMax=1e6,z1=[],wsin=phase=>(-cos(phase/128*PI)+1)*128-.5,dly=multiTabDelay=(audio,heads,dw,fbfn=x=>x)=>{dly_fxii=fxi++;fx[dly_fxii]??=Array(dMax).fill(0);dly_wi	=dt%dMax;dly_feed=audio;dly_out=0;for(let head of heads){dly_ri=(dMax+dt-round(head.t))%dMax;dly_feed+=fx[dly_fxii][dly_ri]*head.fb;dly_out+=fx[dly_fxii][dly_ri]*head.m;}fx[dly_fxii][dly_wi]=fbfn(dly_feed);return audio*(1-dw)+dly_out*dw;}),fxi=0,dt=t,rvrbHeads=[[{t:6e3+wsin(t/100),m:.5,fb:.15},{t:10e3+wsin(t/250),m:.5,fb:.35},{t:14e3+wsin(t/300),m:.1,fb:.45},{t:2e4+wsin(t/380),m:.1,fb:.65}],[{t:8e3+wsin(t/230),m:.5,fb:.15},{t:12e3+wsin(t/270),m:.5,fb:.35},{t:16e3+wsin(t/280),m:.1,fb:.45},{t:24e3+wsin(t/200),m:.1,fb:.65}]],

callCount=0,
lpf=lowPassFilter=(a,c)=>(
	call=callCount++,
	z1[call]??=0,
	z1[call]+=(a-z1[call])*c
),
hpf=highPassFilter=(a,c)=>a-lpf(a,c),
bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc), hc),


// Low-Pass Filter w/ Resonance || Cattoadishere
lpr=lowPassResonance=(a,c,r)=>((
	call=callCount++,
	t||(z1[call+'lp6']=0,z1[call+'lp12']=0),
	ct=Math.min(c,.999),
	R=r+r/(1-ct),
	z1[call+'lp6']+=ct*(a-z1[call+'lp6']+R*(z1[call+'lp6']-z1[call+'lp12']))),
	z1[call+'lp12']+=ct*(z1[call+'lp6']-z1[call+'lp12'])
),

Q=(

  // Things (Some Functions Not Used In This Song)
BPM=t/34000*132/59.739,
S_clz32=t=>sin(clz32(t)),
C_clz32=t=>cos(clz32(t)),
T_clz32=t=>tan(clz32(t)),
clz32_S=t=>clz32(sin(t)*8+128)-24.5,
clz32_C=t=>clz32(cos(t)*8+128)-24.5,
clz32_T=t=>clz32(tan(t)*8+128)-24.5,
TT=(a,b)=>(S_clz32(t/2*2**(parseInt(a[BPM/8%a.length|0],36)/12)&31)/6+C_clz32(t/2*2**(parseInt(b[BPM/8%b.length|0],36)/12)&31)/6),
(clz32_C(t/256*PI*2**([7,14,19,,,,,,7,14,19,,,,,,5,12,17,,,,,,5,12,17,,,,12,,7,14,19,,,,,,7,14,19,,,,,,5,12,17,,,,,,5,12,17,,,,,,3,10,15,,,,,,3,10,15,,,,,,5,12,17,,,,,,5,12,17,,,,12,][BPM*2%96|0]/12)||0)*min(1,BPM*16%8)*(BPM*2%1-1)/2+S_clz32((t/16*2**([,,,21,,23,,26,31,,,,,,,,,,,21,,23,,26,31,,,,,,,,,,,21,,23,,26,31,,,,,,,,,,,21,,23,,26,31,,,,,,,,,,,21,,22,,26,31,,,,,,,,,,,21,,23,,26,31,,,,,,,][BPM*2%96|0]/12)||0)&31)*min(1,BPM*16%8)*(BPM*2%1-1)/4+TT('2','7')*min(1,BPM*16%8)*(BPM*2%1-1)*((BPM*2&15)==11))*3

),[dly(Q,rvrbHeads[0],.5,x=>bpf(x,.07,.2)*1.25),dly(Q,rvrbHeads[1],.6,x=>bpf(x,.076,.2)*1.25)]