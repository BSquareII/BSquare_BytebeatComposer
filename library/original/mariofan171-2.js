BPM=186,
sR=48e3,
sPB=32768,
tr=2,
tn=445, 
edo=12,

r=t*abs(BPM/((120*sR)/sPB)),
p=(t/sR*256)*tn*2**((tr-9)/edo),

b=x=>(x)%256/128-1,
s=(x,y,z=0)=>x[z?y:(r/2**y)%x.length|0],
ms=(x,y,z=0,w=0)=>p*2**((parseInt(s(x,y,z),36)-(-w))/edo)||0,
saw=x=>atan(tan(x*PI/256))/(PI/2),
cl=(x,mn,mx)=>min(max(x,mn),mx),

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
),

str='53656D6170686F726520686572652C206A75737420746F206B6E6F772074686174207265616C6C7920696E73696465206F66206D652C204920616D206120776F6D616E20737475636B20696E2061206D616E277320626F647920616E642049276C6C20616D2073657474696E6720697420667265652E206D6974682074686520706F776572206F6620736369656E636520616E6420746563686E6F6C6F67792C20492063616E206E6F772066696E616C6C79206C697665206173206120776F6D616E20666F722031373820796561727320616E6420636F756E74696E672C20686F706566756C6C7920736F2E',

m1=ms('CEFCEFACHECF',13),

m2=ms((r&8192?'ACFHJMOQ':'CEFHJMOQ'),parseInt(s(str,12),16)%8,1)*(1+(r>>12&3^r>>15&1))/2,

mb=
c1=ms('CC57A57788AC88A5',16),

c2=ms('FF8AF8AAAAEFAAE8',16),

c3=ms('JJAEJAEECCJJCCJA',16),

c4=ms('MMCHOCHHJJOMJJOC',16),

u1=s('111 1 11 1 1',12),

[(M=lr=>(

sc=(
scq=s('1 1 1 1 1 1 1 11',13),
scq=='1'?sin(r%8192*PI/16384)**(r&16384?(lr?1:1.2):(lr?.6:.7)):1
),

s1=sin(((m1>>(r&12288?0:(lr?s([2,4,1,4],14):s([3,6,4,5,3,2],13))))^r>>(lr?10:12))*(1+(r>>s([10,7,0,9,5,12,10,7],(r&12288?s([12,13,14],12):13))&3^r>>(lr?13:15)&1))*PI/2**((r&12288?5:r>>(r&24576?(r&12288?10:14):12)&7)+(r>>12&3^r>>(lr?15:16)&1)))*u1,

s2=(
sq=s('1232122132112321',12),
sq=='1'?cbrt(sin(m2*PI/64)+saw(m2/(lr?1.99:2.01)))*sin(m2*PI/128+saw(m2*(r%8192/65536))):
sq=='2'?saw(m2/(lr?1.99:2.01))*sin(m2*PI/256+sin(p*r/16384)*1.2):
sq=='3'?b(r&2048?m2^m2/(lr?1.99:2.01):m2&r>>s([5,8,2,7,1,5],12))*saw(m2*(lr?1.01:.99)):0

)*s('1  11 11 1 1',12)*(r&16384?s('1 ',11):1),

s3=dlay(cbrt(sin((((r&16384?m2/2:m1)^r>>(lr?11:12))*2**(U=s([1,3,2,8,2],12))/2>>U)*(1+(r>>12&3^r>>14&1))*PI/(r&8192?64:r&16384?16:32)))*cos(r%4096*PI/8192)**5,12288,.5,.6),

ss=(
sv=dt=>saw(c1*dt)/6+saw(c2*dt)/6+saw(c3*dt)/6+saw(c4*dt)/6,
sv(1)+sv(lr?.99:1.01)+sv(lr?.995:1.005)+sv(.5)+sv(lr?.49:.51)
)*sc**2*s('1 11 11  1 1 1 11 1  11 1 11 11',12),

b1=(
bs=s('11112221111133332222113344442222',12),
bs=='1'?saw(cbrt(mb%2048)*(lr?200:100)*s([1,.5,.7,3,3,2],(r&16384?12:13))):
bs=='2'?atan(tan(cbrt(saw(mb/8)+saw(mb/(lr?7.99:8.01)))*s([3,7,11,18,4],13)))/2:
bs=='3'?sin((mb|mb/(lr?1.99:2.01)*(1+(r>>(lr?9:10)&15)))*(1+(r>>15&1))*PI/256+sin((mb|mb/(lr?1.99:2.01))*PI/512)):
bs=='4'?saw(cbrt(mb%1024)*sin(r*PI/32768)*(lr?500:300)):0
),

b2=r/s('1241341',12)&24576?
cbrt(sin(cl((r%8192/(mb%1024)*128)*PI/1024,0,16)))+saw((mb/(lr?1.99:2.01))/2)/2:
cbrt(sin((r%4096*(mb%1024)/1024)*PI/1024))*sc**1.5,

b3=sin(mb*PI/(lr?1024:2048)+saw(mb/16)+saw(mb/8)),

sw=lpr(atan(tan(t*(lr?1.05:1)*t|t*(lr?1.01:1)>>1))/4,abs(cos(r*PI/2**20)**7),.9)*sin(r%16384*PI/32768)**.7,

k=tanh(atan(sin((1/cbrt(r%8192)*9e3)**.7))*8/(r%8192)*4096)*cos(r%8192*PI/16384)**7*scq,

h=cl((((t*(441/480)&1)-.5)*random()*sin(t/1.5))*2/(r/s('12',13)%4096)*512,-1,1),

sn=(sin(cbrt(r%16384)*12)*cos(r%16384*PI/32768)**3+(sin((t>>(lr?3:2))*(lr?.99:1.01)|t>>(lr?2:1))*random())*sin(r*PI/16384))*s(' 1',14),

tanh(((s1*42+s2*64+s3*40+b1*60+b2*30)*64*sc+(b3*50+ss*180+k*200+sn*280+h*350+sw*70)*32)/16384)*1.25
))(0),M(1)]