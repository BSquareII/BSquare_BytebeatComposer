isNaN(this.Time)?Time=-1:0,Time++,

callCount=0,
Time||(
meterthrow="",
z1_=[],z2_=[],
Fa=(T) => {
	var OJ=[[],[],[],[]], O="\n", Te = NaN, N=0, A=[];
	let Fun=(A)=>{
		for(var i=0; i<A.length; i++) {
			if (A[i] == Te) {} else {
				OJ[0][i] = A[i];
				OJ[1][i] = i;
			};
			Te = A[i]
		};
		N=-1;
		for(var i=0; i<A.length; i++) {
			if(OJ[0][i]==null) {} else {
				N+=1;
				OJ[2][N] = OJ[0][i]
				OJ[3][N] = OJ[1][i]
			}
		}
		for(var i=0; i<OJ[3].length; i++) {
			O+="			{start:bt*"+OJ[3][i]+", end:bt*"+((i+1==OJ[3].length)?T.length:OJ[3][i+1])+", note:2**(("+OJ[2][i]+"+Bo)/12)},\n";
		}
	}
	if (typeof T == 'object') {
		Fun(T)
	} else if (typeof T == 'string') {
		for(var i=0; i<T.length; i++) {
			A[i]=T.charCodeAt(i)
		};
		Fun(A)
	}
	return eval("["+O+"]")
},
hpf_=(a,c)=>{
	return call=callCount++,z1_[call]??=0,a-(z1_[call]+=(a-z1_[call])*c)
},
f=(keys)=>{
    if (!Array.isArray(keys)) {
			keys=[keys];
    }

    // Check for 'off' in the array
    if (keys.includes('off')) {
			const line1=`┌─┬─┬┬─┬─┬─┬─┬┬─┬┬─┬─┬─┬─┬┬─┬─┬─┬─┬┬─┬┬─┬─┬─┬─┬┬─┬─┬─┬─┬┬─┬┬─┬─┬─┬─┬┬─┬─┬─┬─┬┬─┬┬─┬─┐`
			const line2=`| | || | | | || || | | | || | | | || || | | | || | | | || || | | | || | | | || || | |`
			const line3=`| └┬┘└┬┘ | └┬┘└┬┘└┬┘ | └┬┘└┬┘ | └┬┘└┬┘└┬┘ | └┬┘└┬┘ | └┬┘└┬┘└┬┘ | └┬┘└┬┘ | └┬┘└┬┘└┬┘ |`
			const line4=`|  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |`
			const line5=`└──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘`
			return `\n${line1}\n${line2}\n${line2}\n${line3}\n${line4}\n${line4}\n${line5}`;
    }

    let positions={
			c_0: ' ', d_0: ' ', f_0: ' ', g_0: ' ', a_0: ' ',
			c_1: ' ', d_1: ' ', f_1: ' ', g_1: ' ', a_1: ' ',
			c_2: ' ', d_2: ' ', f_2: ' ', g_2: ' ', a_2: ' ',
			c_3: ' ', d_3: ' ', f_3: ' ', g_3: ' ', a_3: ' ',

			c0: '  ', d0: '  ', e0: '  ', f0: '  ', g0: '  ',
			a0: '  ', b0: '  ', c1: '  ', d1: '  ', e1: '  ',
			f1: '  ', g1: '  ', a1: '  ', b1: '  ', c2: '  ',
			d2: '  ', e2: '  ', f2: '  ', g2: '  ', a2: '  ',
			b2: '  ', c3: '  ', d3: '  ', e3: '  ', f3: '  ',
			g3: '  ', a3: '  ', b3: '  '
    };

    for (let key of keys) {
			// Convert to 0-35 range
			let g=key>0?round(key)%48:48+round(key)%48;

			if (g%48 === 1) positions.c_0='█';
			if (g%48 === 3) positions.d_0='█';
			if (g%48 === 6) positions.f_0='█';
			if (g%48 === 8) positions.g_0='█';
			if (g%48 === 10) positions.a_0='█';
			if (g%48 === 13) positions.c_1='█';
			if (g%48 === 15) positions.d_1='█';
			if (g%48 === 18) positions.f_1='█';
			if (g%48 === 20) positions.g_1='█';
			if (g%48 === 22) positions.a_1='█';
			if (g%48 === 25) positions.c_2='█';
			if (g%48 === 27) positions.d_2='█';
			if (g%48 === 30) positions.f_2='█';
			if (g%48 === 32) positions.g_2='█';
			if (g%48 === 34) positions.a_2='█';
			if (g%48 === 37) positions.c_3='█';
			if (g%48 === 39) positions.d_3='█';
			if (g%48 === 42) positions.f_3='█';
			if (g%48 === 44) positions.g_3='█';
			if (g%48 === 46) positions.a_3='█';

			if (g%48 === 0) positions.c0='██';
			if (g%48 === 2) positions.d0='██';
			if (g%48 === 4) positions.e0='██';
			if (g%48 === 5) positions.f0='██';
			if (g%48 === 7) positions.g0='██';
			if (g%48 === 9) positions.a0='██';
			if (g%48 === 11) positions.b0='██';
			if (g%48 === 12) positions.c1='██';
			if (g%48 === 14) positions.d1='██';
			if (g%48 === 16) positions.e1='██';
			if (g%48 === 17) positions.f1='██';
			if (g%48 === 19) positions.g1='██';
			if (g%48 === 21) positions.a1='██';
			if (g%48 === 23) positions.b1='██';
			if (g%48 === 24) positions.c2='██';
			if (g%48 === 26) positions.d2='██';
			if (g%48 === 28) positions.e2='██';
			if (g%48 === 29) positions.f2='██';
			if (g%48 === 31) positions.g2='██';
			if (g%48 === 33) positions.a2='██';
			if (g%48 === 35) positions.b2='██';
			if (g%48 === 36) positions.c3='██';
			if (g%48 === 38) positions.d3='██';
			if (g%48 === 40) positions.e3='██';
			if (g%48 === 41) positions.f3='██';
			if (g%48 === 43) positions.g3='██';
			if (g%48 === 45) positions.a3='██';
			if (g%48 === 47) positions.b3='██';
    }

const line1=`┌─┬─┬┬─┬─┬─┬─┬┬─┬┬─┬─┬─┬─┬┬─┬─┬─┬─┬┬─┬┬─┬─┬─┬─┬┬─┬─┬─┬─┬┬─┬┬─┬─┬─┬─┬┬─┬─┬─┬─┬┬─┬┬─┬─┐`;
const line2=`| |${positions.c_0}||${positions.d_0}| | |${positions.f_0}||${positions.g_0}||${positions.a_0}| | |${positions.c_1}||${positions.d_1}| | |${positions.f_1}||${positions.g_1}||${positions.a_1}| | |${positions.c_2}||${positions.d_2}| | |${positions.f_2}||${positions.g_2}||${positions.a_2}| | |${positions.c_3}||${positions.d_3}| | |${positions.f_3}||${positions.g_3}||${positions.a_3}| |`;
const line3=`| └┬┘└┬┘ | └┬┘└┬┘└┬┘ | └┬┘└┬┘ | └┬┘└┬┘└┬┘ | └┬┘└┬┘ | └┬┘└┬┘└┬┘ | └┬┘└┬┘ | └┬┘└┬┘└┬┘ |`;
const line4=`|${positions.c0}|${positions.d0}|${positions.e0}|${positions.f0}|${positions.g0}|${positions.a0}|${positions.b0}|${positions.c1}|${positions.d1}|${positions.e1}|${positions.f1}|${positions.g1}|${positions.a1}|${positions.b1}|${positions.c2}|${positions.d2}|${positions.e2}|${positions.f2}|${positions.g2}|${positions.a2}|${positions.b2}|${positions.c3}|${positions.d3}|${positions.e3}|${positions.f3}|${positions.g3}|${positions.a3}|${positions.b3}|`;
const line5=`└──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘`;


    return `\n${line1}\n${line2}\n${line2}\n${line3}\n${line4}\n${line4}\n${line5}`;
},
ff=(t,a=128,c='█',o='-',o2='█')=>{
	return o2+Array.from({length:a},(_,i)=>o.repeat(a-1-i)+c).reverse()[min(max(t*a/64|0,0),a-1)]},
rms=(a,decayF)=>{
	call=callCount++;
	z2_[call]??={var:0};
	z2_[call].var=(1-decayF)*z2_[call].var+decayF*a*a;
	return sqrt(z2_[call].var)
},
text=(n,meter, a)=>{
	return '\nDB'+n+': '+meter.toFixed(3)+' '+['', '!'][(meter>30)|0] +
	'\n'+ff(c=meter+10, a, '╗', '═','╔') +
	'\n'+ff(c, a, '║', '█', '║')+
	'\n'+ff(c, a, '╝', '═', '╚')
},
Update=(a, a2, a3, Song)=>{
	result=S=>S*127.7;
	if (typeof Song == 'object') {
		meter=[(20*log10(rms(abs(hpf_(result(Song[0]), a2*2)), a3*2))),(20*log10(rms(abs(hpf_(result(Song[1]), a2*2)), a3*2)))]
		meterthrow = '\n'+text(" 1",meter[0], a)+text(" 2",meter[1], a)
	}else{
		meter=[0,0].fill((20*log10(rms(abs(hpf_(result(Song), a2)), a3))))
		meterthrow = '\n'+text("",meter[0], a);
	}
},
gT=(c,separate=false,ShowText=false,texts,Showmeterthrow=false)=>{
  let keys=Array.isArray(c)?c:[c];
  let activeKeys=keys.filter(key=>key !== '')
  let keyboardStr=''
	if (separate && Array.isArray(c)) {
		if (ShowText) {
			for (let i=0; i < activeKeys.length; i++) {
				keyboardStr+=texts[i]+f(c[i])+"\n"
			}
		} else {
			for (let i=0; i < activeKeys.length; i++) {
				keyboardStr+=f(c[i])
			}
		}
	} else {
		if (ShowText) {
			keyboardStr=texts[0]+f(c)
		} else {
			keyboardStr=f(c)
		}
	}
	throw `\nKeys: [${keys.join(', ')}]\n`+keyboardStr+(Showmeterthrow?meterthrow:"");
}
),

