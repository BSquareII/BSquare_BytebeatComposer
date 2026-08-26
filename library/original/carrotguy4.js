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


sr=24e3,bpm=150,
tt=t*440*128/sr*2**(-4/12),ts=t/2*bpm/(60*sr/32768),

note = (P) => 2 ** (P / 12),
noteAdv = (P, O, T) => 2 ** (P / 12) * 2 ** (T / 12) * 2 ** O,

deNaN=i=>isNaN(i)?0:i,

bell=x=>sin(8*((()=>{let out=0;for(let i=0;i<(I=6);i++){out+=(sin(x*PI/256*2**i)%256/I/3)}return out})())),

fm=x=>bpf((cos(2*sin(x*PI/128)))+(sin(2*sin(x*PI/127))),.4,.01)/2,
sqr=x=>hpf((x%256/127)<1,.002),
pwm=x=>hpf((x%256/127)>((sin(ts/32768*PI))/2+1),.005),
fpwm=x=>((((x&128?0:127)&&x)&((x&128?0:127)||x))-192+(((x&128?0:255)&&x)-((x&128?0:127)||x))&255)/127-1,
tri=x=>((asin(sin(2*sin(x*PI/127-1)))*84)&~15)/127,
atari=x=>hpf(((((AL='1101011101011010')[((x)>>5)%AL.length]*128)&128)&255)/127-1,.008),
sinw=x=>((sin(x*PI/128)*127&255)/127)-1,
pls=i=>(abs(tan(i*PI/256)&255)/127)-1,

  (sA = function (mode,env) {
    if (mode == "1") {
      return (ts/env%1)**1.5;
    } else return 1;
  }),

ms=(s,S)=>parseInt(...s[(ts>>S)%s.length],36),
msN=(s,S)=>parseInt(...s[(S)%s.length],36),

TS=ts%8192,

drm=DrumMachine=function(DT,S){let DTII;switch(DT){case'k':DTII=tanh(sin(384*sqrt(ts/S%1024)**.1))*pow(1-ts/S/1024%1,2);break;case'h':DTII=hpf(random(),.6)*pow(1-ts/1024/S%1,6);break;case's':DTII=((tanh(4*sin(12*cbrt((TS=ts%8192)/S%1024)))*pow(1-TS/S/1024%1,4)+bpf(random(),.1,.3)*32*(TS/S/1024%1)*pow(1-ts/S/1024%1,1.5)));break;case'-':DTII=void 0||null;break;case't':DTII=tanh(2*sin(t*440*256/sr/128*PI))*pow(1-(ts/1024/S)%1,4);break}return DTII},

sn=cbrt(tanh(4*sin(12*cbrt(TS%16384)))*(1-TS/8192%1)**4+bpf(random(),.1,.3)*32*(TS/8192%1)*(1-ts/8192%1)**1.5),

inSeq1="00 0 00 3 3 2 27",
basSeq="00003327",
insSeq2="0 2 3 2 3 5 7 A 7 8 7 A C F J F ",

M=lr=>(
ins1=rv(12288,deNaN(pwm((tt*(lr?.995:1.005)*note(ms(inSeq1,12))/4|0)**2)),lr)*(sch=sA('1000'[ts>>12&3],4096)/1.5),
bas=fm(tt/4*note(ms(basSeq,13))),
bas2=lpr(pls(tt/4*note(ms(basSeq,13))),.5*abs(sin(ts/16384*PI)),.9),
arp=tanh(lpr((()=>{o=0;for(let i=0;i<(z=9);i++){o+=atari((tt*(lr?.995:1.005)*deNaN(note(msN(insSeq2,ts*i>>13|(ts>>i)>>12^(ts>>(i+11)&5))+i/127))))%256/z}return o})(),.9,.7)),

tanh(ins1*2+drm(['k-h-s-h-kkh-s-hh',['k-k-t-kt-kk-t-k-','k--ks-k-k-k-s-kh'][ts>>17&1]][ts>>18&1][ts>>12&15],4)*2+drm('h',4)+bas/1.3+bas2/3+arp*2*sch)

),

[M(0),M(1)]