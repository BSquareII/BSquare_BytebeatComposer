/*
 _    ___  _ _____  ____  ____ ___  _
/ \ |\\  \///__ __\/  __\/  _ \\  \//
| | // \  /   / \  |  \/|| / \| \  / 
| \//  / /    | |  |    /| |-|| /  \ 
\__/  /_/     \_/  \_/\_\\_/ \|/__/\\
                                     

VYTRAX Initiative 1.0, Coded by Semaphore (MarioFan171)

Original song by Decent-Manager-6169 (Motifs), Greaserpirate (Percussions).

This is an expiremental song on mixing hard and soft harmonies, specifically Breakbeat combined with the soft reverb used in the Lead and the instruments, resulting in a unique fusion genre.

*/

// Technical Variables, Which are used to adjust some settings, like Tuning and Speed

tune=1.2,
speed=0.756,

// This variable is needed, so the speed of this song will be changed constantly

T=t*speed,

// Sequence Functions, which are used to prevent redundant instancing, so as well add a new variable to include reverb

seqChrd=(x,y)=>(t/16*tune*2**(x[y*speed>>15&((x.length)-1)]/12))||0&64,
seq=(x,y)=>(t/16*tune*2**(x[y*speed>>12&((x.length)-1)]/12))||0&63,
seq2=(x,y)=>((t/16)*1.005*tune*2**(x[y*speed>>13&((x.length))]/12))||0&63,

// Sequences (WARNING: Do not take anything out of this "t?0:()" statement)

t?0:(
mel1a=[-2,-2,3,5,5,,,,1,,3,,3,3,1,1,5,5,5,5,5,1,5,3,15,17,5,3,3,3,5,,1,-2,-6,3,1,,1,1,1,,5,,3,3,1,1,0,0,,0,0,,6,6,6,6,5,5,6,6,3,3,6,6,,5,5,,6,6,1,-6,-4,1,3,3,1,1,5,5,5,5,,8,13,10,15,17,8,10,13,13,17,,6,10,8,6,10,13,8,,8,8,17,8,8,15,6,6,13,17,20,13,13,15,10,13,15,17,18,17,17,,13,13],
mel1b=[-2,-2,3,5,5,,,,1,,3,,3,3,1,1,5,5,5,5,5,1,5,3,15,17,5,3,3,3,5,,1,-2,-6,3,1,,1,1,1,,5,,3,3,1,1,0,0,,0,0,,6,6,6,6,5,5,6,6,3,3,6,6,,5,5,,6,6,1,-6,-4,1,3,3,1,1,5,5,5,5,,8,13,10,15,17,8,10,13,13,17,,6,10,8,6,10,13,8,,8,8,17,8,8,15,6,6,13,17,20,13,13,15,10,13,15,17,18,17,17,,13,13],

melCombined=[mel1a,mel1b][T>>19],

mel2=[,,12,13,12,8,3,5,5,3,5,3,5,5,8,,,8,12,13,12,8,3,15,15,17,10,13,13,13,,,,8,12,13,12,8,3,5,5,5,5,5,13,12,8,,,8,13,[15,17][T>>12&1],17,13,8,10,10,13,13,15,15,15,,,,,12,13,12,8,3,5,5,3,5,[3,5][T>>12&1],5,8,8,,,8,12,13,12,8,3,15,15,17,10,13,13,13,,,,8,12,13,12,8,3,5,5,3,5,3,5,,8,,,8,15,17,15,13,8,10,10,13,13,15,15,15,,],

mel2Gate=[1,1,1,,,,1,1,1,,,,1,,1,1,1,,1,,,,1,1,1,1,1,1,1,1,1,1,1,,1,,1,,1,1,1,1,1,1,,,1,1,1,,1,1,,,,1,,1,,1,1,1,1,1,1,1,1,,,,,1,1,,1,1,1,1,1,,1,,1,,,,1,1,1,1,1,1,1,1,1,1,1,,1,,1,,,1,1,,,,1,1,1,1,1,1,1,,1,,1,1,,1,,1,1,1,1,1],

melBas=[-6,-6,,1,1,,-6,-6,,,-4,,-4,-4,,,-2,-2,,5,5,,-2,-2,,,-2,,-2,-2,-2,,-6,-6,,1,1,,-6,-6,,,-4,,-4,-4,,,-7,-7,,-7,-7,,-6,-6,-6,-6,1,1,,,1,1,-6,-6,,1,1,,-6,-6,,,-4,,-4,-4,3,3,-2,-2,,-2,,,-2,,1,1,,,1,1,,,-9,-9,,-9,,,,,-7,-7,,,,,-7,-7,-6,-6,,,,,-6,-6,-4,-4,,-4,-4,,-4,-4],

melChrd1=[10,12,13,[13,13,12,13][T>>13&3],10,12,[8,8,8,10][T>>13&3],10,10,12,13,[17,13][T>>14&1],6,8,10,12],
melChrd2=[6,8,10,[10,10,8,10][T>>13&3],6,8,[5,5,5,6][T>>13&3],6,6,8,10,[13,8][T>>14&1],3,5,6,8],
melChrd3=[-6,-4,-2,[-2,-2,-4,-2][T>>13&3],-6,-4,[-7,-7,-7,-6][T>>13&3],-6,-6,-4,-2,[1,-4][T>>14&1],-9,-7,-6,-4],

chrdGate='11000011001011001111001000101110110000110010110011011011110011001100001100101100111100001100110011011110110000111101101011011010',

kickSeq=[1,1,2,1,1,2,2,1,2,1,2,2,1,2,2,4]

),

