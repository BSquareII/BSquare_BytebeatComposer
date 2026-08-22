BPM=200,
sR=48e3,
sPB=32768,
tn=443.5, 
tr=0,
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

t||(wsin=(phase)=>(-cos(phase/256*PI)+1)*128-.5,fx=[],dMax=1e6,lpf=lowPassFilter=(a,c)=>(lp_fxii=fxi++,fx[lp_fxii]??=0,fx[lp_fxii]+=(a-fx[lp_fxii])*c),hpf=highPassFilter=(a,c)=>a-lpf(a,c),bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc),hc),nf=notchFilter=(a,hc,lc)=>(hpf(a,hc)+lpf(a,lc))/1.75,dly=multiTabDelay=(audio,heads,dw,fbfn=x=>x)=>{dly_fxii=fxi++;fx[dly_fxii]??=Array(dMax).fill(0);dly_wi	=dt%dMax;dly_feed=audio;dly_out=0;for(let head of heads){dly_ri=(dMax+dt-floor(head.t))%dMax;dly_feed+=fx[dly_fxii][dly_ri]*head.fb;dly_out+=fx[dly_fxii][dly_ri]*head.m}fx[dly_fxii][dly_wi]=fbfn(dly_feed);return audio*(1-dw)+dly_out*dw;}),fxi=0,dt=t,

rh=[[{t:1e3+wsin(t/180),m:.6,fb:.3},{t:1e4+wsin(t/300),m:.5,fb:.5},{t:17e3+wsin(t/380),m:.3,fb:.7},{t:37e3+wsin(t/420),m:.2,fb:.9},{t:q*1.005+wsin(t*1.005/256),m:.75,fb:.75}],[{t:11e2+wsin(t/200),m:.6,fb:.3},{t:13e3+wsin(t/320),m:.5,fb:.5},{t:14e3+wsin(t/320),m:.3,fb:.7},{t:4e4+wsin(t/450),m:.2,fb:.9},{t:q*.995+wsin(t*.995/256),m:.75,fb:.75}]],

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

[(

M=lr=>(

ma=ms(s(['ACFHMO','7ACHJM'],17),(r/8192^r/131072)%6|0,1)*(r&12288?1:(1+(r>>12&3^r>>15&1))),
mb=ms('FFCE8AFF',16),
mc=ms('7ACFHJMO',s([9,10,11,12],(r&16384?14:15))),

a1=lpr(sin((c1=ms(s(['ACFHM','ACFHM','57ACE','7ACEH','8ACEJ','8ACEJ','57ACE','7ACEH'],16),0))*PI/128+sin(c1*PI/(lr?127:129))+saw(c1/2,8)+saw(c1*4,.5)+saw(c1/(lr?1.99:2.01),8))*random(),.15,.1),

a2=sin((ma^r>>(lr?12:10))*PI/128+sin(ma*PI/(s([19,24,16],14))+sin(ma*PI/s([96,18,64],13))))*cos(r%8192*PI/16384)**3*s('1  11 11  1 ',13),

a3=sin((ma>>s([0,lr?2:1,3,lr?3:2,4]))*PI/2**s([5,8,6,2],12))*cos(r%8192*PI/16384)**3*s((r&32768?'1  1 1 1':' 11  11  1  11  '),(r&24576?13:12)),

b1=(saw(mb/16)+saw(mb/8)+saw(mb/(lr?7.99:8.01))+saw(mb/(lr?7.98:8.02)))+saw(1/(mb%(lr?1024:2048))*(r>>8&2047^r>>12&4095)*(lr?125:100)),

b2=(
p1=mb-mb%(8*(1+(r>>(s([11,12,14,12,11,12]))&15^r>>15&7))),
sin((p1|p1*((r>>(lr?13:12)&3^r*s([1,1.5,1.25],14)>>(lr?14:15)&1)))*PI/512)**s([1,3,9]))*s((r&49152?'11 1 1 1':'11 ')),

s1=saw(mc&r>>s([8,9,7,4,5,6,8,6],14)),

s2=sin((p>>s([1,3,5,2,0,4,2,6],12))*r/2**(14+(r>>16&3^r>>17&1)))*s('  11   11',12),

d=(
p1='k k s  r rk s  r',
p2='k s r k r s k r ',
p3='k',
ds=s(s([p1,p1,p2,p1,p1,p2,p2,s([p2,p2,p2,p3],14)],15),12),
ud=cos(r%4096*PI/8192),
ds=='k'?tanh(sin(1/cbrt(r%4096)*4096**.8)/(r%4096)*2048)*ud**.5*8:
ds=='r'?(t*(441/480)&1)*sin((t>>1)|(t>>1)^4|t*(lr?2:4))*ud**5*9:
ds=='s'?(sin(t*(lr?1.01:1)|t>>1)*3*sin(r*PI/4096))+sin(cbrt(r%4096)*14**.9)*ud*8.5:0),

sc=ds=='k'?sin(r%4096*PI/8192)**5:1,

h=cl((((t*(441/480)&1)-.5)*sin(t/(lr?1.1:1))*random()/(r%8192)*1500)*cos(r%8192*PI/16384)**9*3,-1,1),

tanh(((dly(a1*32+a2*10+a3*12+s1*5+s2*3,rh[lr],lr?.6:.5,x=>tanh(bpf(x,.01,.8)/160)*80)*1.1+a1/2+s1*1.4+b1*3+b2*6)*2*sc+d*4+h*20)/64)*1.3

))(0),M(1)]