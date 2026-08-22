/*
 * Sagittarius A (wip)
 * by troubleshoot
 * (remake of infernal gaze)
 * (may never be finished like the 
 * other wips i abandoned...)
 */

/* random vars */
t||(sa=48e3,samp=1/sa,BPM=175,K=C=H=k=h=b1=b2=e1=e2=e3=h1=h2=h3=no1=no2=r1=r2=r3=0,Ki=Ch=Hi=1,dbuf=[],e=(a,b,c)=>(1-(a*b<1?a*b:1))**c),

/* delay (credits to Two2Fall) */
dcc=0,
del=(i,fb=.5,mem=12288)=>(call=dcc++,dbuf[call]||(dbuf[call]=new Float32Array(mem).fill(0)),buff=dbuf[call],ri=(t+mem|0)%mem,i+=buff[ri],buff[ri]=i*fb,i*(1-fb)+buff[ri]),

/* T crap */
T=t*samp/30*BPM, // speed
transpose=.2, // transpose (not related to to but whatever)
p=((t/sa*48e3)/1.43)*2**(transpose/12),
// pitch

/* note function */
note=x=>isNaN(x)?0:p*2**(x/12),

/* sidechain */
sch=(T>256+128?([T*2%1,1]['0111'[3&T*2]])**2:1),

/* saw function (currently unused) */
saw=(x,o)=>atan(tan(note(x)/o*PI))/4,

/* sine function (not really a sine, more like a... idk) */
sine=x=>(tanh(sin(cos((note(x)+32*sin(note(x)/128.9*PI))/256.5*PI)))+tan(sin(cos((note(x)+32*(sin(note(x)/126.7*PI)+sin(note(x)/129*PI)))/254.5*PI)))+tanh(sin(cos(note(x)/129.1*PI))+sin(cos(note(x)/124*PI))/8))/4,

/* chords */
c='0000000000000111'[15&T],
chArr=[[18,20,22,17],[[22,29][c],[24,29][c],[25,29][c],[20,27][c]],[[25,32][c],[27,32][c],[29,34][c],[24,29][c]]],
// chord array
// (also used for bass)

n=C,C='10010010010010101001001000101010'[31&T*2],C-n>0?Ch=0:Ch+=samp,
// chord envelope

ch=(sine(chArr[0][3&T/16])+sine(chArr[1][3&T/16])+sine(chArr[2][3&T/16])*(T>128))/14*(T>64?1:T/64%1)*(e1=min(e(Ch,1.5,2),e1+1/128)),
ch2=(sine(chArr[0][3&T/16])+sine(chArr[1][3&T/16])+sine(chArr[2][3&T/16])*(T>128))/56*(T>64?1:T/64%1)/(e2=min(1.03-e(Ch,2,2),e2+1/256))*(e3=min(e(Ch,1,2),e3+1/256)),
// same as first variable but 𝓅𝓁𝓊𝒸𝓀𝓎
che=len=>(chi=tanh((ch*.5)/128*PI)*128,chi2=tanh((ch2*.5)/128*PI)*128,wet=del(del(chi,.8,len/2),.8,len*2),tanh(((chi+chi2)*.5+wet*.5)/128*PI)*32),
chords=[che(12288*(7/8)),che(12288*(9/8))].map(x=>(x=tanh((x*.5)/128*PI)*128,r1+=.1*(x-r1),r2+=.3*(x-r2),x=x+((x+r2*.2)-r1)*2,min(max(x*1.25,-127),128))),

/* bass */
b=(saw(chArr[0][3&T/16],2048)+saw(chArr[0][3&T/16],2030)+saw(chArr[0][3&T/16],1023)*.5)/4*(T>128)*((1-T/16%1)**.5),
f=.01,z=.7+.7/(1-f),
b1+=f*(b-b1+z*(b1-b2)),b2+=f*(b1-b2),
ba=len=>(b=tanh((b2*.5)/128*PI)*128,wet=del(del(b,.75,len/2),.75,len*2),tanh((b*.25+wet*.25)/128*PI)*128),
bass=[ba(12288*(7/8)),ba(12288)].map(x=>(tanh((x*.5)/128*PI)*128,r3+=.4*(x-r3),x=x+r3*2,min(max(x*.125,-127),128))),

/* drum things */
n=K,K='1010'[3&T],K-n>0?Ki=0:Ki+=samp,
n=H,H='1000100000100010'[15&T*2],H-n>0?Hi=h=0:Hi+=samp,

/* kick */
//c=1e3*e(Ki,50,6)+70*e(Ki,25,2)+50,
c=1.5e3/(1+Ki*1e3)+45,
k=(k+c/sa)%1,
// snare structure bcuz yes

kick=pan=>((pan?cos:sin)(2*k*PI)*2*e(Ki,10,2)+(random()-.5)*.1*e(Ki,11,2))*(T>256+128),
kick=[kick(0),kick(1)],

/* hihat */
Q=n=>(n*(t*samp)&1)-.5,
n=(Q(800)+Q(540)+Q(523)+Q(370)+Q(304)+Q(205))+(2*random()-1)/1.5,
f=6880*PI*samp,z=.1+.1/(1-f),
h1+=f*(n-h1+z*(h1-h2)),h2+=f*(h1-h2),
f=21e3*PI*samp,h3+=f*(n-h3),
hihat=(((hi=(n-h3+(h1-h2)*.2))*.4*e(Hi,5,3))+(hi*.06*e(Hi,1,1.5))*(T>256+128))*(T>256),

/* drums */
drums=pan=>kick[pan]+hihat,
drums=[drums(0),drums(1)],

/* ambient noise */
(t%4!=0)?0:(n1=random()-.5,n2=random()-.5),
no1+=.01*(n1-no1),no2+=.01*(n2-no2),
noi=[no1*.2,no2*.2],

/* output */
out=pan=>atan((chords[pan]+bass[pan])*sch+drums[pan]+noi[pan]),
[out(0),out(1)]