BPM=115,sampleRate=48e3,r=abs(Time/sampleRate/180*3*32768*BPM)/2,
m=midiNote=(note,transpose)=>((Time+(Time?v:v=random()*9e9))/sampleRate*256)*450*2**((note-69+transpose)/12)*(note>-1?note<128?1:0:0)||0,

// What you're seeing here is Feeshbread's Dead Data Reverb code.
Time||(
	wsin=(phase,W=cos)=>(-W(phase/128*PI)+1)*128-.5,
	fx=[],dMax=1e6,
	lpf=lowPassFilter=(a,c)=>(
		lp_fxii=fxi++,
		fx[lp_fxii]??=0,
		fx[lp_fxii]+=(a-fx[lp_fxii])*c
	),
	hpf=highPassFilter=(a,c)=>a-lpf(a,c),
	bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc),hc),
	dly=multiTapDelay=(audio,heads,dw,fbfn=x=>x)=>{
		dly_fxii=fxi++;
		fx[dly_fxii]??=Array(dMax).fill(0);
		dly_wi=dt%dMax;
		dly_feed=audio;
		dly_out=0;
		for(let head of heads){
			dly_ri=(dMax+dt-round(head.t))%dMax;
			dly_feed+=fx[dly_fxii][dly_ri]*head.fb;
			dly_out+=fx[dly_fxii][dly_ri]*head.m;
		}fx[dly_fxii][dly_wi]=fbfn(dly_feed);
		return audio*(1-dw)+dly_out*dw
	}
),fxi=0,dt=Time,q=(30*sampleRate)/(BPM*2/3),
rvrbHeads=
[
	[
		{t:1e3+wsin(Time/210),m:.6,fb:.3},
		{t:1e4+wsin(Time/250),m:.5,fb:.5},
		{t:17e3+wsin(Time/300),m:.3,fb:.7},
		{t:37e3+wsin(Time/380),m:.2,fb:.9},
		{t:q*1.005+wsin(Time*1.005/256),m:1,fb:.75}
	],[
		{t:11e2-wsin(Time/230,sin),m:.6,fb:.3},
		{t:13e3-wsin(Time/270,sin),m:.5,fb:.5},
		{t:14e3-wsin(Time/280,sin),m:.3,fb:.7},
		{t:4e4-wsin(Time/400,sin),m:.2,fb:.9},
		{t:q*.995-wsin(Time*.995/256,sin),m:1,fb:.75}
	]
],
N = [1,1,1,-4,-4,-4,1,1,1,1,3,5,5,5,8,8,7,7,7,3,3,3,15,15,15,15,10,7,7,7,4,4,5,5,5,3,3,3,0,0,0,0,-2,-2,0,0,3,3,7,7,7,3,3,3,10,10,10,10,7,7,12,12,7,7,8,8,8,5,5,5,12,12,12,12,10,10,8,8,10,10,15,15,15,10,10,10,7,7,7,7,3,3,15,15,16,16,17,17,17,15,15,15,12,12,12,12,8,8,12,12,15,15,17,17,17,19,19,19,20,20,20,20,19,19,17,15,12,8],
bt=12,

