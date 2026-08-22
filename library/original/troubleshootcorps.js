//
//  the home is resonating
//  by troubleshoot
//  (chords from leejh's remake,
//  arp from aloremakes' remake)
//  (not guaranteed to be accurate)
//

//
//  essentials
//

t||(
 // sample rate variables
 samp=48e3,sampT=1/samp,
 BPM=85, // beats per minute
 delayBuffer=[], // delay buffer
 delayDetune=input=>(-cos((t/
  input)/256*PI)+1)*128-.5, 
 // delay detune
 [filterBuffer,filter6db,filter12db,
  filter18db,filter24db]=
  [[],[],[],[],[]],
 // 5 filter variables
 // (for infinite filters (w/ or
 // w/o resonance!!))
 // (resonance lol)
 envelope=(array,input1,input2)=>(1-
  (array*input1<1?array*input1:1))**
  input2, // simple envelope
 K=H=S=k=s=s1=s2=0,Kick=Snare=
 Hihat=1, // drum variables
 A=C=0,Arp=Chord=1,
 // envelope variables
 ADSR=(array,array2,attack,decay,
  sustain,release)=>
  array>0?array>attack?array>
  attack+decay?array2<1?sustain-
  sustain/release*min(array-attack-
  decay,release):sustain:(1-sustain)
  *(1-(array-attack)/decay)**2+
  sustain:array/attack:0,
 // ADSR envelope
 envelope2=(array,input1)=>exp(-(
  array**input1)),
 // simpler envelope
 echoArray=Array(samp).fill(0),
 // echo array
 echo=T=>echoArray[(T+samp|0)%samp]
 // echo
),

// time
time=T=t*sampT/30*BPM,

// transpose
transpose=.2,

// pitch
pitch=((t/samp*48e3)/1.43)*2**
 (transpose/12),

// vibrato function
vibrato=(volume,speed)=>volume*sin(2*
 PI*t/((speed-1)*2))/t,
  
// note function
note=x=>isNaN(x)?0:pitch*2**(x/12),

// sidechain
sidechain=(T>128?([T*2%1,1]
 ['0111'[3&T*2]])**2:1),

//
//  effects
//

// filter call count variable
filterCallCount=0,

// lowpass
lowpass=(input,cutoff)=>{
 let call=filterCallCount++;
 filterBuffer[call]||=0;
 filterBuffer[call]+=cutoff*
 (input-filterBuffer[call]);
 return filterBuffer[call];
},

// highpass
highpass=(input,cutoff)=>input-
 lowpass(input,cutoff),

// bandpass
bandpass=(input,highpassCutoff,
 lowpassCutoff)=>highpass(lowpass(
 input,lowpassCutoff),highpassCutoff
),

// notch filter
notchFilter=(input,highpassCutoff,
 lowpassCutoff)=>highpass(input,
 highpassCutoff)+lowpass(input,
 lowpassCutoff),

// lowpass (w/ resonance)
lowpassResonance=(input,cutoff,
 resonance,poles)=>{
 let call=filterCallCount++;

 filter6db[call]||=0;
 filter12db[call]||=0;
 filter18db[call]||=0;
 filter24db[call]||=0;

 resonance=resonance+resonance/
 (1-cutoff);
 
 // 1 pole (6db)
 filter6db[call]+=cutoff*
 (input-filter6db[call]+
 resonance*(filter6db[call]-
 filter12db[call]));

 // 2 poles (12db)
 filter12db[call]+=cutoff*(
 filter6db[call]-filter12db[call]);

 // 3 poles (18db)
 filter18db[call]+=cutoff*(
 filter12db[call]-filter18db[call]);

 // 4 poles (24db)
 filter24db[call]+=cutoff*(
 filter18db[call]-filter24db[call]);

 if(poles==1)
  return filter6db[call];
 if(poles==2)
  return filter12db[call];
 if(poles==3)
  return filter18db[call];
 if(poles==4)
  return filter24db[call];
},

// highpass (w/ resonance)
highpassResonance=(input,cutoff,
 resonance,poles)=>input-
 lowpassResonance(input,cutoff,
 resonance,poles),

// low boost filter
lowBoost=(input,cutoff,volume)=>
 input+lowpass(input,cutoff)*volume,

