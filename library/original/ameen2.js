// Array system method for music.
// By ameen272

// QSMA (Questions somebody might ask):
// Q: What is the loading for?
// A: It is to load the samples on time.

// Q: Why are you "loading" samples? Can't you use the wave functions directly?
// A: I mean, I can. But there are several reasons for why I don't, 
// such as making my Bytebeats run faster, or reducing aliasing in high frequencies.

// Q: Why does the code look so complex and weirdly formatted?
// A: Unfortunately it's a side effect of optimisations and I cannot make it simpler without making it slower to run.

// Q: Why are you avoiding division so much?
// A: It is slower because it requires much more CPU cycles than multiplication, plus, multiplication is much more stable and it is harder to NaN than division.

// Q: Why don't you judt use precomputed samples?
// A: Idk it just feels like cheating to me, plus it takes too much code space for the sample data.

t||(
	ThrowText=Text=>{throw Text},
	Wn=HannWindow=(Exponent,Time,SpeedMultiplier)=>(
		-(cos(Time*PI*SpeedMultiplier)**Exponent)+1
	),

	// (Approx) 12-TET note generator.
	GenNote=Semitone=>(
		2**(Semitone*.08333333)*1.1733333
	), 
	PTH=Pitch=Frequency=>(
		Call=ITER++,
		PitchBuffer[Call]??=0,
		Frequency==0?0:PitchBuffer[Call]+=Frequency
	),
	LPF=LowPassFilter=(Input,Cutoff,StartPoint=0)=>(
		Call=ITER++,
		FilterBuffer[Call]??=StartPoint,
		FilterBuffer[Call]+=(
			Input-FilterBuffer[Call]
		)*Cutoff
	),
	HPF=HighPassFilter=(Input,Cutoff,StartPoint=0)=>(
		Input-LPF(Input,Cutoff,StartPoint)
	),
	
	// Standalone saw wave.
	SW=SawtoothWave=Frequency=>(
		Frequency*.0078125%2-1
	),

 
   // Enhance saw timbre using detuned copies.
	SawStaging=Frequency=>(
		SW(Frequency*.99609375)*.25+
		SW(Frequency)+
		SW(Frequency*.998046875)*.25
	)*.65,

   // Arrays to store the waves in (Kinda like 
	//a voice bank in MIDI if not the same anyway) 
	
	SS=SawtoothSample=new Float32Array(SawArrLen=1<<18).fill(0),
	GS=GuitarSample=new Float32Array(GuitarArrLen=1<<13).fill(0),
	Biggest=SawArrLen,
	BiggestInverse=1/Biggest,

	// For previous-sample-dependent functions.
	FilterBuffer=[],
	PitchBuffer=[],

   Notes=[0,3,5,17,20,24,29,[-12,-12,-12,-9]]
),

// Tempo
ts=(t-Biggest<0?0:t-Biggest)*.0000208333333,

// Iterator for previous-sample-dependent functions.
ITER=0,

// Final wave functions.
Saw=x=>SS[x*2&(SawArrLen-1)],
Guitar=x=>GS[x*16&(GuitarArrLen-1)],

t<SawArrLen?(
SS[t]=LPF(LPF(LPF(SawStaging(t*.5),.15),.15),.3)*(Wn(1<<19,t,BiggestInverse))
):0,

t<GuitarArrLen?(
GS[t]=(HPF((GuitarWave=LPF(LPF(random()-random(),.025),.025))*4+LPF(GuitarWave,.003)*24,.003))
):0,


1?(t>Biggest?(
   (
 	Saw(PTH(GenNote(Notes[0])))
   *(-(ts+.666)*.5%1+1)**1.5

	+Saw(PTH(GenNote(Notes[1])))
   *(-(ts+.333)*.5%1+1)**1.5

	+Saw(PTH(GenNote(Notes[2])))
   *(-ts*.5%1+1)**1.5
   )*(ts<20?1:2.75)
	+(ts<8?0:Saw(PTH(GenNote(Notes[3])))
   *(Vol1=-ts*.5%1+1))

	+(ts<10?0:Saw(PTH(GenNote(Notes[4])))
   *Vol1)

	+(ts<12?0:Saw(PTH(GenNote(Notes[5])))
   *Vol1)

	+(ts<16?0:Saw(PTH(GenNote(Notes[6])))
   *Vol1)

   +(ts<20?0:Guitar(PTH(GenNote(Notes[7][ts&3]))))
   *2.5

)*.2:(
	ThrowText(
		"Loading %"+round(t*BiggestInverse*100+.333)
	)
)):0