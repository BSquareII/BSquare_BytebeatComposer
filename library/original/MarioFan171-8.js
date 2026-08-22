BPM=128,
sR=48e3,
sPB=32768,
tn=441, 
tr=-7,
edo=19,

q=(30*sR)/(BPM*2/3),
r=t*abs(BPM/((120*sR)/sPB)),
p=(t/sR*256)*tn*2**((tr-14)/edo),

b=x=>(x)%256/128-1,
s=(x,y,z=0)=>x[z?y:(r/2**y)%x.length|0],
ms=(...x)=>p*2**((s(...x))/edo)||0,

cl=(x,mn,mx)=>min(max(x,mn),mx),
saw=x=>atan(tan(x*PI/256))/(PI/2),

t||(wsin=(phase)=>(-cos(phase/256*PI)+1)*128-.5,fx=[],dMax=1e6,lpf=lowPassFilter=(a,c)=>(lp_fxii=fxi++,fx[lp_fxii]??=0,fx[lp_fxii]+=(a-fx[lp_fxii])*c),hpf=highPassFilter=(a,c)=>a-lpf(a,c),bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc),hc),nf=notchFilter=(a,hc,lc)=>(hpf(a,hc)+lpf(a,lc))/1.75,dly=multiTabDelay=(audio,heads,dw,fbfn=x=>x)=>{dly_fxii=fxi++;fx[dly_fxii]??=Array(dMax).fill(0);dly_wi	=dt%dMax;dly_feed=audio;dly_out=0;for(let head of heads){dly_ri=(dMax+dt-floor(head.t))%dMax;dly_feed+=fx[dly_fxii][dly_ri]*head.fb;dly_out+=fx[dly_fxii][dly_ri]*head.m}fx[dly_fxii][dly_wi]=fbfn(dly_feed);return audio*(1-dw)+dly_out*dw;}),fxi=0,dt=t,rvrbHeads=[[{t:1e3+wsin(t/180),m:.6,fb:.3},{t:1e4+wsin(t/300),m:.5,fb:.5},{t:17e3+wsin(t/380),m:.3,fb:.7},{t:37e3+wsin(t/420),m:.2,fb:.9},{t:q*1.005+wsin(t*1.005/256),m:.75,fb:.75}],[{t:11e2+wsin(t/200),m:.6,fb:.3},{t:13e3+wsin(t/320),m:.5,fb:.5},{t:14e3+wsin(t/320),m:.3,fb:.7},{t:4e4+wsin(t/450),m:.2,fb:.9},{t:q*.995+wsin(t*.995/256),m:.75,fb:.75}]],

t||(lprfx=[]),lprfxi=0,

lpr=lowPassResonance=(a, c, r)=>(
	lpr_fxii = lprfxi ++,
	lprfx[lpr_fxii] ??= [0, 0, 0, 0],
	lprfx[lpr_fxii][0] += (a - lprfx[lpr_fxii][0] + (r + r / ((1 + .1e-9) - c)) * (lprfx[lpr_fxii][0] - lprfx[lpr_fxii][1])) * c,
	lprfx[lpr_fxii][1] += (a - lprfx[lpr_fxii][1] + (r + r / ((1 + .1e-9) - c)) * (lprfx[lpr_fxii][1] - lprfx[lpr_fxii][2])) * c,
	lprfx[lpr_fxii][2] += (lprfx[lpr_fxii][1] - lprfx[lpr_fxii][2]) * c,
	lprfx[lpr_fxii][3] += (lprfx[lpr_fxii][2] - lprfx[lpr_fxii][3]) * c,
	lprfx[lpr_fxii][3]
),

hpr=(a,c,r)=>a-lpr(a,c,r),

m1=ms(
(r>>14)%32>15?
((r>>14)%16>8?
[0,19,0,23,30,,27,23]
:[0,19,0,19,30,19,27,23]):
((r>>14)%16<12?
[0,19,0,19,0,19,23,23]:
[0,19,0,19,30,19,27,23])
,13)*2,

