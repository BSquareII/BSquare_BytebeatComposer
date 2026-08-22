// A collection of effects you can use on _ANY_ variable that changes


//Original t, increments one per sample. The reverb, harmonifier, hihat, and snare need this.
T = t,

//Change t here, not below, or it messes with the snare/hihat sounds
t *= 441 / 480,

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
m = mix = (x, vol=1, dist=0) => ( ( x * vol * ( 1 + dist ) ) % ( 256 * vol ) ) || 0,

// Waveshaper distortion
// Assumes range is neatly between 0-255; use after limiter
// Negarive values make it rounder (though after .6 there are wraparound artifacts)
ds = (x, amt) => m(x) * (1 - amt) + 127 * ( ( ( m(x) / 127 ) - 1 ) ** 3 + 1 ) * amt,


seq = ( arr, spd, t2=t ) => arr[ (t2 >> spd) % arr.length ],
mseq = ( ...x ) => t * 2 ** ( seq(...x) / 12 ), //original
//mseq = ( ...x ) => t * 2 ** ( ( seq(...x) + ((t/9>>17)&3) )  / 12 ), //Trucker's Chorus version


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

ls = sin(T / 9 & T >> 5), // long snare
//s = sin(t>>5), // acoustic-sounding grungy snare
//s = (((t*8/48)>>9) & 1) ? 0 : sin(t / 9 & t >> 5), // Snare
s = seq( [ls, 0], 9), // Snare
S = seq( [ls, 0], 8), // double snare
//s = sin((t | t * .7) >> 4), // quieter snare
//h = 1 & t * 441/480, // long Hihat
h = 1 & T * 441/480, // long Hihat
h = seq( [h,h,h,0], 8), //quieter, faster attack



// The FX rack, stores memory for use in effects
// Automatically keeps track of what's stored where
// If you see red (NaNs), raise 5e4 higher, or adjust your reverbs' 'dsp' variable
// Works best when FX are not inside conditionals (meaning the number of FX in use changes)
// But even then, should only create a momentary click/pop (might be more severe for reverb)
// You can also set it to [] and modify the effects to read m(fx[stuff]) to get around NaN issues
//    ^(this gets rid of the lag when editing, but sparse arrays might be slower during runtime)
t ? 0 : fx = r( 4e5, 0 ),
// Iterator, resets to 0 at every t
fxi = 0,

//dsp = downsample the bitrate of the reverb, dsp=2 cuts uses half as much space, 3 uses 1/3, etc
rv = reverb = (x, len = 16e3, feedb = .7, dry = .4, wet = 1, dsp = 2, t2=T) => (
	ech = y => fxi + ( 0|(y % len) / dsp ),
	x = x*dry + wet*fx [ech(t2) ] || 0,
	T % dsp ? 0 : fx[ ech(T) ] = x * feedb,
	fxi += 0|(len / dsp),
	x
),


lp = lopass = (x, f) => ( // f ~= frequency, but not 1:1
	// fx[fxi] is the value of the last sample
	x = min( max( m(x), fx[fxi] - f), fx[fxi] + f), // Clamp the change since last sample between (-f, f)
	fx[fxi] = x,
	fxi++,
	x
),

// Sounds kinda off, and hipass+lopas=/=original when you use ^, but + sounds harsher
hp = hipass = (x, f) => m(x) ^ lp(x, f),

lim = limiter = ( input, speed = .1, lookahead = 64, wet = .9, thresh = 9, bias = 0, iters = 8, saturate = 0 ) => {
	l = x => fxi + 2 + ( T + x|0 ) % lookahead;
	fx[ l(0) ] = m(input);
	B = fx[ l(1) ]; //oldest in buffer
	d = [255,0];
	for( i=1; i < iters + 1; i++) {
		//d[0] = min( d[0], B, fx[ l( i * lookahead / iters) ] / i + B * ( 1 - 1/i) ); //harmonic 
		d[0] = min( d[0], B, fx[ l( i * lookahead / iters) ] * ( 1 - i / iters) + B * i / iters ); //linear
		d[1] = max( d[1], B, fx[ l( i * lookahead / iters) ] * ( 1 - i / iters) + B * i / iters ); //linear
	}
	mi = fx[ fxi ] = min( d[0], fx[ fxi ] + speed, 255 );
	mx = fx[ fxi+1 ] = max( d[1], fx[ fxi+1 ] - speed * ( bias + 1 ), mi + ( t ? thresh : 255 ) );
	fxi += 2 + lookahead;
	return ds( ( B - mi ) * 255/(mx-mi), saturate ) * wet + B * (1-wet)
},

//downsample
//dsp = downsample = (x, res) => (
//	x = fx[fxi] = T & res ? x : fx[fxi],
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
hm = harmonify = (x,tone) => {
	o = 0;
	//for (i=0; i < log2(tone) + 1; i++) { //flexible size of 'tone'
	for (i=0; i<8; i++) {
		o ^= ( 1 & (tone>>i) ) * (i+1)/2 * x
	}
	return o;
},

chorus = (x, amt) => m(x*(1-amt))/3 + m(x)/3 + m(x*(1+amt))/3,

