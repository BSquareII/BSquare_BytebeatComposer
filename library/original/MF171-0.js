BPM=150,
sR=48e3,
sPB=32768,
tn=442, 
tr=3,
edo=12,

s=(x,y=13,z=0)=>x[z?y:(r/2**y)%x.length|0],
ms=(...x)=>p*2**(parseInt(s(...x),36)/12)||0,

gS=(BPM,sR,sPB)=>abs(BPM/((120*sR)/sPB)),
gP=(sR,tr,tn,edo)=>(1/sR*256)*tn*2**((tr-9)/12),

b=x=>(x)%256/128-1,
r=t*gS(BPM,sR,sPB),
p=t*gP(sR,tr,tn,edo),
cl=(x,mn,mx)=>min(max(x,mn),mx),
saw=(x,y=1)=>atan(tan(x*PI/256+.1)*y)/(PI/2),

t?0:d_fx=[],d_fxi=0,d_max=1e5,
dlay=(inp,time=1,mix=.55,feedb=.55)=>(d_fxii=d_fxi++,d_fx[d_fxii]??=new Float32Array(d_max),out=inp+d_fx[d_fxii][t%round(time)],d_fx[d_fxii][t%round(time)]=out*feedb,inp*(1-mix)+out*mix),

t||(lprfx=[]),lprfxi=0,
lpr=lowPassResonance=(a, c, r)=>(
	lpr_fxii = lprfxi ++,
	lprfx[lpr_fxii] ??= [0, 0, 0, 0],
	lprfx[lpr_fxii][0] += (a - lprfx[lpr_fxii][0] + (r + r / ((1 + .1e-9) - c)) * (lprfx[lpr_fxii][0] - lprfx[lpr_fxii][1])) * c,
	lprfx[lpr_fxii][1] += (a - lprfx[lpr_fxii][1] + (r + r / ((1 + .1e-9) - c)) * (lprfx[lpr_fxii][1] - lprfx[lpr_fxii][2])) * c,
	lprfx[lpr_fxii][2] += (lprfx[lpr_fxii][1] - lprfx[lpr_fxii][2]) * c,
	lprfx[lpr_fxii][3] += (lprfx[lpr_fxii][2] - lprfx[lpr_fxii][3]) * c,
	lprfx[lpr_fxii][3]
),hpr=(a,c,r)=>a-lpr(a,c,r),bpr=(a,hc,lc,r)=>hpr(lpr(a,lc,r),hc,r),

[(M=lr=>(

m1=ms('078A072357AF72C8',lr?12:13)/2,
m2=ms('CFCFJHJMJMQJOQJH',(r/4096^r/8192^r/12288)%16|0,1)*(1+(r>>12&3))/2,

ma=ms('CEFHCEFJCEF',s([10,12,11],(r&12288?14:13))),
mb=ms('CCAACC8ACCA85577',15)/4,
mc=ms('CAEFCEH',s([12,11,10],13)),

c2=ms('FFEEFFCEFFEC88AA',15)/4,
c3=ms('JJHHJJFHJJHFCCEE',15)/4,
c4=ms('MMJJMMMOQQOMJJHH',15)/4,

g=(x,y1=1,y2=1)=>x&&(atan(tan(m1*x*PI/256)*x)/2+atan(tan(m1*y1*x*PI/256)*x)/2+atan(tan(m1*y2*x*PI/256)*x)/2)+g(x-1),
f=(x,y)=>g(x,y)/x,

a1=dlay(f(round(abs(asin(sin(r*PI/2**19))*14)+2),lr?.99:1.01,lr?.98:1.02)*cos(r/(u='21'[r>>12&1])%4096*PI/(8192*u))**.2||0,14000,.7,.3),

a2=dlay((sin(m2*PI/128+sin(m2*PI/(lr?32:24)))+sin((m2^r>>(lr?10:12))*PI/(r&12288?64:96)))*cos(r%4096*PI/8192)*s((r&32768?'1':'1 1  11 11  1 1 '),12)*s('111 ',14)*s('111 1 1 1111111 ',15),14000,.8,.5)/2,

a3=(
as=s('1523124412324235',14),
as=='1'?cbrt(sin(mc*PI/128))*s('11 1 1  1 1 ',12):
as=='2'?sin((p*(lr?1.01:1)>>s([1,4,3,1,2,5],13))*r/2**s([8,16,14,15,16],12)):
as=='3'?sin((p>>s([0,4,2,1,3,2],12))&(r>>12^r>>(lr?14:15))):
as=='4'?b(mc/(p&r>>12))*s('1 1  1',12)||0:
as=='5'?b(mc|p*(r>>12^r>>(lr?15:14))+mc^mc/2)
:0
),

b1=(
bs=s('1112111311123322',14),
bs=='1'?tanh(sin(cbrt(mb%512)*s([24,lr?7:2,7,lr?10:12,lr?7:9,lr?3:4],12)+saw(mb/4))**3*2+saw(mb/4)*(ub=cos(r%4096*PI/8192)**3))*ub:
bs=='2'?saw(cbrt(mb%512)*(lr?120:100)*(1+(r>>12&31&r>>15&15))*cos(r/s('12',12)%8192*PI/16384)**.5):
bs=='3'?sin((mb|mb*(r>>12&31^r>>(lr?14:15)&15))*PI/256)
:0
),

b2=saw(mb/4)+saw(mb/(lr?3.99:4.01))+saw(mb/(lr?3.98:4.02)),

b3=sin(1/(mb%512)*s([1500,750,1000],12))*s('1 1 111 1 1 1 11',12)/2||0,

s1=dlay(saw(ma*(r&(lr?16384:12288)?2:4)&r>>s([8,7,8,9,6,5],13))*s('1 ',15),14000,.6,.5),

s2=s([sin(p*(r>>10^r>>12^r/1.5>>15)*PI/128),saw((p^r>>(lr?10:12))*(r>>15^r>>16))],s([13,14,12],14))*cos(r%1024*PI/2048)**3*s('1 11 11 1 1 ',12),

ss=dlay((
sv=(dt,e)=>saw(mb*dt,e)/4+saw(c2*dt,e)/4+saw(c3*dt,e)/4+saw(c4*dt,e)/4,
sv(1)/3+sv(lr?.99:1.01)/3+sv(lr?.98:1.02)/3+sv(2)/3+sv(lr?1.99:2.01)/3+sv(lr?1.98:2.02)/3
)*1.5*s('1 11 11 ',12)*s('111 111 111 11  ',14),14000,.7,.5),

sw=lpr((random()-.5)*sin((lr?t^t/2:t|t/2))+sin(t^t/(lr?1.99:2.01))/4,cl(cos(r*PI/2**18),.001,.9),.9),

d=(
ds=s('k hhs hhk hhs hhk hhs hhkhk shkh',12),
ud=cos(r%4096*PI/8192),
ds=='k'?tanh(sin(1/cbrt(r%4096)*4096**.8)/(r%4096)*2048)*ud**.5*8:
ds=='h'?(t*(441/480)&1)*sin(t|t^4|t*(lr?2:4))*ud**11*9:
ds=='s'?(sin(t*(lr?1.01:1)|t>>1)*3*sin(r*PI/4096))+sin(cbrt(r%4096)*14**.9)*ud*8.5:0
),

sc=(ds=='k'|ds=='s')?sin(r%4096*PI/8192)**.8:1,

tanh((((a1*16+a2*20+a3*15+s1*10+(s2*8+ss*32)*sc*1.4)*7+(b1*20+(b2*2+b3*5)*4.5*sc**1.1)*13+sw*64)*sc+d*64)/1024)*1.2

))(0),M(1)]