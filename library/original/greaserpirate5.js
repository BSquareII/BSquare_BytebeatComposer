// A collection of effects you can use on _ANY_ variable that changes


//Original t, increments one per sample. The reverb, harmonifier, hihat, and snare need this.
t2 = t,

//Change t here, not below, or it messes with the snare/hihat sounds
t /= 2,

// Repeat x beats of y
// SUPER useful if you're writing complex beats/melodies
// Include this or the FXs won't work (or you could replace r(x, y) with Array(x).fill(y))
// r(1,[arrays]) also serves as a replacement for [arrays].flat()
r = repeat = (x, y) => Array( x ).fill( y ).flat( 9 ),

sp = (str, sep='') => str.split( sep ),
j = (arr, sep='') => arr.join( sep ),

//tra = transpose = (arr, amt) => arr.map(x=>x+amt),
tra = transpose = (x, amt) => Array.isArray(x)? x.map( e => e + amt ) : j( sp(x).map( e => e + amt ) ),

// Uses up a lot of chars and isn't /super/ readable, but a major timesaver when creating
// Particularly the NaN handing
m = mix = (x, vol=1, dist=0) => ( ( x * vol * ( 1 + dist ) ) % ( 256 * vol) )||0,

// Waveshaper distortion
ds = (x, amt) => x * (1 - amt) + (128 * ((x / 128) - 1) ** 3 + 128) * amt,

//seq = (arr, spd, T=t) => eval(arr[(T >> spd) % arr.length]), //more functionality, but drastic worse performance :(
seq = (arr, spd, T=t) => arr[(T >> spd) % arr.length],
mseq = (...x) => t * 2 ** (seq(...x) / 12),


// The Breakbeat drum machine. This is where the magic happens
// It sequences through an array and plays the corresponding number of beats
//    (1 = quarter note, 2 = 2 8th notes, etc)
// Something interesting happens when you don't use powers of 2, however:
//    You get strange and wonderful sounds
// the variables 's' and 'h' make it sound like a snare and a hihat, respectively
// most sounds are different timbres of the same note
// but if you replace 'T' with something other than t, such as any bytebeat melody,
// you can apply that timbre to the melody.
// Adding / &ing a breakbeat with a melody can also add attack to the notes of the melody
bt = beat = (arr, spd, vel = 2e4, vol = 1, T = t, oct = 0) =>
	m(vel / (T & (2 ** (spd - oct) / seq( arr, spd ) ) - 1), vol),

ls = sin(t2 / 9 & t2 >> 5), // long snare
//ls = sin(t>>5), // acoustic-sounding grungy snare
//s = (((t*8/48)>>9) & 1) ? 0 : sin(t / 9 & t >> 5), // Snare
s = seq( [ls, 0], 11), // Snare
S = seq( [ls, 0], 8), // double snare
//s = sin((t | t * .7) >> 4), // quieter snare
//h = 1 & t * 441/480, // long Hihat
h = 1 & t2 * 441/480, // long Hihat
h = seq( [h,h,h,0], 8), //quieter, faster attack



// The FX rack, stores memory for use in effects
// Automatically keeps track of what's stored where
// If you see red (NaNs), raise 5e4 higher, or adjust your reverbs' 'dsp' variable
// Works best when FX are not inside conditionals (meaning the number of FX in use changes)
// But even then, should only create a momentary click/pop (might be more severe for reverb)
// You can also set it to [] and modify the effects to read m(fx[stuff]) to get around NaN issues
//    ^(this gets rid of the lag when editing, but sparse arrays might be slower during runtime)
t ? 0 : fx = r( 4e4, 0 ),
// Iterator, resets to 0 at every t
fxi = 0,

//dsp = downsample the bitrate of the reverb, dsp=2 cuts uses half as much space, 3 uses 1/3, etc
rv = reverb = (x, len = 16e3, feedb = .7, dry = .4, wet = 1, dsp = 1, T=t2) => (
	ech = y => fxi + ( 0|(y % len) / dsp ),
	x = x*dry + wet*fx [ech(T) ] || 0,
	t2 % dsp ? 0 : fx[ ech(t2) ] = x * feedb,
	fxi += 0|(len / dsp),
	x
),


lp = lopass = (x, f) => ( // f ~= frequency, but not 1:1
	// fx[fxi] is the value of the last sample
	// You will need to change the 'x % 256' if you're using signed or floatbeat
	x = min( max( x % 256, fx[fxi] - f), fx[fxi] + f), // Clamp the change since last sample between (-f, f)
	fx[fxi] = x,
	fxi++,
	x
),

// Sounds kinda off, and hipass+lopas=/=original when you use ^, but + sounds harsher
hp = hipass = (x, f) => (x % 256) ^ lp(x, f),

//sp = speed
lim = limiter = (x, sp = .1) => (
	x &= 255,
	mi = fx[fxi] = min( fx[fxi] + sp, x, 255),
	mx = fx[fxi + 1] = max( fx[fxi + 1] - sp, x, mi+9),
	fxi += 2,
	(x-mi) * 255/(mx-mi)
),

clip = x => x ? min( x, 255 ) : 0,