// high boost filter
highBoost=(input,cutoff,volume)=>
 input+highpass(input,cutoff)*
 volume,

// band boost filter
bandBoost=(input,highpassCutoff,
 lowpassCutoff,volume)=>
 input+highBoost(lowBoost(input,
 lowpassCutoff,volume),
 highpassCutoff,volume)*volume,

// bitcrush function
bitcrush=(input,value)=>trunc(input/
 (value+1)*128)*(value+1)/128,

// delay call count variable
delayCallCount=0,

// reverb
reverb=(input,samples,postGain)=>{
 delay=(input,feedback,samples,
  detune)=>{
  let call=delayCallCount++;
  delayBuffer[call]??=new 
   Float32Array(samples).fill(0);
  let buffer=delayBuffer[call];
  detune=detune+10e-3;
  let time2=(samples+(t+round(
   samples+delayDetune(detune))))
   %samples;

  input+=bandpass(buffer[time2],.05,
   .9);
  buffer[time2]=input*feedback;

  return input*(1-feedback)+
   buffer[time2];
 }

 let dry=tanh((input*.5)/128*PI)
  *128,wet=dry;
 
 for (let reverbHeads of samples) {
  wet+=delay(delay(dry,reverbHeads.
   feedback,reverbHeads.samples/2,
   reverbHeads.detune),reverbHeads.
   feedback,reverbHeads.samples*2,
   reverbHeads.detune);
 }

 let output=tanh((dry*(1-
  postGain)+wet*postGain)/128*PI)
  *128;

 return output*.25;
},

// reverb heads (or sets, idk)
reverbHeads=[
 // left channel
 [
  {samples:2e4,feedback:.6,
   detune:170},
  {samples:11e3,feedback:.75,
   detune:210},
  {samples:14e3,feedback:.8,
   detune:250},
  {samples:17e3,feedback:.7,
   detune:360},
  {samples:2e5,feedback:.65,
   detune:430}
 ],

 // right channel
 [
  {samples:1e4,feedback:.7,
   detune:210},
  {samples:13e3,feedback:.85,
   detune:270},
  {samples:37e3,feedback:.6,
   detune:310},
  {samples:4e4,feedback:.9,
   detune:370},
  {samples:3e5,feedback:.8,
   detune:420}
 ]
],

// ambient noise reverb heads
ambNoiseHeads=[
 // left channel
 [
  {samples:2e4,feedback:.86,
  detune:230},
  {samples:10e3,feedback:.75,
  detune:370}
 ],

 // right channel
 [
  {samples:1e4,feedback:.7,
  detune:170},
  {samples:22e3,feedback:.87,
  detune:210}
 ],
],
 
// sawtooth wave function
saw=(input,octave,volume,
 vibratoBool,vibratoVolume,
 vibratoSpeed=4096)=>
 atan(tan(note(input+(vibratoBool?
 vibrato(vibratoVolume,vibratoSpeed)
 :0))/octave*PI))/volume,

//
//  instruments
//

// chords
n=C,C='1001001001001010'
 [4*'0101201201012012'[T/2&15]+
 (2*T&3)],
C-n>0?Chords=0:Chords+=sampT,

// chord arrays
chArrs=[[-7,-4,0,3,8],
 [-4,0,3,7,10],[0,3,7,10,12],
 [-9,-7,-4,0,15],[-2,1,5,8,10],
 [-4,0,3,7,8],[-7,-4,0,3,12],
 [0,3,5,7,10],[-2,1,5,7,8],
 [-4,0,3,5,7]],

// chord progression
ch=i=>chArrs['0000111222222222333344455555555566665551111111110000888999999999'
[63&T]][i],

w=T=>asin(cos(T/8*PI))/4+.5,
supersaw=input=>saw(input,128,8,0)+
 saw(input,255.6,12,0)+
 saw(input,510.8,14,0)+
 saw(input,1022,16,0),
