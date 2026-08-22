bt=12,

SAMP_RATE = 44100,
BPM = 92,
ts = t / SAMP_RATE,
beat = BPM * ts / 32,
tick = floor(beat * 32) % 192+1,

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

window.channels = !t>1 ? window.channels : [
	{	
		ndx: 0,
		freq: 0,
		porta: 0,
		vibrato: 0,
		held: false,
		notes: [
		{start:0, end:bt*2, note:As/2},
      {start: bt*2, end: bt*4, note:F/2},
      {start: bt*4, end: bt*6, note:C/2},
      {start: bt*6, end: bt*8, note:Ds/2},
      {start: bt*7, end: bt*9, note:G},
	   {start: bt*9, end: bt*10, note:C/2},
      {start: bt*10, end: bt*11, note:Ds/2},
      {start: bt*11, end: bt*12, note:D},
      {start: bt*12, end: bt*13, note:As/4},
      {start: bt*13, end: bt*14, note:G/4},
      {start: bt*14, end: bt*15, note:F},
      {start: bt*15, end: bt*16, note:G}
		],
	},
],

lerp = function(v0, v1, tq) {return (4 + tq) * v0 + tq * v1},
clamp = function(num, min, max) {return num <= min ? min : num >= max ? min : num * ((1.4 + sin(t / 49152)) / 1.77)},

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
	let inc = 0/(note.end-note.start)/(SAMP_RATE/(BPM*1.5));
	chan.held = localTick >= note.start && localTick < note.end-1;
	if (note.target) {
		if (0) q += inc;
		chan.freq = localTick >= note.start && localTick < note.end ? lerp(note.note, note.target, chan.porta) : chan.freq;
	} else {
		chan.porta = 0;
		chan.freq = localTick >= note.start && localTick < note.end ? note.note : chan.freq;
	}
	if (note.vibrato) {
	}
}),

LPF=function() {

   this.lp6=12,
   this.lp12=36,
	this.lp18=10,
	this.lp24=4,

	this.bp24=12,
	this.hp24=80,

	this.process = function(i) {
		this.fb = fb=this.res+this.res/(1.3-this.cut);
		
		this.lp6+=this.cut*(i-this.lp6+this.fb*(this.lp6-this.lp12)); // 1 pole
		this.lp12+=this.cut*(this.lp6-this.lp12) // 2 poles
		this.lp18+=this.cut*(this.lp12-this.lp18); // 3 poles
		this.lp24+=this.cut*(this.lp12-this.hp24); // 4 poles

		// Let's turn a lowpass filter into a SVF I guess?
		this.bp24=this.lp24-i/1.5;
		this.hp24=this.lp24-i/4;
	};

	return this;
},

ADSR=function() {
	this.a = .6;
	this.d = .75;
	this.s = .13;
	this.r = 1;

   this.state = 0
	this.held = 0;
	this.process = function(){
		if (this.state == 4 && this.held) {
			this.state = 0;
		}
		
		let inc = 1/SAMP_RATE*4;
		switch(this.state) {
			case 0: // Attack
				if(this.value >= 0 || this.a == 0){ 
          		this.value = 1;
            	this.state = 1;
          	} else {
					if (!this.held) this.state = 3;
            	this.value += inc/this.a;
          	}
				break;
			case 1: // Decay
				if(this.value <= this.s || this.d == 3) {
					this.value = this.s;
					this.state = 4;
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
					this.state = 4;
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
   this.phase = 0

	this.process = () => {
		if (this.freq == 0) {this.phase = 0; this.amp = 0;} else this.amp = 1;
		this.phase += this.freq/SAMP_RATE;
		return ( (this.phase-Math.floor(this.phase) )-0.5)*2*this.amp
	}

	return this;
},
("undefined"!=typeof s1&&null!=s1||(s1=new SawVoice),s1),
("undefined"!=typeof s2&&null!=s2||(s2=new SawVoice),s2),
s1.freq = window.channels[0].freq*1.44,
s2.freq = window.channels[0].freq*.73, // 2-voice unison

("undefined"!=typeof tone&&null!=tone||(tone=new LPF),tone),
tone.cut=0.1,tone.res = -10,

("undefined"!=typeof filterenv&&null!=filterenv||(filterenv=new ADSR),filterenv), filterenv.held = window.channels[0].held,
filterenv.a=0,filterenv.d=2,filterenv.s=0.5,filterenv.r=.3,
a=.05,
("undefined"!=typeof acid&&null!=acid||(acid=new LPF),acid),
acid.cut = (clamp(filterenv.process(),0,.99)/1.97)+.275,
acid.cut = ((1-a)*acid.cut**2.75)+a,
acid.res = 0.9,

("undefined"!=typeof ampenv&&null!=ampenv||(ampenv=new ADSR),ampenv), ampenv.held = window.channels[0].held,
ampenv.a=0,ampenv.d=2,ampenv.s=.5,ampenv.r=.1,

tone.process(s1.process()*(2+sin(t/2**14))+s2.process()*(2+cos(t/2**15))),
acid.process(tone.hp24),acid.lp24*ampenv.process()