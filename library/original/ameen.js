t||(
GenNote=x=>pow(2,(x-57)/12)*1.175,
BitSawWav=x=>[-1,-1,0,0,0,0,1,1][x/16&7],
SawWav=x=>x/128%2-1,
SuperSawWav=x=>(SawWav(x*.995)+SawWav(x*2.0172)*.7+SawWav(x*3.0318)*.4+SawWav(x*3.991)*.2+SawWav(x*5.02721)*.25)*.2,
BSArr=new Float32Array(BSArrL=4101).fill(0),
SWArr=new Float32Array(SWArrL=100000).fill(0),
z0=[],z1=[],DelayBuffers=[],

LeadMelody=[[-9,0,-5,0],[-7,2,-3,2],[-10,0,-7,0],[-7,0,-4,0]],
ChordsMel=[[43,45,42,45],[48,50,47,50],[36,38,35,38],[40,42,38,41]]
),

Tempo=1.2,
ts=(t-max(...[BSArrL,SWArrL]))*Tempo,
ts=(ts<0?0:ts),
ITER=0,

Dly=(Input,Samples,Feedback=.5)=>(
	Call=ITER++,
	DelayBuffers[Call]||(DelayBuffers[Call]=Array(Samples).fill(0)),
	Buffer=DelayBuffers[Call],
	Input+=Buffer[t%Samples],
	Buffer[t%Samples]=Input*Feedback,
	Buffer[t%Samples]*(1/Feedback)
),  // Made by Two2Fall
Pth=x=>(Call=ITER++,z0[Call]??=0,z0[Call]+=x),
Lpf=(x,y)=>(Call=ITER++,z1[Call]??=0,z1[Call]+=(x-z1[Call])*y),


BSArr[t%BSArrL|0]=(t<BSArrL?Lpf(BitSawWav(t/8),.2):0)+BSArr[t%BSArrL],
SWArr[t%SWArrL|0]=(t<SWArrL?Lpf(SuperSawWav(t),.4):0)+SWArr[t%SWArrL],

SuperSaw=x=>SWArr[x%SWArrL|0],
BitSaw=x=>BSArr[x*(BSArrL/512)%BSArrL|0],

1?(t%2048?(t<max(...[BSArrL,SWArrL])?0:(

[
Dly((Lead=BitSaw(Pth(GenNote(LeadMelody[Idx1=ts>>18&3][ts>>14&3]+57)))*.5),12e3*Tempo*1.5|0,.7)*.5

+Dly(Chords=(SuperSaw(t*GenNote(ChordsMel[0][Idx1]))+SuperSaw(t*GenNote(ChordsMel[1][Idx1]))+SuperSaw(t*GenNote(ChordsMel[2][Idx1]))+SuperSaw(t*GenNote(ChordsMel[3][Idx1]))),5931,.84)*.28+Dly(Chords,7281,.8)*.28,
(Dly(Lead,12288*Tempo|0,.75)+Dly(Chords,6327))*.7].map(x=>x*.5)

)):(()=>{if(int(t/max(...[BSArrL,SWArrL])*100)<100) {throw"Loading Samples... %"+int(t/max(...[BSArrL,SWArrL])*100)}else{throw "Running!"}})()):0
