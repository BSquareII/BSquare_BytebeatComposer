BPM=130,sampleRate=48e3,r=abs(t/sampleRate/180*3*32768*BPM)/2,tt=((t+(t?v:v=random()*9e9))/sampleRate*256)*446,
m=midiNote=(note,transpose)=>tt*2**((note-69+transpose)/12)*(note>-1?note<128?1:0:0)||0,

// What you're seeing here is Feeshbread's Dead Data Reverb code.
t||(
	wsin=phase=>(-cos(phase/128*PI)+1)*128-.5,
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
),fxi=0,dt=t,q=(30*sampleRate)/(BPM*2/3),
rvrbHeads=
[
	[
		{t:1e3+wsin(t/210),m:.6,fb:.3},
		{t:1e4+wsin(t/250),m:.5,fb:.5},
		{t:17e3+wsin(t/300),m:.3,fb:.7},
		{t:37e3+wsin(t/380),m:.2,fb:.9},
		{t:q*1.005+wsin(t*1.005/256),m:1,fb:.75}
	],[
		{t:11e2-wsin(t/230),m:.6,fb:.3},
		{t:13e3-wsin(t/270),m:.5,fb:.5},
		{t:14e3-wsin(t/280),m:.3,fb:.7},
		{t:4e4-wsin(t/400),m:.2,fb:.9},
		{t:q*.995-wsin(t*.995/256),m:1,fb:.75}
	]
],

sinc=x=>sin(sin(x)),
x=m((([0,0,1,3,0,0,-2,-4][r>>16&7])+t%([0,0,2,0,4,2,2,4][r>>12&7]+2+2*!!(r>>18))*7)+49,0),
y=m([0,0,1,3,0,0,-2,-4][r>>16&7]+49,0),

percOrgan=j=>bpf((asin(sinc(x*PI/128))/asin(1)+sinc(x*2*PI/128)+sinc(x*3*PI/128)+sinc(x*6*j*PI/128)*(1-r/4096%1)**.5+sinc(y/4*PI/128)/1.5+sinc(y/2*j*PI/128)/1.5)*((1-r/4096%1)**4/2+1)*(min(1,abs(sin(r*PI/4096))*32))/1.5+lpf(hpf(random()-.5,.2),.5)*(1-r/4096%1)**16*(x?1:0)*1.33,.005,.1)*2,

drums=_=>(sin(sin(10*(r%8192)**.3))*"10110100"[r>>13&7]*(1-r/8192%1)**.75+bpf(random(),.5,.9)*(1-r/4096%1)**3*'0110111101100101'[r>>12&15]+bpf(sin((t>>2)**32),.4,.2)*3*(1-r/16384%1)**4*(r>>14&1))*!!(r>>18)*2,

[atan(dly(percOrgan(1.005),rvrbHeads[0],.3,x=>tanh(bpf(x,.01,.8)/200)*100)*min(1,1.5-(1-r/8192%1)**.25*"10110100"[r>>13&7]*!!(r>>18))+drums()),atan(dly(percOrgan(.995),rvrbHeads[1],.3,x=>tanh(bpf(x,.01,.8)/200)*100)*min(1,1.5-(1-r/8192%1)**.25*"10110100"[r>>13&7]*!!(r>>18))+drums())]