m2=ms([0,0,5,5,8,8,13,8],15)/4,

m3=ms([0,5,8,11],10),

[(M=lr=>(

i1=(saw(m1|m1/2)+saw(m1/(lr?1.99:2.01))+saw(m1/(lr?1.98:2.02))+saw(m1|m1/(lr?1.99:2.01)))/1.6*cos(r%8192*PI/16384)**s([.7,3,1,3],13)*(r&16384?s('11  1 11 1 111  11  11 1',12)*(r&24576?s('1 ',11):1):1),

i2=(
is=s('  12113 1 13 312  4 1 442 11 3 4',12),
is=='1'?tanh(sin((m3^r>>(lr?s([8,9],10):s([10,12],11)))*PI/32*(1+(r>>13&3^r>>15&1)))*2)*(r&12288?1:s('1 ',11))*2:
is=='2'?sin(p/(r>>(lr?15:14)&3)&r>>s([8,10,12,10],14))*2:
is=='3'?saw(m1&128-(r&6144?0:(m1&64)))*2:
is=='4'?b(m3&m3*(r>>9&15)*4^m2*(lr?4:2)*s('1 ',11)^m3*(r>>(lr?9:10)&3))*2:0
),

b1=lpr(saw(cbrt(m2%(m2&256?256:128))*sin(r*PI/16384)*(lr?240:300))+saw(m2/(lr?1.99:2.01)|m2),cl(cos(r%4096*PI/8192)*s([.7,1,3],13),.005,s([.3,.5,.34,.1,.87,.4],(r&8192?12:13))),s([.1,.5,.95,.7],12))/2*cos(r%4096*PI/8192)**s([1,.7,3],13)*1.6+saw(m2)/2*s('111 11 11 111',12),

b2=(
bs=s('1 11 12 22 13333144 24 21 443333',12),
bs=='1'?cbrt(sin(cbrt((m2|m2/(lr?1.99:2.01))%128)*sin(r%4096*PI/8192)*s([5,10,12,15],11))):
bs=='2'?sin((m2|m2*(lr?1.99:2.01)*(r>>10&15^r>>14&3)+m2*(r>>10&15))*PI/256)+saw(m2+sin(m2*PI/128)*(r>>10&15)):
bs=='3'?saw(cbrt(m2%128)*sin(r*PI/8192)*(lr?650:700)):
bs=='4'?atan(tan(sin(m2*PI/(m2&128?512:256))*sin(r*PI/32768)**3*(lr?25:20)))/2:0
),

ss=(
sc=(dt=1)=>ms(s(
[[0,4,11,16,22],
[0,11,16,23,27],
[0,5,13,16,19],
[0,4,11,16,22],
],16),0)*dt,

lpr(saw(sc())+saw(sc(2))+saw(sc(lr?1.99:2.01))+saw(sc(lr?.99:1.01)),.4,.1,.2,.1)

)*sin(r%16384*PI/32768)**3,

k=(tanh(sin(cbrt(r%4096)*9**.4)/(r%4096)*2**16*(ku=cos(r%4096*PI/8192))/2)*ku*s('1   ',12)),

sn=(sin(4*sqrt(r%16384)**.9)*cos(r%16384*PI/32768)**3+(((random()-.5)+atan(tan(t*(lr?1.01:1)|t>>1))/3)*abs(sin(r*PI/16384))**.7))*s(' 1',14),

h=min(max((((((t*(441/480))&1)-.5)*sin(t|t/(lr?2.105:2.2))/2+sin(t/2)/8)/(r%4096)*16384*cos(r%4096*PI/8192)**9)*s('  11',12),-1),1),

tanh((dly(i1*3+ss*3,rvrbHeads[lr],lr?.6:.575,x=>tanh(bpf(x,.01,.8)/160)*80)*15+i2*12+ss*35+b1*20+b2*24+(k*3+sn*2+h*2)*20)/512)*4

))(0),M(1)]