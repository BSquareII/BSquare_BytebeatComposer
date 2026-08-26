t||($b=[],lprfx=[],r={},b1=[]),cc=0,
lpf=(i,f)=>(cl=cc++,b1[cl]??=0,b1[cl]+=(i-b1[cl])*f),
hpf=(i,f)=>(i-lpf(i,f)),
bpf=(i,lf,hf)=>(hpf(lpf(i,lf),hf)),
nf=(i,lf,hf)=>((hpf(i,hf)+lpf(i,lf))/1.75),

lbf=(i,f,v)=>(i+lpf(i,f)*v),
hbf=(i,f,v)=>(i+hpf(i,f)*v),
bbf=(i,lf,hf,v)=>(i+bpf(i,lf,hf)*v),
nbf=(i,lf,hf,v)=>(i+nf(i,lf,hf))*v,


// credits semaphore

lprfxi=0,

lpr=lowPassResonance=(a, c, r)=>(
	lpr_fxii = lprfxi ++,
	lprfx[lpr_fxii] ??= [0, 0, 0, 0],
	lprfx[lpr_fxii][0] += (a - lprfx[lpr_fxii][0] + (r + r / ((1 + .1e-9) - c)) * (lprfx[lpr_fxii][0] - lprfx[lpr_fxii][1])) * c,
	lprfx[lpr_fxii][1] += (a - lprfx[lpr_fxii][1] + (r + r / ((1 + .1e-9) - c)) * (lprfx[lpr_fxii][1] - lprfx[lpr_fxii][2])) * c,
	lprfx[lpr_fxii][2] += (lprfx[lpr_fxii][1] - lprfx[lpr_fxii][2]) * c,
	lprfx[lpr_fxii][3] += (lprfx[lpr_fxii][2] - lprfx[lpr_fxii][3]) * c,
	lprfx[lpr_fxii][3]
),

hpr=(a,c,r)=>a-lpr(a, c, r),

rd=random(),

str=(x,y,z=0)=>parseInt(x[z?y:(ts/2**y)%x.length|0],36),
rs = (string, length)=> {
    var result           = '';
    var characters       = string;
    var charactersLength = characters.length;
    for ( var ii = 0; ii < length; ii++ ) {
        result += characters.charAt(floor(random()*charactersLength));
    }
    return result
},

ech$=0,lp$=0,echo=(delay,code)=>(ech$++,$b[ech$]??=Array(delay).fill(0),ech=(code%256)+$b[ech$][floor(t%delay)],$b[ech$][floor(t%delay)]=ech/2,ech/2),echoBPM=(delay,code)=>(ech$++,$b[ech$]??=Array(delay).fill(0),ech=(code%256)+$b[ech$][floor(ts%delay)],$b[ech$][floor(ts%delay)]=ech/2,ech/2),rv=(delay,code,lr)=>{let out=[0,0];for (let $i=0; $i<(iter=5); $i++){out[0] += echo(delay+($i)*(($i*2**4)+1),code),out[1]+=echo(delay+($i)*(($i*2**5)+1),code)} return bpf((out[lr]+out[lr])/iter/2,.8,.01)},

//It works but it's not in the variable (ts is down there)

fm=x=>bpf((cos(2*sin(x*PI/128)))+(sin(2*sin(x*PI/127))),.4,.01)/2,
sqr=x=>hpf((x%256/127)<1,.002),
pwm=x=>hpf((x%256/127)>((sin(ts/32768*PI))/2+1),.005),
fpwm=x=>((((x&128?0:127)&&x)&((x&128?0:127)||x))-192+(((x&128?0:255)&&x)-((x&128?0:127)||x))&255)/127-1,
tri=x=>((asin(sin(x*PI/127-1))*84)&~15)/127,
atari=x=>hpf(((((AL=(t?atariRandom:atariRandom=rs('01',16)))[((x*AL.length)>>9)%AL.length]*128)&128)&255)/127-1,.008),

bpm=140,tone=440,transpose=2**(-4/12),

ts=t*bpm/(60*(SR=22050)/32768)/2,tt=t/SR*256*tone*transpose,

note=p=>2**(p/12),
noteAdv = (P, O, T) => 2 ** (P / 12) * 2 ** (T / 12) * 2 ** O,

deNaN=i=>isNaN(i)?0:i,

mseq=(...p)=>deNaN(parseInt(...p,36)),

  (sA = function (mode) {
    if (mode == "1") {
      return (ts/4096%1)**1.5;
    } else return 1;
  }),

chrd = chords = (tone = T => T, chrdNotes = [0], trnsp = 0, wave = input => (input / 128 % 2 - 1 + input / 127 % 2 - 1) / 2) => {
	let idx = chr = 0
	let maxPoly = 8
	for (; idx < min(maxPoly, chrdNotes.length); idx++)
		chr += wave(tone((chrdNotes[idx] + trnsp)))
	return maxPoly ? chr / maxPoly : 0
},

str=(txt,idx)=>txt.charCodeAt(idx%txt.length),
gate="11111111111111110111111111111111"[ts>>14&31],

me="            HIIIHHHHDDDDAAAAFFFFFFFFDDDD==  <===????====????????"+"AAAADDDD    EFFFFFFFCDDD==  <===AAAABBB ?AAA??????? ====<<< <==="+"            ?AAABBBBAAAADDDDFFFFHHH HII KMKMKKK IIIIHHHHFFFFDDDD"+"FFFFFFF CDDDAAAAAAA <===????AAAAHHHHHHH EFFFCDDDDDD ?AAAAAAAAAA ",

R=random,

Mtr=lr=>(
echoBPM(16384,hpf(R(),.6)*(1-(ts*('1114'[ts>>14&3]))/32768%1)**4)*sA(K='1000100010011010'[ts>>12&15])*2
+sin(.9995**(ts%4096)*16)*2*(1-ts/4096%1)*K
+hpf(R(),.6)*(1-ts/8192%1)**1.5
+(chrd(x=>tt*note(x),[[0,4,7,11],[-1,3,6,9],[-5,-1,2,6],[-5,-1,4,7]][ts>>15&3],0,input=>pwm(input))*3*sA(K))/4
+rv(12288,fm(tt*2*noteAdv(str(me.replaceAll(' ','\0'),(ts>>11))-7,0,1)/32)/2,lr)*2*sA(K)
),

[Mtr(0),Mtr(1)]