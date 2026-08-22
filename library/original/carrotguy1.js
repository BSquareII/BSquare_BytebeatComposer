t?0:(A=Array,fx={f:[],d:[],r:[]},sn={a:0,t:440,r:48000,b:140,s:16384},rfx=[]),fxi=0,

tt=t*2**(sn.a/12)*sn.t*128/sn.r,
ts=t*abs(sn.b/(60*sn.r/sn.s)),
no=x=>2**(x/12),

ss=(p,s)=>p[(ts/s|0)%p.length],
ms=(p,s,T=0)=>tt*2**((parseInt(ss(p,s),36)+T)/12),

n=(x,l=1)=>(1-ts/x%1)**l,
rn=(x,l=1)=>(ts/x%1)**l,
dp=x=>{throw x},

lpi=0,dli=0,

lp=(i,l)=>(
	c=++lpi,
	fx.f[c]??=0,
	fx.f[c]+=(i-fx.f[c])*l
),
hp=(i,l)=>i-lp(i,l),
bp=(i,l,L)=>hp(lp(i,l),L),

lpr=(i,l,r)=>(
lpr_fxii = fxi++,
rf = rfx[lpr_fxii] ??= {r0: 0, r1: 0},
rf.r1 += ((rf.r0 += (i - rf.r0 + (r + r / ((1 + 1e-9) - l)) * (rf.r0 - rf.r1)) * l) - rf.r1) * l
),

dl=(i,s,f)=>(
	c=dli++,
	fx.d[c]??=A(s).fill(0),
	d=fx.d[c],
	i+=d[t%s],
	d[t%s]=i*f,
	d[t%s]
),

rv=(i,s,I,f=1.5,L=1.005,D=.9,W=.3)=>{
	o=0;
	for(k=0;k<I;k++){
		fx.r[k]??=A(s*(k+1)).fill(0)
		d=fx.r[k];
		u=i;
		h=t*L*(1+(k+1)/10000)|0;
		u+=d[h%(s*(k+1))];
		d[t%(s*(k+1))]=u/f,
		o+=d[h%(s*(k+1))]
	};
	return hp(i*D+lp(o,.3)*W,.02)
},

/* Instruments */
squ = (phase, dutyCycle = 0, shapeMode) => {
	const tri = t => -asin(cos(t)) / (PI / 2);

	let shape = 0;
	let phs = phase * PI / 128 + 1e-10;
	if (shapeMode) {shape += -cos(phs)}
	else {shape += tri(phs)};
	if (!phase) return 0;

	return sign(shape - dutyCycle) / 2 + dutyCycle / 2;
},
saw = phase => atan(tan(phase * PI / 256 + 1e-10)) / (PI / 2) / 2,
clap = () => bp(((random() - .5) * (ts >> 10 & 7 ? (1 - ts / 8192 % 1) ** 4 * 2.5 / 2 : (1 - (ts / (512 / 1.5)) % 1 ) ** 2)), .2, .2) * 15,
sinc = phase => sin(sin(phase * PI / 128) + sin(phase * PI / 32) / 8),
bell = (phase, decay = 1) => (bit = phase - phase % "1352"[ts >> 12 & 3] * 10, (sinc(bit) * decay + sinc(bit * 3.99) / 2 * decay ** 2 + sinc(bit * 10.025) / 3 * decay ** 3 + sinc(bit * 17.955) / 4 * decay ** 4) / 1.75 || 0),
pwm=x=>(x%256/128)<abs(sin(ts/65536*PI))+.5,

M=[[0,3,7,10],[-1,3,6,8],[-5,-1,3,7],[0,4,7,10],[1,5,8,12],[3,6,10,13],[4,8,11,15],[3,7,10,13]],
mI=M[ts>>16&7],

m=lr=>(rv(lpr(squ(tt*(lr?.995:1.005)*no(mI[ts>>13&3])),.3,.9),lr?15360:16384,16,2,2.02)/2*(sc=(ts/2&12288?1:rn(8192,1.5)))+sinc(cbrt(ts%32768)*128)*(ts&16384?0:n(16384,4))+lpr(clap()*"    1   "[ts>>13&7],.7,.6)+squ(tt*no(mI[0])/4)/2*sc)+dl(hp(pwm(tt*8*no(mI[(ts>>13&3^ts>>15&3|ts>>12&3)])),.01)*n(16384,8),12288,.9)*sc,[m(0),m(1)]