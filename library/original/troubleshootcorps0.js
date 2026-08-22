/*
 * brighter surroundings
 * by troubleshoot
 * (remake of Lighter Atmosphere 
 * from CaL:ABP)
 * (this is literally "the random 
 * background music you hear in 
 * heaven" but longer)
 */

/* random vars */
t||(sa=48e3,samp=1/sa,BPM=120,c1=c2=c3=c4=e1=0,e=(a,b,c)=>(1-(a*b<1?a*b:1))**c,wsin=(phase)=>(-cos(phase/128*PI)+1)*128-.5,fx=[],fxk=[],dMax=1e6,lpf=lowPassFilter=(a,c)=>(lp_fxii=fxi++,fx[lp_fxii]??=0,fx[lp_fxii]+=(a-fx[lp_fxii])*c),hpf=highPassFilter=(a,c)=>a-lpf(a,c),bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc),hc),dly=multiTabDelay=(audio,heads,dw,fbfn=x=>x)=>{dly_fxii=fxi++;fx[dly_fxii]??=Array(dMax).fill(0);dly_wi	=dt%dMax;dly_feed=audio;dly_out=0;for(let head of heads){dly_ri=(dMax+dt-round(head.t))%dMax;dly_feed+=fx[dly_fxii][dly_ri]*head.fb;dly_out+=fx[dly_fxii][dly_ri]*head.m;}fx[dly_fxii][dly_wi]=fbfn(dly_feed);return audio*(1-dw)+dly_out*dw;}),

/* reverb... heads?? */
// (grabbed off PrincessPriscillaPT's "reverb with long tail" post)
q=(30*sa)/(BPM*2/3),
fxi=0,dt=t,revHeads=[[{t:1e3+wsin(t/180),m:.6,fb:.3},{t:1e4+wsin(t/300),m:.5,fb:.5},{t:17e3+wsin(t/380),m:.3,fb:.7},{t:37e3+wsin(t/420),m:.2,fb:.9},{t:q*1.005+wsin(t*1.005/256),m:.75,fb:.75}],[{t:11e2+wsin(t/200),m:.6,fb:.3},{t:13e3+wsin(t/320),m:.5,fb:.5},{t:14e3+wsin(t/320),m:.3,fb:.7},{t:4e4+wsin(t/450),m:.2,fb:.9},{t:q*.995+wsin(t*.995/256),m:.75,fb:.75}]],

/* T crap */
T=t*samp/30*BPM, // speed
transpose=0, // transpose (not related to to but whatever)
p=((t/sa*48e3)/1.43)*2**(transpose/12),
// pitch

/* note function */
note=x=>isNaN(x)?0:p*2**(x/12),

/* saw function */
saw=(x,o)=>atan(tan(note(x)/o*PI))/6,

/* sine function */
sine=(x,o)=>sin(note(x)/o*(2*PI))/4,

/* Karplus-Strong string function (credits to Sentle XR like thx so much) */
cc=0,
string=(x,o,s)=>(K=(l,v,s)=>(call=cc++,fxk[call+t%l]??=0,fxk[call+t%l]%=.8,t%v||(x=fxk[call+t%l]),call2=cc++,fxk[call2+t%l]??=0,i=(random()*2-1)*(t%v<l)+fxk[call2+t%l],t%1?0:fxk[call2+t%l]=lpf(i,s),cc+=l,i),K(round(193600/((27.5/sa*48e3)*2**((x+39+transpose+12)/12)))||0,BPM*o*100,s)),

/* melody */
melArrs=[[4,11,16,,4,11,16,,4,11,16,19,18,11,16],[7,16,19,,7,16,19,,7,16,19,23,21,16,19],[7,14,16,,7,14,16,,7,14,16,21,19,14,16,],[4,,,],[7,,,]], // mel arrays

me=o=>(T>64?(sine(melArrs['2222000011111111'[15&T/4]][15&T],o)+sine(melArrs['4344'[3&T/16]][3&T],o)*('0001'[3&T/4])):(sine(melArrs[2][15&T],o)+sine(melArrs[4][3&T],o)*('0001'[3&T/4])))*(e1=min((1-T%1)**2,e1+1/32)),
me=me(128)+(me(64)+me(32))/8*(T>256),
mel=pan=>me+dly(me,revHeads[pan],.75,x=>(bpf(x,.01,.8)/180)*100)*1.5,
mel=[mel(0),mel(1)],

/* chords */
// (chords not accurate as I just ripped them off my GarageBand remake)
// (especially the 5th chord)

chArrs=[[2,4,2,[7,4][1&T/8]],[7,7,7,[11,2][1&T/8]],[11,11,9,[14,16][1&T/8]]], // chord arrays

ch=(string(chArrs[0][1&T/16],(ri=[16,16,16,8][3&T/16]),.85)+
string(chArrs[1][3&T/16],ri,.85)+
string(chArrs[2][3&T/16],ri,.85))/1.5,
ch2o=o=>(sine(chArrs[0][3&T/16],o)+sine(chArrs[1][3&T/16],o)+sine(chArrs[2][3&T/16],o))/6,
ch2=(ch2o(126.8)+ch2o(127.6)+ch2o(129.2)+ch2o(128.6)+ch2o(63.5))*((1-T/ri%1)**.25),
ch=(ch+ch2)/1.25*(T>64),
f=.125,z=.4+.4/(1-f),
c1+=f*(ch-c1+z*(c1-c2)),c2+=f*(c1-c2),c3+=f*(c2-c3),
ch=c3+(c2-c3),
chords=pan=>ch+dly(ch,revHeads[pan],.75,x=>(bpf(x,.01,.5)/180)*100),
chords=[chords(0),chords(1)],

/* output */
out=pan=>atan(mel[pan]+chords[pan]),
[out(0),out(1)]