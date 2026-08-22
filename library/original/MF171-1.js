BPM=174,
sR=48e3,
sPB=32768,
tn=442,
tr=1,
edo=12,

r=t*abs(BPM/((120*sR)/sPB)),
p=(t/sR*256)*tn*2**((tr-9)/edo),

b=x=>(x)%256/128-1,
s=(x,y=13,z=0)=>x[z?y:((r/2**y)|0)%x.length],
tr=(...x)=>2**(parseInt(s(...x),36)/edo)||0,
ms=(...x)=>p*tr(...x),
cs=(x,y,z)=>ms(x,(y.charCodeAt(r%(y.length*2**z)/2**z|0)%y.length)%x.length,1),
cl=(x,mn,mx)=>min(max(x,mn),mx),
saw=x=>atan(tan(x*PI/256))/(PI/2),

m1=ms('5HOH5HOH0CJC3FMF',13),

m2=ms('0357',16),

u1=s('1121133244223449',13),

[(M=lr=>(

i1=saw(m1+sin(m1*PI/512)*sin(r*PI/65536)*512)*cos(r%8192*PI/16384)**.6/2+(saw(m1/(lr?3.99:4.01))/4+saw(m1/(lr?1.99:2.01))/4),

i2=b((t%(128/tr('C5HCHOH3',13)))**2)*s('1 11 11  1  ',13),

a1=b((t*(t>>(s([10,8,10,12],15))^t)&t>>6)+128)*s('1 1 11 1 11 1 11',13),

b1=cl(saw(m2/4+sin(m2*PI/(lr?1024:512))*sin(r*PI/2**19)*768)*cos(r%4096*PI/8192)*sin(r%16384*PI/32768)*16,-1,1),

b2=atan(tan(cbrt(sin(m2*PI/(lr?512:1024))*64)*(l1=sin(r*u1*PI/16384))*s([5,8,3,12,2,5],14)))*l1*s('111 1 111',13),

d=(
dp=s('kkkk    rrrrs r s r kkkkrrrrs r kkkkkkkkrrrrs r s r kkkkrrrrs r ',(zd=(r>>s([13,12,14,12],14))%(r&49152?4:6)==(r&65536?3:5))?(r>>11)%(r&8192?48:32)|(r>>(r&8192?12:13))%32:11,zd?1:0),
dp=='k'?tanh(sin(8*cbrt(r%8192)**.9)/(r%8192)*256*16)*cos(r%8192*PI/16384)**3*3:
dp=='r'?(b(t*(lr?.97:1)*tan(t*(lr?1.03:1)>>(lr?3:2)&t)))*cos(r%8192*PI/16384)**3*7:
dp=='s'?(sin(t*(lr?1.01:1)^t>>1))*random():0)*5,

h=cl((((t*(441/480)&1)-.5)*random()*sin(t*(lr?1:1.2))/(r%8192)*4096)*cos(r%8192*PI/16384)**9,-1,1),

tanh((atan(d*2)*22+h*32+(i1*16+i2*8+a1*14+(b1*1.7+b2*1.5)*3)*3)/256)*2.8

))(0),M(1)]