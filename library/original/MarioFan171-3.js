dsp=0,

BPM=120,
sR=48e3,
sPB=32768,
tn=440, 
edo=12,

r=t*abs(BPM/((120*sR)/sPB)),
tr=r/(2**22/1.5)-7,
p=(t/sR*256)*tn*2**((tr-9)/edo),

b=x=>(x)%256/128-1,
s=(x,y,z=0)=>x[z?y:(r/2**y)%x.length|0],
ms=(x,y,z=0,w=0)=>p*2**((parseInt(s(x,y,z),36)-(-w))/edo)||0,

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

cl=(x,mn,mx)=>min(max(x,mn),mx),
saw=x=>atan(tan(x*PI/256))/(PI/2),

m1=ms('7CACAFHF',(r>>12^r>>15)%8|0,1)/2*(1+(r>>12&3))/2,

m2=ms('COCJCFHC',(r>>13^(r>>14&5))%8,1),

mp=ms(s(['CFHJO','AHMOQ','8ACJM'],17),0),

mb=ms('CA8',17),

m=[(M=lr=>(

h1=
((r>>15)%60<3)?
(sin(p*PI/128+cos(p*PI/64)+sin(p*PI/24))+sin(p*PI/(lr?127:128)+cos(p*PI/(lr?63:64))+sin(p*PI/(lr?9:12))))/1.5*cos(r%2**17*PI/2**18)**5:0,

s1=cbrt(sin(p*PI/8))*cos(r%32768*PI/65536)**21,

s2=dlay(sin((m1^r>>(lr?10:12))*PI/16)*cos(r%4096*PI/8192)**abs(cos(r*PI/2**18)*10),12288,.3,.4),

i1=dlay(sin((m2&r>>(lr?11:12))*PI/(r&8192?128:256))*cos(r%8192*PI/16384)**3,29.5e3,.6,.6),

i2=sin((m2&m2/(lr?2:.5)*(1+((r&8192?-r:r)>>10&31^r>>13&5^r>>14&15)))*PI/(r&12288?256:512)),

b1=lpr(sin((((mb^mb/(lr?4:2)+mb)|mb/(lr?4:2))^r>>12)*PI/512),(sin(r%16384*PI/32768)+.1)*.95,.9)*sin(r%16384*PI/32768),

pad=dlay(lpr(sin(mp*PI/128+saw(mp*2)+cos(mp*PI/256)+sin(mp*PI/8))*random(),.1,.6)*3*sin(r%16384*PI/32768)**.7,12288,.55,.4)||0,

k=(tanh(sin(12*cbrt(r%16384)**.7)/(r%16384)*256)*2)*cos(r%16384*PI/32768)**3,

h=min(max((((((t*(441/480))&1)-.5)*sin(t|t/(lr?2.105:2.2))/2+sin(t/2)/8)/(r%4096)*16384*cos(r%4096*PI/8192)**9)*s('  11',12),-1),1),

sn=(sin(4*sqrt(r%16384)**.9)*cos(r%16384*PI/32768)**3+(((random()-.5)+atan(tan(t*(lr?1.01:1)|t>>1))/3)*abs(sin(r*PI/16384))**.7))*s(' 1',14),

tanh((s1*1.2+s2*1.4+h1+pad*1.6+k*6+h*1.8+sn*1.5+i1*1.4+i2/1.6+b1*1.7)/32)*6

))(0),M(1)],


info = function(length) {

var sec = floor((r/sPB)*100)/100
var min = floor(sec/60)
var hr = floor(min/24)

throw "\nElapsed: "
+ (hr<10?'0':'') + hr +':'
+ (min%60<10?'0':'') + min%60 +':'
+ (sec%60<10?'0':'') + sec%60
+ "\nCents: " + floor(tr*1e6)/1e4
},

dsp>0||(t/1024%1%1)?m:info()