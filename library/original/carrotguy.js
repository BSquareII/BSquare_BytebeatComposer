t?0:(dwnfx=[],fx=bz=new Float64Array(4e6),$b=[]),fxi=callCount=0,((lpf=function(i,f){fxii=fxi++,fx[fxii]??=0,fx[fxii]+=((i)-fx[fxii])*f;return fx[fxii]},hpf=highpass=function(i,f){return i-lpf(i,f)},bpf=bandpass=function(i,hf,lf){return hpf(lpf(i,hf),lf)},nf=notch=function(i,hf,lf){return(hpf(i,hf)+lpf(i,lf))/1.75},lbf=lowBoost=function(i,f,v){return i+lpf(i,f)*v},hbf=highBoost=function(i,f,v){return i+hpf(i,f)*v},bbf=bandBoost=function(i,hf,lf,v){return i+bpf(i,hf,lf)*v},lpf2=function(i,f){return lpf(lpf(i,f),f)},hpf2=function(i,f){return hpf(hpf(i,f),f)},lpr=function(i,f,r){let call=callCount++;t?0:(bz[call+'lp6']=0,bz[call+'lp12']=0);let ct=min(f,.999);let R=r+r/(1-ct);(bz[call+'lp6']+=ct*(i-bz[call+'lp6']+R*(bz[call+'lp6']-bz[call+'lp12'])));bz[call+'lp12']+=ct*(bz[call+'lp6']-bz[call+'lp12']);return bz[call+'lp12']},hpr=function(i,f,r){return i-lpr(i,f,r)},bpr=function(i,hf,lf,r){return(hpr(lpr(i,lf,r),hf,r))/4},nfr=function(i,hf,lf,r){return(hpr(i,hf,r)+lpr(i,lf,r))/1.75},lbr=function(i,f,r,v){return i+lpr(i,f,r)*v},hbr=function(i,f,r,v){return i+hpr(i,f,r)*v},bbr=function(i,hf,lf,r,v){return i+bpr(i,hf,lf,r)*v},bpf2=(i,hf,
lf)=>(bpf(bpf(i,hf,lf),hf,lf)),(ech$=0),(lp$=0),

(ech$ = 0),
(lp$ = 0),
(echo = (delay, code) => (
	ech$++,
	($b[ech$] ??= Array(delay).fill(0)),
	(ech = (code % 256) + $b[ech$][t % delay]),
	($b[ech$][t % delay] = ech / 1.0625),
	ech / 2
)),
(rv = delayReverb =
	(delay, code, lr) => {
		let out = [0, 0];
		for (let $i = 0; $i <= ($A = 6); $i++) {
			((out[0] += echo(
					delay + $i * ($i * 2 ** 4 + 1),
					lpf(code, 1 - $i / 10),
				)),
				(out[1] += echo(
					delay + $i * ($i * 2 ** 3 + 1),
					lpf(code, 1 - $i / 10),
				)));
		}
		return tanh(atan(bpf(((out[lr] / $A + out[lr] / $A) * 2) / $A, .8, .01))) * 2
	}))),

sr=48e3,bpm=140,
ts=t*bpm/(60*sr/32768)/2,tt=t*440*256/sr*2**(-10/12),r=random,

deNaN=i=>isNaN(i)?null:i,
this["FB"]??=[],callCount=0,this["lp_S"]??={},

svf=(i,f,r)=>(
	C=callCount++,
	t?0:(FB[C+'lp6']=0,FB[C+'lp12']=0),
	ct=Math["min"](f/100,2),
	R=min(((rL=(.4+(r/100)))+(rL))/(1-ct),2),
	FB[C + 'lp6'] += ct * (i - FB[C + 'lp6'] + R * (FB[C + 'lp6'] - FB[C + 'lp12'])),
	FB[C + 'lp12'] += ct * (FB[C + 'lp6'] - FB[C + 'lp12'])
),

lp_S["svf x2"]=(i,f,r)=>(
	svf(svf(i,f,r),f,r)/2
),

fm=x=>bpf((cos(2*sin(x*PI/128)))+(sin(2*sin(x*PI/127))),.4,.01)/2,
sqr=x=>hpf((x%256/127)<1,.002),
pwm=x=>hpf((x%256/127)>((sin(ts/32768*PI))/2+1),.005),
fpwm=x=>((((x&128?0:127)&&x)&((x&128?0:127)||x))-192+(((x&128?0:255)&&x)-((x&128?0:127)||x))&255)/127-1,
tri=x=>((asin(sin(2*sin(x*PI/127-1)))*84)&~15)/127,
atari=x=>hpf(((((AL='1101011101011010')[((x)>>5)%AL.length]*128)&128)&255)/127-1,.008),
sinw=x=>((tan(x*PI/128)*127&255)/127)-1,
pls=i=>(abs(tan(i*PI/256)&255)/127)-1,

sn=()=>tanh(hpf(lpr((r()*.99975**(ts%32768)),.4,.5),.2)*8*(ts&16384?1:ts/16384%1)**1.5+sin(256*sqrt(ts%32768)**.1)*.999**(ts%32768)),sn=sn()*!!(ts>>15&1),n=x=>2**(x/12),T=t=>atan(2*tan(t*PI/256)),
m=lr=>(rv(lr?12288:16384,T(tt*(2*n([0,0,-2,-4,-5,-5,-5,-5][ts>>14&7]-1))*(1+(ts>>13&1)))/4,lr)+svf(hpf((pwm(tt*(lr?.995:1.005)*n(-"00011111"[ts>>14&7])/4)),.01),100*(1-ts/32768%1)**.5,100))/2+sin(8*cbrt(ts%8192))/2*(1-ts/8192%1)**4*("1000000101101010"[ts>>13&15])+sn*2+(hpf(random(),.6)*(1-ts/8192%1)**4),

[m(0),m(1)]