// Instead of computing on the fly, this version computes a wavetable at the start
// Side effects: output is always full-volume
hm3 = harmonify = (x, tone, waveTableSize = 4) => {
	waveTableSize *= 64 * T / t | 0;
	//play from the buffer
	if( fx[fxi] > waveTableSize ) {
		o = fx[ fxi + 1 + ( x * T / t & waveTableSize - 1) ];
		fxi += 1 + waveTableSize;
		return o
	}
	//fill the buffer
	for (i=0; i<8; i++) {
		w = ( bitpos ) => ( 1 & ( tone >> ( i + bitpos ) ) ) * (i+1)/2;
		t3 = fx[fxi] * t / T;
		fx[ fxi + 1 + fx[fxi] ] ^= ( w(0) * t3 ) ^ ( abs( m( w(8) * t3 ) - 128 ) * 2 )
	}
	fx[fxi]++;
	fxi += 1 + waveTableSize;
	//return x //not strictly necessary unless the wavetable size is large enough to notice silence at the start
},

//Basically just treat this like a black box and fiddle with the knobs at random
sy = synth = (melody, velTrack, speed, y, ...z)=>
(
	//Controls
	x = ( pos, bits ) => ( y / ( 2 ** pos ) & 2 ** bits - 1 ),

	q = x( 48, 8 ) / 64,							//- - - - hex 1 - 2: mystery 1 (fractional beats)
	g = x( 40, 8 ) * .02,						//- - - - hex 3 - 4: mystery 2 ('octave' beat param)
	o = x( 24, 16 ),								//- - - - hex 5 - 8: Harmonifier (5-6 tri, 7-8 saw)
	z = x( 20, 4 ) + 1, 							//- - - - hex 9 : wavetable size
	c = x( 16, 4 ),								//- - - - hex 10: chorus
	n = x( 14, 2 ),								//- - - - hex 11: sine octave ( /4, no sine if 0)
	w = x( 12, 2 ) / 4, 							//- - - - - - - - - - (last 4 bits: waveshaping)
	d = 9 * t / T * 2 ** x( 8, 4 ), 			//- - - - hex 12: resonance decay
	w += min(.5, beat( velTrack, speed, 1, d ) ),
	a = 2e5 * t / T * ( x( 4, 4 ) + 1 ), 	//- - - - hex 13: note decay (higher = longer)
	a2 = -.6 + x( 4, 4 ) ** 2 / 200,
	l = 2 + ((y%16) ** 2) / 2, 						//- - - - hex 14: lopass


	n && ( melody = sinify( melody * 1/16 * 2 ** n ) ),
	c && ( melody = chorus( melody, ( c - 1 ) / 640) ),
	melody = ds( melody, w ),
	lim(
		lp(
			min(
				m(
					hm3(
						beat( [ q ], 10, 6e4, 1, melody, g )
					, o, z,
					)
				, 1, 1
				)
			, beat( velTrack, speed, 1, a )
			)
		, l
		)
	, .003, 32, .7, 64, 2, 4, a2
	)
),

//saw 2 sine
s2s = sinify = x => sin( x*PI/64 ) * 126 + 128,

// ------------ARRAYS------------

// Chrome lags when these are defined at every t
// weirdly though this isn't the case for functions
//note: any arrays with s or h must be outside the t||()
t || (

l1 = [1,2,3,4,3,2.5,2.5,2.5,1,2,3,4,3,2,2,2], // coeffs , not notes

mv = [1,1.5,2,2.5], // divisors, not notes

l2 = r(1, [
	r(6, 12 ), 10, 10, r(6, 7 ), 5, 7,
	r(5, 9 ), 10, 9, 7, r(6, 9), 7, 5,
	r(5, 4 ), 5, 4, 5, r(6, 7 ), 5, 7,
	r(4, 7 ), r(4, 8), r(4, 10), 10, 10.5, 10.75, 11
]),

0
),

//  ------------SONG------------

L1 = (t*l1[(t>>13)%16]/mv[(t>>18)%4]%256*(-t/4&2047)/2E3)%256/2+(t*l1[(t>>13)%16]/mv[(t>>18)%4]%256*(-t/8&2047)/2E3&128)%256/2,
L2 = mseq( l2, 14 )* 4,

L1s = synth( L1, [1], 13, 0x1aee7f27d05436 ), //voice saying "Bob"
//L1s = synth( L1, [1], 13, 0x075be62ae56534 ),

L2s = synth( L2, [1], 12, 0x4c3a06370f0007 ),


BS = synth( t / seq( mv, 18 ), [1], 18, 0x020700303340f2 ),

//vrb = lim( lp( rv(L2s/2, 3e4, .89, .02, .9, 1 ), 1.5 ), .1, 64, 1, 9, 0, 8, -.5 ),

//Master = pan => BS*.6 + L1s/(pan?3:4) + L2s*( pan ? 0 : 0 ) + vrb/( pan ? 3 : 2 ),

Master = pan => BS*.6 + L1s/( pan ? 3 : 4 ) + L2s/( pan ? 6 : 8 ),


[ lim( Master(1), .1, 64, .9, 9, 0, 1 ), lim( Master(0), .1, 64, .9, 9, 0, 1 ) ]

//fxi += 66,

//[ 0, lim( Master(0), .1, 64, .9, 9, 0, 8 ) ]

//[ Master(1), Master(0) ]
