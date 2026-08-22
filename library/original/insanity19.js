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


sr=48e3,bpm=120,
tt=t*440*128/sr*2**(-9/12),ts=t/2*bpm/(60*sr/32768),

note = (P) => 2 ** (P / 12),

deNaN=i=>isNaN(i)?0:i,

bell=x=>sin(8*((()=>{let out=0;for(let i=0;i<(I=6);i++){out+=(sin(x*PI/256*2**i)%256/I/3)}return out})())),
fm=x=>bpf((cos(2*sin(x*PI/128)))+(sin(2*sin(x*PI/127))),.4,.01)/2,
sqr=x=>hpf((x%256/127)<1,.002),
pwm=x=>hpf((x%256/127)>((sin(ts/32768*PI))/2+1),.005),
fpwm=x=>((((x&128?0:127)&&x)&((x&128?0:127)||x))-192+(((x&128?0:255)&&x)-((x&128?0:127)||x))&255)/127-1,
tri=x=>asin(sin(x*PI/128))/PI*2,
atari=x=>hpf(((((AL='1101011101011010')[((x)>>5)%AL.length]*128)&128)&255)/127-1,.008),
sinw=x=>((sin(x*PI/128)*127&255)/127)-1,
pls=i=>(abs(tan(i*PI/256)&255)/127)-1,
btf=i=>(i&255)/128-1,
ms=(s,S)=>parseInt(...s[(ts>>S)%s.length],36),
msN=(s,S)=>parseInt(...s[(S)%s.length],36),

drm=DrumMachine=function(DT,S){let DTII;switch(DT){case'k':DTII=tanh(sin(384*sqrt(ts/S%1024)**.1))*pow(1-ts/S/1024%1,2);break;case'h':DTII=hpf(random(),.6)*pow(1-ts/1024/S%1,6);break;case's':DTII=((tanh(4*sin(12*cbrt((TS=ts%(1024*S))/S%1024)))*pow(1-TS/S/1024%1,4)+bpf(random(),.1,.3)*32*(TS/S/1024%1)*pow(1-ts/S/1024%1,1.5)));break;case'-':DTII=void 0||null;break;case't':DTII=tanh(2*sin(t*440*256/sr/128*PI))*pow(1-(ts/1024/S)%1,4);break}return DTII},


M=lr=>(
	chr=((o=0)=>{for(i=0;i<8;i++){o+=(Z=fm)(R=tt*(P=lr?1.005:.995)*note(msN("02479CEG",i)+($=ms("0135",16))))+Z(R/P)};return o/6})(),
	drm(D="s-t-st-k"[ts>>12&7],4)+rv(3072,chr,lr)*((D=="s"||D=="k")?min(1,exp(ts/4096%1*2)/12):1)+fm(tt*note($)/4)
),

[M(0),M(1)]