// Instruments, another function is used for reverb

i=(x,y)=>sin(seq(x,y))/5+(cos(seq(x,y))*3)/8+cos(4*sin(seq(x,y))*1.5)*sin(seq(x,y))/5*(cos(seq(x,y)*3)*sin(seq(x,y)*2))*sin(seq(x,y))/2,

insL=i(melCombined,t)+
i(melCombined,T-12288)/2+
i(melCombined,T-24576)/4+
i(melCombined,T-36864)/8+
i(melCombined,T-49152)/16,

insR=i(melCombined,t)+
i(melCombined,T+12288)/2+
i(melCombined,T+24576)/4+
i(melCombined,T+36864)/8+
i(melCombined,T+49152)/16,

s=(x,y)=>atan(tan(seq2(x,y)/4)+cbrt(sin(seq2(x,y)/4)))/4+atan(tan(seq2(x,y)/4.04)+cbrt(sin(seq2(x,y)*1.98)))/5,

ins2L=s(mel2,t)+
s(mel2,T-12288)/2+
s(mel2,T-24576)/4+
s(mel2,T-36864)/8+
s(mel2,T-49152)/16,

ins2R=s(mel2,t)+
s(mel2,T+12288)/2+
s(mel2,T+24576)/4+
s(mel2,T+36864)/8+
s(mel2,T+49152)/16,

c=(x)=>cbrt(atan(tan(seqChrd(x,t)/2))/3)+cbrt(atan(tan(seqChrd(x,t)/2.005)))/3,

chrd=(c(melChrd1)+c(melChrd2)+c(melChrd3))/5*(chrdGate[T>>12&127]),

bass=cos(sin(cos(seq(melBas,t)/8)+seq(melBas,t)/2.001)+seq(melBas,t)/4)/2,

subbass=cbrt(sin(seq2(mel2,t)/8))/4.5,

bass2=((atan(tan(seq(melBas,t)/16)^T/1e5)&64)/80),

// Percussions (Which are the Sine Kick and Greaserpirate's Breakbeat Drum Machine)

kick=sin(1.6**(-(T/64)*kickSeq[(T/32)>>8&(kickSeq.length)-1]/8%32+10))||0/2,

p=T/4,

s=sin(p>>5), h=1&p*2.67,

basdrm=(2e5/(p&(2**10/[

1,h,s,,s,2,h,1,
1,s,2,,1,,1,,
1,s,h,s,,2,h,s,
1,s,h,2,s,4,p&42,(p*1.12)&55

][((p)>>10)%32])-1)),

((basdrm%256)-128||0)/240,


// Formula

[

(insL+ins2L/2+chrd)/1.4+(bass+subbass)/1.2+(bass2+kick/1.6+((basdrm%256)-128||0)/240),

(insR+ins2R/2+chrd)/1.4+(bass+subbass)/1.2+(bass2+kick/1.6+((basdrm%255)-128||0)/240)

]