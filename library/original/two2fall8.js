t?0:(fx={f:[],d:[],r:[]},sn={a:-9,t:440,r:48000,b:130,s:16384}),

tt=t*2**(sn.a/12)*sn.t*128/sn.r,
ts=t*abs(sn.b/(60*sn.r/sn.s)),

ss=(p,s)=>p[(ts/s|0)%p.length],
ms=(p,s,T=0)=>tt*2**((parseInt(ss(p,s),36)+T)/12),

n=(x,l=1)=>(1-ts/x%1)**l,
rn=(x,l=1)=>(ts/x%1)**l,
dp=x=>{throw x},

lpi=0,dli=0,chi=0,

lp=(i,l)=>(
	c=++lpi,
	fx.f[c]??=0,
	fx.f[c]+=(i-fx.f[c])*l
),
hp=(i,l)=>i-lp(i,l),
bp=(i,l,L)=>hp(lp(i,l),L),

dl=(i,s,f)=>(
	c=dli++,
	fx.d[c]??=Array(s).fill(0),
	d=fx.d[c],
	i+=d[t%s],
	d[t%s]=i*f,
	d[t%s]
),


rv=(i,s,f=1.5,L=1.005,D=.9,W=.3)=>{
	o=0;
	for(k=0;k<10;k++){
		fx.r[k]??=Array(s*(k+1)).fill(0)
		d=fx.r[k];
		u=i;
		h=t*L*(1+(k+1)/10000)|0;
		u+=d[h%(s*(k+1))];
		d[t%(s*(k+1))]=u/f,
		o+=d[h%(s*(k+1))]
	};
	return hp(i*D+lp(o,.3)*W,.02)
},

mi=(...x)=>atan(hp(x.reduce((ac,i)=>ac+i/x.length,0),.005)),
Absin=(x,y,z)=>x*abs(sin(ts*PI/y/16384))**z,
Saw=x=>bp(atan(tan(x*PI/128)),.1,.005),
NormalSaw=x=>hp(atan(tan(x*PI/128))/1.5,.005),
ChorusSaw=(x,y)=>Saw(8*(Saw(x)+Saw(x*1.005)*n(y))+Saw(x*2)*4),
FCW=(x,y)=>(ChorusSaw(x,y*16384)+ChorusSaw(x*1.004,y*16384))/2*Absin(1,y,.75),
LPSaw=(x,y)=>lp(x,n(y,2)),
Noise=(x,n=0)=>(N=tt*2**(n/12),bt=int(N/x)*x,bt%=2**17,hp(sin(bt**3)*128&128&&1,.005)),

CL=ChordLayer=y=>tanh(FCW(ms(y,131072),8)),

Chords=rv(CL("0002")+CL("4457")+CL("798B")+CL("EGEE"),10000,2,1.001),
Bass=LPSaw(ms(ss([
	"CCC7CCCCCCC7CCCC", 
	"999E999999949999",
	"888C8888CCCKKKKK",
	"EEEEEEEEEEEEEEEE"
],131072),8192)/4%256/128-1,8192*ss([
	4,4,4,1,4,4,4,4,4,4,4,1,4,4,4,4,
	4,4,4,1,4,4,4,4,4,4,4,1,4,4,4,4,
	4,4,4,1,4,4,4,4,1,4,4,1,4,4,4,4,
	16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,
],8192))/4,

AC=ArpeggioChords=["047E","047G","058E","07BE"],
Arp=NormalSaw(2*ms(ss(AC,131072),512))/2*ss("1001001110010011",8192),
Arp=dl(Arp,10800,.25)*1.5,

DrumPattern=ss("00102010",8192),
Drum=DrumPattern==0?Noise(64,2):DrumPattern==1?Noise(2,0):DrumPattern==2?Noise(8,2):0,
Drum*=n(8192,1.5)/2,

mi(Chords,Arp,Bass,Drum)*3