SAMP_RATE = 51900-11025,
BPM = 100,
ts = t / SAMP_RATE,
beat = BPM * ts / 60,
tick = floor(beat * 48) % (bt*128)+1,

C = 261.63,
Cs = 277.18,
D = 293.66,
Ds = 311.13,
E = 329.63,
F = 349.23,
Fs = 369.99,
G = 392.00,
Gs = 415.30,
A = 440.00,
As = 466.16,
B = 493.88,
Bo=90,


window.channels = t>0 ? window.channels : [
	{	
		ndx: 0,
		freq: 0,
		porta: 0,
		vibrato: 0,
		held: false,
		notes: Fa(N),
	},
],

lerp = function(v0, v1, tq) {return (1 - tq) * v0 + tq * v1},
clamp = function(num, min, max) {return num <= min ? min : num >= max ? max : num},

window.channels.forEach(chan => {
	let { ndx } = chan;
	let note = chan.notes[ndx];
	const localTick = tick - (chan.delay || 0);
	while(localTick >= note.end) {
		++ndx;
		if(ndx >= chan.notes.length) {
			ndx = 0;
			break;
		}
		note = chan.notes[ndx];
	}
	chan.ndx = ndx;
	note = chan.notes[ndx];
	let inc = 1/(note.end-note.start)/(SAMP_RATE/(BPM*1.25));
	chan.held = localTick >= note.start && localTick < note.end-1;
	if (note.target) {
		if (chan.porta < 1) chan.porta += inc;
		chan.freq = localTick >= note.start && localTick < note.end ? lerp(note.note, note.target, chan.porta) : chan.freq;
	} else {
		chan.porta = 0;
		chan.freq = localTick >= note.start && localTick < note.end ? note.note : chan.freq;
	}
	if (note.vibrato) {
		chan.vibrato = sin(ts*32)*8;
		chan.freq += chan.vibrato;
	}
}),

