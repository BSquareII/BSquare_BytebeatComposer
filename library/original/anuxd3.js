//credits: feeshbread and greaserpirate

/*
links:
https://www.reddit.com/r/bytebeat/comments/1f7i53w/infenitely_instantiable_1_pole_6dboct_filters/
https://www.reddit.com/r/bytebeat/comments/10bv1d5/the_motherlode_a_bundle_of_effects_lowpass_filter/
*/

t?0:z1=[],
callCount=0,
lpf=lowPassFilter=(a,c)=>(
	call=callCount++,
	z1[call]??=0,
	z1[call]+=(a-z1[call])*c
),
hpf=highPassFilter=(a,c)=>a-lpf(a,c),
bpf=bandPassFilter=(a,hc, lc)=>hpf(lpf(a,lc), hc),
nf=notchFilter=(a,lc, hc)=>(hpf(a, hc)+lpf(a,lc))/1.75,
lbf=lowBoostFilter=(a,c,v)=>a+lpf(a,c)*v,
hbf=highBoostFilter=(a,c,v)=>a+hpf(a,c)*v,

r = repeat = (x, y) => Array(x).fill(y).flat(9),

t ? 0 : fx = r(4e4, 0),
// Iterator, resets to 0 at every t
fxi = 0,

// NOTE: IF YOU ALTER T, DO IT AFTER THIS FUNCTION
t2 = t,
//dsp = downsample the bitrate of the reverb, dsp=1 cuts uses half as much space, 2 uses 1/4, etc
rv = reverb = (x, len = 4096, feedb = .6, dry = .7, wet = .9, dsp = 0) => (
	ech = fxi + ((t2 % len) >> dsp),
	x = x * dry + wet * fx[ech],
	fx[ech] = x * feedb, //shorter, but lower res = louder
	//t2 % (1<<dsp) ? 0 : fx[ech] = x * feedb,
	fxi += len >> dsp,
	x
),

t/=1.68,a=t=>{for(A=B=0;A<7;A++)B+=t*1.5**A*2**([0,2,5,7,9,10,12,17][(t>>13^t/3>>12)&7]/12)&(~t>>7&127|128);return B/A},[a(t),-a(t+30*sin(t/3e3))-1].map(x=>rv(rv(hpf(lbf(lpf(x,.04),.03,.7),.009)),12288,.7,1.1,.8)/128)