cho=bandBoost(
 lowpassResonance(
  supersaw(ch(0))+
  supersaw(ch(1))+
  supersaw(ch(2))+
  supersaw(ch(3))+
  supersaw(ch(4)+.05),
  ADSR(Chords,C,.07,.6*w(T),
  .12,9)/3,.5,2
 )/3*(ADSR(Chords,C,.07,.6*w(T),
 .12,9)**.25),.05,.2,1
)/4,
echoT=samp/192*BPM,
echoArray[t%samp]=.98*(cho+ 
 (echo(t-550)+echo(t-1297)+
 echo(t-1662)+echo(t-2035)+
 echo(t-5e3)+echo(t-echoT)*2+
 echo(t-echoT*2)*3)*.1),
chords=echoArray[t%samp],

// arp
n=A,A='1010'[3&T*4],
A-n>0?Arp=0:Arp+=sampT,

w1=T=>wt=w(T)*.7-(asin(cos(T/12))
 /8+.25),

// arp array
arpArr=[
 -4,-7,0,-4,3,0,8,3,0,-4,3,0,
 7,-9,3,0,7,3,10,7,12,3,0,7,3,10,7,
 12,3,0,7,3,-4,-7,0,-4,3,0,12,3,
 1,-2,5,1,8,5,0,-4,3,0,7,3,8,3,0,3,
 0,7,3,8,3,0,-4,3,0
],

a=T=>lowpassResonance(
 saw(arpArr[63&T*2],128,20,0),
 ADSR(Arp,A,1e-2,.5*w1(T)+.2,.2,1)*
 (.25+w1(T)/3),.7,1
),
arp=tanh((highpass(
 (T2=T-64,a(T2)+(a(T2-1)*.8*
 (T2>1))+(a(T2-2)*.7*(T2>2))+
 (a(T2-4)*.6*(T2>4))+
 (a(T2-8)*.5*(T2>8))+
 (a(T2-16)*.4*(T2>16))+
 (a(T2-32)*.3*(T2>32))+
 (a(T2-64)*.2*(T2>64)))*
 (T>64),.05
)*.5)/128*PI)*72,

// kick
n=K,K='1000'[3&T],
K-n>0?Kick=0:Kick+=sampT,

n=2.5e3/(1+Kick*1200)+45,
k=(k+n*sampT)%1,

(t%4!=0)?0:(noise=random()-.5),

kick=pan=>atan((pan?cos:sin)
 (2*k*PI)*1.5*envelope(Kick,5,3)+
 noise*.15*envelope(Kick,7,3)),
kick=[kick(0),kick(1)],

// hihat
n=H,H='1010'[3&T*4],
H-n>0?Hihat=0:Hihat+=sampT,

Q=n=>(n*(t*sampT)*2&1)-.5,
hihat=highpassResonance(
 (n=(2*random()-1)+(Q(800)+Q(540)+
 Q(523)+Q(370)+Q(304)+Q(205))*.5),
 12e3*sampT*PI,.6,2)
 *envelope(Hihat,7,3)*sidechain*
 ('0110'[3&T*2]),

// snare
n=S,S='0010'[3&T],
S-n>0?Snare=0:Snare+=sampT,

n=2e3*envelope(Snare,40,6)+
 80*envelope(Snare,25,2)+150,
s=(s+n*sampT)%1,

noise=2*random()-1,
snare=pan=>
 atan((noise*
 envelope(Snare,20,8)+highpass(
 noise,.4)*ADSR(Snare,S,.11,.07,
 .005,.005))*2+(pan?cos:sin)
 (2*s*PI)*1.5*envelope(Snare,7,3)),
snare=[snare(0),snare(1)],

// drums
drums=pan=>lowpass(
 kick[pan]+hihat+snare[pan],.3)*
 (T>128),
drums=[drums(0),drums(1)],

// ambient noise
noise=bitcrush(random()-.5,12),
noise2=((random()-.5)+noise*
 .5)*.01,
amb=bandpass(noise2,.2,.05),
ambNoise=pan=>reverb(amb,
 reverbHeads[pan],.5),
ambNoise=[ambNoise(0),ambNoise(1)],

// output
output=pan=>tanh(
 (notchFilter(
   bitcrush(
    (chords+arp)*.1+reverb(chords+
    arp,reverbHeads[pan],.5)*.3
    *sidechain+ambNoise[pan]
    +drums[pan],1
   )*.2,.01,.6
  )/128*PI
 )
)*128,
[output(0),output(1)]