LPF=function() {
	this.cut = 0.5,
	this.res = 0.95,

	this.fb = fb=this.res+this.res/(1-this.cut),

	this.lp6=0,
	this.lp12=0,
	this.lp18=0,
	this.lp24=0,

	this.bp24=0,
	this.hp24=0,

	this.process = function(i) {
		this.fb = fb=this.res+this.res/(1-this.cut);
		
		this.lp6+=this.cut*(i-this.lp6+this.fb*(this.lp6-this.lp12)); // 1 pole
		this.lp12+=this.cut*(this.lp6-this.lp12); // 2 poles
		this.lp18+=this.cut*(this.lp12-this.lp18); // 3 poles
		this.lp24+=this.cut*(this.lp18-this.lp24); // 4 poles

		// Let's turn a lowpass filter into a SVF I guess?
		this.bp24=this.lp18-this.lp24;
		this.hp24=this.lp24-i;
	};

	return this;
},

ADSR=function() {
	this.a = 0;
	this.d = 0.5;
	this.s = 0.5;
	this.r = 0.1;

	this.state = 0;
	this.value = 0;
	this.held = false;
	this.process = function(){
		if (this.state == 4 && this.held) {
			this.state = 0;
		}
		
		let inc = 1/SAMP_RATE*4;
		switch(this.state) {
			case 0: // Attack
				if(this.value >= 1 || this.a == 0){ 
          		this.value = 1;
            	this.state = 1;
          	} else {
					if (!this.held) this.state = 3;
            	this.value += inc/this.a;
          	}
				break;
			case 1: // Decay
				if(this.value <= this.s || this.d == 0) {
					this.value = this.s;
					this.state = 2;
				} else {
					if (!this.held) this.state = 3;
					this.value -= inc/this.d;
				}
				break;
			case 2: // Sustain
				if(this.value <= this.s) {
					this.value = this.s;
					if (!this.held) this.state = 3;
				} else if (this.s == 0) {
					this.state = 3;
				} else {
					this.value -= inc;
				}
				break;
			case 3: // Release
				if (this.value <= 0 || this.r == 0) {
					this.value = 0;
					this.state = 4;
				} else {
					if (this.held) this.state = 0;
					this.value -= inc/this.r;
				}
		}
		return this.value;
	}
	return this;
},