//downsample
//dsp = downsample = (x, res) => (
//	x = fx[fxi] = t2 & res ? x : fx[fxi],
//	x
//),

// Multi-voice melody: 'voices' is like a list of resonances
//mvm = (melody, speed, voices) => (
//	vcp = voices,
//	vcp.reduce((sum, i) =>
//		sum + m(i * t * 1.05946 ** melody[(t >> speed) % melody.length], .9 / vcp.length), 0)
//),



// XORs the input with its harmonics, controlled by the bits of a number ('tone')
// Unoptimized version
//hm = harmonify = (x,tone) => {
//	o = 0;
//	//len=8;
//	len = log2(tone) + 1;
//	for (i=0; i<len; i++) {
//		o ^= ( 1 & (tone>>i) ) * (i+1)/2 * x
//	}
//	return o;
//},


// Instead of computing on the fly, this version computes a wavetable at the start
// Side effects: you can't start the song at any t, and output is always full-volume
hm = harmonify = (x, tone, waveTableSize = 256 * t2/t | 0 ) => {
	//play from the buffer
	if( t2 > waveTableSize) {
		o = fx[ fxi + ( x * t2 / t & waveTableSize - 1) ];
		fxi += waveTableSize;
		return o
	}
	//fill the buffer
	for (i=0; i<8; i++) {
		fx[ fxi + t2 ] ^= ( 1 & (tone>>i) ) * (i+1)/2 * t
	}
	fxi += waveTableSize;
	//return x //not strictly necessary unless the wavetable size is large enough to notice silence at the start
},

//Basically just treat this like a black box and fiddle with the knobs at random
//For a more detailed exmplanation:
//	X, and the First 2 hexes of y, are the fun surprise knobs :)
//		Small changes in these values completely change the tone (most of the time)
//	The next 2 hexes of y control the harmonifier
// The next hex controls the *thump*/click/noise of the attack
// The next hex controls the decay
// The next 2 hexes control the lowpass
sy = synth = (melody, velTrack, speed, x, y, ...z)=>
	lp(
		min(
			m(
				hm(
					beat( [x], 10, 6e4, 1, melody, .02* ( (y>>24) & 255 ) )
				, ( y>>16 ) & 255, ...z
				)
			, .9,1
			)
			+ beat( velTrack, speed, 2e3 * ( (y>>12) & 15) )
		, beat( velTrack, speed, 1, 4e4 * ( (y>>8) & 15 ) )
		)
	, y&255
	),


//saw 2 sine
s2s = sinify = x => sin( x*PI/64 ) * 126 + 128,

R = ( str, regex, replace ) => str.replaceAll( regex, replace ),
cc = ( str, speed, ) => t * 2 ** ( str.charCodeAt( ( t >> speed ) % str.length ) / 12 - 7 ),


//---------------------------SEQUENCES--------------

t || (

ma = "aAAZAAZacAaceAecaAAZAAZacAacfAec",
mb = R( ma, "A", "B" ),

bs = j( r( 2, [ r( 14, "e" ), "qe" ] ) ) + j( r( 2, [ r( 14, "f" ), "rf" ] ) ),
bsv = " 11 11 1 1 1 111",

mc = "a`^]",
md = "cceeffeecceeffhi",
me = "jijlmljl",
mf = "oqrquqrtvqoqrtuvxxxyuuvxvvutrrqq",

drk = j( r( 3, "10000100" ) ) + "10000102",
drs = "00100010",
drh = "0111011111010111"

),


//--------------------------MIXER-----------------

M1 = synth( m( cc( ma + mb, 12 ), 1 ), [1], 12, 1.5, 0x30070426),
M1 /= ( ( cc( ma + mb, 12 ) / t ) + 3 ),
M1 *= 2,

M2 = synth( cc( mc, 15 ) * 8, [1], 15, .3, 0x34070F99),
M3 = synth( cc( md, 14 ) * 8, [1], 14, .3, 0x34070F99),
M4 = synth( cc( me, 15 ) * 8, [1], 15, .3, 0x34070F99),
M5 = synth( cc( mf, 13 ) * 4, [1], 12, .3, 0x70020599),

BS = sinify( cc( bs, 12 ) / 8 ) * seq( bsv, 12 ),

CH = M2 / 8 + M3 / 8 + M4 / 8,
RV = lp( rv( M2 / 8 + M3 / 8 + M4 / 8 , 12e3, .8 ), 7 ),

DR = beat( drk, 12 ) + beat( [s], 12 ) * .9 * seq( drs, 12 ) + beat( [h], 11 ) * seq( drh, 11 ),
K = lp( beat( drk, 12, 2e5 ), 2),

comp = pan => lim( K / 4 + (
	pan ?
		M1 / 6 + RV / 2 + M5 / 17
	:
		M1 / 9 + RV / 3 + CH / 11 + M5 / 13
	), 9e-3),


Master = pan => clip( comp( pan ) * .4 + DR * .5 + K / 4 + BS / 2 ),

//lim( Master(0) * .6 + lim( Master(0) * .5, .1 ) * .3, .001 )
song = pan => lim( Master( pan ) * .8 + lim( Master( pan ), .1 ) * .2, .001 ),

[ song(0), song(1) ]