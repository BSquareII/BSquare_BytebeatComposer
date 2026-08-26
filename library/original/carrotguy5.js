t||(z1=[]),
callCount=0,
lpf=lowPassFilter=(a,c)=>(
	call=callCount++,
	z1[call]??=0,
	z1[call]+=(a-z1[call])*c
),
hpf=highPassFilter=(a,c)=>a-lpf(a,c),
bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc), hc),
nf=notchFilter=(a,lc,hc)=>(hpf(a,hc)+lpf(a,lc))/1.75,
lbf=lowBoostFilter=(a,c,v)=>a+lpf(a,c)*v,
hbf=highBoostFilter=(a,c,v)=>a+hpf(a,c)*v,
bbf=bandBoostFilter=(a,hc,lc,v)=>a+bpf(a,hc,lc)*v,

// 2-Pole Filters || from "6th Wave" by feeshbread
lpf2=twoPoleLowPassFilter=(a,c)=>lpf(lpf(a,c),c),
hpf2=twoPoleHighPassFilter=(a,c)=>hpf(hpf(a,c),c),

// Low-Pass Filter w/ Resonance || Cattoadishere
lpr=lowPassResonance=(a,c,r)=>((
	call=callCount++,
	t||(z1[call+'lp6']=0,z1[call+'lp12']=0),
	ct=Math.min(c,.999),
	R=r+r/(1-ct),
	z1[call+'lp6']+=ct*(a-z1[call+'lp6']+R*(z1[call+'lp6']-z1[call+'lp12']))),
	z1[call+'lp12']+=ct*(z1[call+'lp6']-z1[call+'lp12'])),

v=[0,,7,,14,,10,,12,,7,3,,7,0,,0,,7,,14,,15,,17,,15,14,,,10,,],
n=f=>(2**(f/12)),
a=b=>{
let out=0;for(x=0;x<8;x++){
out+=sign(sin(x+sin(t/2/2**(x%2)*n(4)*4*n(v[(t+(x*16384)>>12)%v.length])*b*PI/256)))*(1-(t+x*8192)/16384%1)/2||0
}return out
},

mel=asin(sin(t*n(4)*PI/256*n(v[(t>>12)%v.length])))/1.333||0,

lprRise=otp=>lpr(otp,t>=65536*1?.5:.5*(t/65536%1),t>=65536*8?.9:.9*(1-t/65536%1))/4,

syn=lprRise(a(1)+mel),

sch=[i=(t/4096%1)**1.5,1,1,1,i,1,1,1,i,1,1,i,i,1,i,1][t>>12&15],

k=(sin(1&cbrt(t*'1000100010011010'[t>>12&15]%4096)))*(1-t/4096%1)**1.5/2,
h=hpf(2*random()-1,.9*(t/4096%1))*(1-t/4096%1)**4/4,


syn*sch+k+(h*sch)