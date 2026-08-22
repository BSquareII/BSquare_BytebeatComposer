BPM=128,
sR=48e3,
sPB=32768,
tn=435, 
tr=1,
edo=12,

s=(x,y=13,z=0)=>x[z?y:(r/2**y)%x.length|0],
ms=(...x)=>p*2**(parseInt(s(...x),36)/12)||0,

gS=(BPM,sR,sPB)=>abs(BPM/((120*sR)/sPB)),
gP=(sR,tr,tn,edo)=>(1/sR*256)*tn*2**((tr-9)/12),

q=(30*sR)/(BPM*2/3),
b=x=>(x)%256/128-1,
r=t*gS(BPM,sR,sPB),
p=t*gP(sR,tr,tn,edo),
cl=(x,mn,mx)=>min(max(x,mn),mx),
saw=(x,y=1)=>atan(tan(x*PI/256+.1)*y)/(PI/2),

t||(wsin=(phase)=>(-cos(phase/256*PI)+1)*128-.5,fx=[],dMax=1e6,lpf=lowPassFilter=(a,c)=>(lp_fxii=fxi++,fx[lp_fxii]??=0,fx[lp_fxii]+=(a-fx[lp_fxii])*c),hpf=highPassFilter=(a,c)=>a-lpf(a,c),bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc),hc),nf=notchFilter=(a,hc,lc)=>(hpf(a,hc)+lpf(a,lc))/1.75,dly=multiTabDelay=(audio,heads,dw,fbfn=x=>x)=>{dly_fxii=fxi++;fx[dly_fxii]??=Array(dMax).fill(0);dly_wi	=dt%dMax;dly_feed=audio;dly_out=0;for(let head of heads){dly_ri=(dMax+dt-floor(head.t))%dMax;dly_feed+=fx[dly_fxii][dly_ri]*head.fb;dly_out+=fx[dly_fxii][dly_ri]*head.m}fx[dly_fxii][dly_wi]=fbfn(dly_feed);return audio*(1-dw)+dly_out*dw;}),fxi=0,dt=t,rvrbHeads=[[{t:1e3+wsin(t/180),m:.6,fb:.3},{t:1e4+wsin(t/300),m:.5,fb:.5},{t:17e3+wsin(t/380),m:.3,fb:.7},{t:37e3+wsin(t/420),m:.2,fb:.9},{t:q*1.005+wsin(t*1.005/256),m:.75,fb:.75}],[{t:11e2+wsin(t/200),m:.6,fb:.3},{t:13e3+wsin(t/320),m:.5,fb:.5},{t:14e3+wsin(t/320),m:.3,fb:.7},{t:4e4+wsin(t/450),m:.2,fb:.9},{t:q*.995+wsin(t*.995/256),m:.75,fb:.75}]],

m1=ms('J J J H J J J M OOOOOOOOOOOOJJJJM M M MOM M M H JJJJJJJJJJJJ    H H H HJH H H F HHHHHHHHHHHHF H '.concat((z1=(r>>19)%2>0)?'J J J JMJ J J H JJJJJJJJJJJJ    ':'J J J H F F F H EEEEEEEEEEEE    '),12)/2,
m2=ms('CFCFJHCFHJMOQAOJ',s([12,10,11,12,11,13],13))*(1+(r>>12&3^r/1.5>>15&1)),
m3=ms('CFJHJMQM',s([12,11,12],13)),
mb=ms('CC77557'.concat(z1?'7':'B'),16),
c2=ms('FFAA88A'.concat(z1?'A':'7'),16)/2,
c3=ms('JJEECCE'.concat(z1?'E':'E'),16)/2,
c4=ms('MMHHFFH'.concat(z1?'H':'H'),16)/2,
c5=ms('QQOOJJO'.concat(z1?'O':'O'),16)/2,


MM=[(M=lr=>(

a1=saw(m1+cbrt(m1%(lr?256:512))*abs(sin(r*PI/2**16))*(lr?200:192)+128,8)+saw(m1*(lr?.99:1.01),8),

a2=sin((m2^r>>(lr?10:12))*PI/(64*(1+(r>>14&3^r/1.5>>15&1))))*cos(r%4096*PI/8192)**s([.3,.7,1],12)*(ua=s('111 111 111 1111',12)),

a3=(
as=s('12 1 342',15),
as=='1'?cbrt(sin(m3*PI/64))*s('1 11',14):
as=='2'?sin(((p^r>>(lr?10:12))>>s([1,4,2,3,6,5],12))*r/2**17):
as=='3'?sin(p>>s([0,3,1,2,3,2],12)&(r>>12^r>>(lr?14:15)))*s('11 1',13):
as=='4'?b(p*(lr?1:2)|p*(r>>10&r>>8)):0
),

b1=(
bs=s('12131214',15),
bs=='1'?saw(cbrt(mb%2048)*(abs(sin(r*PI/2**19))*50+(lr?150:120))*cos(r*(ub=s((r&16384?'112324':'112434'),13))%16384*PI/32768)**.1
)*1.5+saw(cbrt(mb%4096)*100)/2+saw(mb/8+sin(mb*PI/512)*16)*1.5:
bs=='2'?cbrt(sin(cbrt(mb%2048)*s([8,4,12,6,16],12))+saw(mb/(lr?3.99:4.01))+saw(mb/8)+saw(mb/(lr?7.99:8.01)))*cos(r%4096*PI/8192)**3*1.6+sin(p*r/65536)/5+sin((mb^r>>11)*PI/1024)/2:
bs=='3'?sin((mb|mb/2^mb*(r>>10&(r>>12&31)))*PI/512)*saw(mb/(lr?1.99:2.01))*1.5+saw(mb/8):
bs=='4'?atan(tan(asin(sin((mb^mb/2)*PI/512))*sin(r*s('12',14)*PI/16384)*(lr?4.5:4)))*1.3:0
),

b2=saw(mb/8|mb/4)+sin(mb*PI/512),

ss=(
sv=(dt,e)=>saw(mb/2*dt,e)/4+saw(c2*dt,e)/4+saw(c3*dt,e)/4+saw(c4*dt,e)/4+saw(c5*dt,e)/4,

sv(1)+sv(lr?.99:1.01)+sv(lr?.98:1.02)+sv(.5)+sv(1,16)/1.5+sv(lr?.99:1.01,16)/1.5
)*cos(r%4096*PI/8192)**.5*s('11 ',12)*ua,

d=(
ds=s((r>>16)%4>2?((r>>18)%2>0?'khskksk sk k ks ':'k h h h s h h h '):'k hhs hhk hks hk',12),
ds=='k'?tanh(sin((1/cbrt(r%4096))*1600**.9)*2.5*(ku=cos(r%4096*PI/8192)))*ku*3:
ds=='h'?cl((((t*(441/480)&1)-.5)*sin(t/(lr?1.2:1.05))*sin(t^4)*random()/(r%4096)*4096)*cos(r%4096*PI/8192)**9,-1,1)*2.4:
ds=='s'?((sin((t>>(lr?2:3))*t|t>>1)/2)*sin(r*PI/4096)+sin(cbrt(r%4096)**.8*20)*1.3*cos(r%4096*PI/8192))*3:0
),

sc=ds=='k'?sin(r%4096*PI/8192)**.8:1,

tanh(((dly(a1*12+a2*16+ss*23,rvrbHeads[lr],lr?.6:.5,x=>tanh(bpf(x,.01,.8)/150)*70)*sc**1.75*2.2+a3*17+b1*22+b2*10)*sc+d*25)/256)*1.4
))(0),M(1)]