SawVoice=function() {
	this.freq = C;
	this.phase = 0;

	this.process = () => {
		if (this.freq == 0) {this.phase = 0; this.amp = 0;} else this.amp = 1;
		this.phase += this.freq/SAMP_RATE;
		return ( (this.phase-Math.floor(this.phase) )-0.5)*2*this.amp
	}

	return this;
},
("undefined"!=typeof s1&&null!=s1||(s1=new SawVoice),s1),
s1.freq = window.channels[0].freq,

("undefined"!=typeof tone&&null!=tone||(tone=new LPF),tone),
tone.cut=.1,tone.res = 0,

("undefined"!=typeof filterenv&&null!=filterenv||(filterenv=new ADSR),filterenv), filterenv.held = window.channels[0].held,
filterenv.a=0,filterenv.d=2,filterenv.s=0.0,filterenv.r=1,
a=.01,
("undefined"!=typeof acid&&null!=acid||(acid=new LPF),acid),
lfo = (sin(5+beat/4)/2)+0.5,
acid.cut = (clamp(lfo,0,0.99)/2+0.15) + filterenv.process()/8,
acid.cut = ((1-a)*acid.cut**2)+a,
acid.res = 0.95,

("undefined"!=typeof ampenv&&null!=ampenv||(ampenv=new ADSR),ampenv), ampenv.held = window.channels[0].held,
ampenv.a=0,ampenv.d=2,ampenv.s=0.5,ampenv.r=0.1,

ws=(x,d)=>x*(Math.abs(x)+d)/(x**2+(d-1)*Math.abs(x)+1),

tone.process(s1.process()), acid.process(tone.hp24),
Q=ws(
	acid.lp24*ampenv.process()
,10)/2,
Q=[sin(dly(Q,rvrbHeads[0],.4,x=>tanh(bpf(x,.01,.8)/200)*100)),sin(dly(Q,rvrbHeads[1],.4,x=>tanh(bpf(x,.01,.8)/200)*100))],

//t&1?Update(128, .001, 1/500, Q):0,
(t%256==255)?gT([10+N[floor(beat*4)%128]],0,1,["Phím 1"],1):Q