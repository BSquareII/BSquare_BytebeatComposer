dsp=0,

BPM=200,
sR=48e3,
sPB=32768,
tn=441, 
tr=-1,
edo=12,

r=t*abs(BPM/((120*sR)/sPB)),
p=(t/sR*256)*tn*2**((tr-9)/edo),

b=x=>(x)%256/128-1,
s=(x,y,z=0)=>x[z?y:(r/2**y)%x.length|0],
ms=(x,y,z=0,w=0)=>p*2**((parseInt(s(x,y,z),36)-(-w))/edo)||0,

t?0:d_fx=[],d_fxi=0,d_max=1e5,
dlay=(inp,time=1,mix=.55,feedb=.55)=>(d_fxii=d_fxi++,d_fx[d_fxii]??=new Float32Array(d_max),out=inp+d_fx[d_fxii][t%round(time)],d_fx[d_fxii][t%round(time)]=out*feedb,inp*(1-mix)+out*mix),

cl=(x,mn,mx)=>min(max(x,mn),mx),
saw=x=>atan(tan(x*PI/256))/(PI/2),

m1=ms('77AACC77AA7     AACC557A77C     5557AA75750     5557AA75750     ',14)*2,

m2=ms('CF FHJ JQ QO',s([12,11,13],14)),

mb=ms('CCFF8ACC8A888ACC',16)/2,
mc1=mb*2,
mc2=ms('FFJJAFFFAFAAAFFF',16),
mc3=ms('JJMMCHJJCHCCCHJJ',16),
mc4=ms('MMQQHMMMHMFFHMMM',16),
mc5=ms('QQTTOOQQOOMMOOQQ',16),

m=[(M=lr=>(

i1=
sin(((r&8192?mb^mb/2:mb)|mb/(lr?2.01:1.99)+mb*(r/2**s([9,10,7,2,7,12,3,5,14,12,6],(r&8192?13:14))%(r&8192?(r&12288?(r&16384?8:32):16):8)|0))*PI/(r&8192?256:128))*sin(r/(r2=(r&16384?1:2))%16384*PI/32768)**.8*s('11 11 1 111 1',13),

i2=cl((
is=s('11 1112 223 1 13211 12 323444444',12),
is=='1'?b(2*(r>>(lr?10:12)^p)*r>>(lr?11:12)):
is=='2'?cl(b(p/(p&r>>12^r>>15&21)|p*(p&r>>12)),-1,1):
is=='3'?b(p*(lr?1.99:2.01)^sin(p*(r&16384?(r>>10&15):1)*PI/512)*128+127.5):
is=='4'?b(((sin((p^p/(lr?4:2))*PI/(r&8192?256:512))*128+127.5^r/(r&4096?128:256))))*1.5
:0
)||0,-1,1),

ss=(
ch=(dt=1)=>saw(mc1/dt)/4+saw(mc2/dt)/4+saw(mc3/dt)/4+saw(mc4/dt)/4+saw(mc5/dt)/4,
ch(1)/2+ch(lr?1.99:2.01)+ch(lr?.99:1.01)/2+ch(lr?.98:1.02)/2+ch(lr?1.98:2.02)/2+ch(2)/2+ch(4)/2
)*sin(r%16384*PI/32768)**1.5,

l1=(
ls=s('121231232314',(r&8192?14:13)),
ls=='1'?
sin((m1^r>>(lr?10:12))*PI/128)/2+saw(m1):
ls=='2'?
sin(m1*PI/64+sin((m1*(lr?.99:1.01)|m1/(lr?1.99:2.01))*PI/128)+saw(m1^m1/2)*2):
ls=='3'?
cbrt(sin(m1*PI/128))+sin((m1&r>>(lr?10:12))/(1+(r>>12&7^r>>15&3))):
ls=='4'?
sin((m1|r>>(lr?5:6))*PI/128)+sin((m1&r>>(lr?6:5))*PI/128)
:0
)*s('11 1 1 111 11 11',(r&16384?12:13)),

l2=dlay(sin((m2^r>>(lr?10:r&8192?8:12))*PI/(r&8192?16:32)/(1+(r>>12&3^r>>15&1)))*cos(r/s('11214212',15)%4096*PI/8192)**(s([.7,1,3],13)),12288,lr?.35:.4,.5),

b1=b(mb/2+(sin((mb|mb/(lr?1.99:2.01))*PI/512)*128))*sin(r%16384*PI/32768)**.7,

k=tanh(sin(12*cbrt(r%16384)**.8)/(r%16384)*256*8)*cos(r%16384*PI/32768)**3,

sn=(sin(4*sqrt(r%16384)**.9)*cos(r%16384*PI/32768)**3+(((random()-.5)+atan(tan(t*(lr?1.01:1)|t>>1))/3)*abs(sin(r*PI/16384))**.7))*s(' 1',14),

h=min(max((((((t*(441/480))&1)-.5)*sin(t|t/(lr?2.105:2.2))/2+sin(t/2)/8)/(r%4096)*16384*cos(r%4096*PI/8192)**9)*s('  11',12),-1),1),

tanh((i1*76+i2*42+l1*21+l2*20+ss*64+b1*37+(k*5+sn*3.5+h*4)*24)/256)*1.34
))(0),M(1)],

info = function(length) {
var lat = 
[
'Urmanda ğına yuldar ütä tütä',
'Yawğa kite başqort irðäre. Kem? Hay!',
'Nuğaybäk, hay, lim zilär, Nuğaybäk, ',
'Nuğaybäk, hay, lim zilär, äy häylük.',
'Yawıð doşmandarğa qarşı bara',
'Haqlar ösön tıwğan ildären. Kem? Hay!',
'Nuğaybäk, hay, lim zilär, äy häylük',
'Nuğaybäk, hay, lim zilär, äy häylük.'
][r>>18&7]
var cyr = 
[
'Урманда ғына юлдар үтә түтә',
'Яуға китә башҡорт ирҙәре. Кем? Һай!',
'Нуғайбәк, һай, лим зилә, Нуғайбәк ',
'Нуғайбәк, һай, лим зилә, әй һәйлүк',
'Яуыз дошмандарға ҡаршы бара',
'Һаҡлар өсөн тыуған илдәрен. Кем? Һай!',
'Нуғайбәк, һай, лим зилә, әй һәйлүк',
'Нуғайбәк, һай, лим зилә, әй һәйлүк'
][r>>18&7]
var eng = 
[
'Only in the woods paths unfold straightly',
'Bashkir men are going to war. Who? Hey!',
'Nagaibak, oh hear them ringing, Nagaibak',
'Nagaibak, oh hear them ringing, hey hayluk',
'They are going against the evil foes',
'To defend their native land. Who? Hey!',
'Nagaibak, oh hear them ringing, hey hayluk',
'Nagaibak, oh hear them ringing, hey hayluk'
][r>>18&7]
throw "\n======= Bashkir: =======\n" + "Latin: " + lat + "\nCyrillic: "+ cyr + "\n======= English: =======\n" + eng
},

dsp>0||(t/512%1%1)?m:info()