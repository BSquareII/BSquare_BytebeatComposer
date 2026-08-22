t?0:(fx={f:[],d:[],c:[],r:[]},sn={a:-9,t:440,r:48000,b:100,s:16384}),

tt=t*2**(sn.a/12)*sn.t*128/sn.r,
ts=t*abs(sn.b/(60*sn.r/sn.s)),

ss=(p,s)=>p[(ts/s|0)%p.length],
ms=(p,s,T=0)=>tt*2**((parseInt(ss(p,s),36)+T)/12),

en=(x,l=1)=>(1-ts/x%1)**l,
rn=(x,l=1)=>(ts/x%1)**l,

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

ch=(i,s,d,f)=>(
	c=chi++,
	fx.c[c]??=Array(s).fill(0),
	C=fx.c[c],
	
	w=(sin(t/2E3)+1)*0.5,
	p=(t+w*d)%s,
	
	o=C[p|0]??=0,
	C[t%s]=i+o*f,
	
	i+o*f
),

rv=(i,s,D=.9,W=.3)=>{
	o=0;
	I=ch(i,100,100,.25);
	for(k=0;k<10;k++){
		fx.r[k]??=Array(s*(k+1)).fill(0)
		d=fx.r[k];
		z=s*(k*k+1);
		p=t%z;
		m=(1+sin(t*3.7*k*12.98))*.5
		x=d[p]||0;
		o+=x/(k+1);
		d[p]=I/(k+1)+x*.75*m
	};
	return hp(i*D+lp(o,.3)*W,.02)
},

mi=(...x)=>x.reduce((ac,i)=>ac+i)/x.length,

FM1=(x,l)=>sin(sin(sin(x*PI/127)*en(l,3)*2+x*PI/64)*en(l,.25)),
ChL=s=>FM1(ms(s,131072)/(t&1?1.005:.995),131072)/4,
FM2=(x,l)=>lp(x%256,en(l,1)),

Chords=ChL("5442")+ChL("9775")+ChL("CBB9")+ChL("GGEE"),
DelayChords=.25*lp(dl(Chords,12000,.5),.15)+Chords*.5,
Chords=hp(DelayChords*ss("10110101",4096)*4,.005),

Bass=FM2(ms("479947BB47BB2595",32768,(t&1?-12:-24)),4096),
Bass=hp(Bass*ss("10010010",4096)/256-.5,.005)*2,

Drums=sin(4*cbrt(ts%16384))*2*(j=en(16384))**3+
hp(random(),.9)*(1-ts/4096%1)**4*8+min(max(hp(random(),.1)*j**2*8+sin(.5*cbrt(ts%16384))*j**6*6,-1),1)*j**6*!!(ts/8192&3)*2,

mi(Chords,Bass,Drums)