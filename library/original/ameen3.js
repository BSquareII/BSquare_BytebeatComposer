T=t,
SR=24000,
T||(Delay=Array(DelBufLen=12288/33000*SR|0).fill(0)),
this.a??=b=c=d=e=f=g=h=i=j=k=l=m=n=o=p=q=0,


t/=SR,
qq=999,
Dec0=g+=(((-t*4%1)/2+1)-g)/32*(48000/SR),
Dec1=t<63?t<62?t*64%16+1:(t%1*64+64):64,
Dec2=t<63?t<62?t*128%16+1:(t%1*64+64):64,
Dec3=t<80?t<64?1:h+=((-t%1)-h)/32:1,

GenNote=x=>440*2**(x/12),
Clamp=x=>min(max(x,-1),1),

noi=x=>(x*=16,x-=x%16,cos(x*cos(x)))%1,
Sinf=x=>sin(x*2*PI),
Organ=x=>(Sinf(x)+Sinf(x*2)/2*(Dec0)+Sinf(x*4)/4*(Dec0**1,2)+Sinf(x*8)/8*(Dec0**1.4)+Sinf(x*16)/16+Sinf(x*32)/32*(Dec0**1.8))*(Dec0**1.25),
Saw=x=>(Sinf(x)+Sinf(x*2)/2+Sinf(x*3)/3+Sinf(x*4)/4+Sinf(x*5)/5+Sinf(x*6)/6+Sinf(x*7)/7+Sinf(x*8)/8+Sinf(x*9)/9+Sinf(x*10)/10+Sinf(x*11)/11+Sinf(x*12)/12+Sinf(x*13)/13+Sinf(x*14)/14+Sinf(x*15)/15+Sinf(x*16)/16)*3,

LIN=[[-14,-9,-14,-6,-14,-9,-14,-4,-14,-9,-14,-2,-14,-9,-14,1,-13,-9,-13,-6,-13,-9,-13,-4,-13,-9,-13,-2,-13,-9,-13,1],[-9,-6,-4,-2,-9,-6,-4,-1,-9,-6,-4,1,-9,-6,-4,3,-9,-6,-4,-9,-9,-6,-4,-11,-9,-6,-4,-13,-9,-6,-4,-14]],

ppp=t<80?t<64?0:1:0,

a+=b+=(GenNote(LIN[ppp][int(t*4&31)])-b)/5,
c+=d+=t<61?0:GenNote(50-d)/750,
e+=f+=(t<61?0:GenNote(50-f))/750,
k+=l+=(GenNote([-26,-26,-26,-26,-25,-25,-25,-25][int(t&7)])-l)/4096,
m+=n+=(GenNote([-21,-21,-21,-21,-21,-21,-21,-21][int(t*4&7)])-n)/4096,
o+=p+=(GenNote([-18,-18,-18,-18,-16,-16,-14,-14][int(t*2&7)])-p)/4096,


LeadIntro=Organ(a/SR)/3*Dec3,

Lead=t<80?t<8?0:(Saw(k/SR)/3+Saw(m/SR)/16+Saw(o/SR)/3)/2:0,

Kick=t<80?t<24?0:Sinf(cbrt(t*(2**19)%(2**19)))/2:0,

Percussion=(t<80?(t<62?t<48?0:
noi(t*GenNote(31))/[Dec1,qq,qq,Dec1,qq,qq,Dec1,Dec1][int(t*4%8)]*2
+Clamp(noi(t*GenNote(36))/[Dec2,Dec2,Dec2,qq][int(t*8%4)]):noi(c/48000)/Dec1+noi(e/48000)/Dec2
)/6:0)*4,


Inp=(t<88?(t<40?t<16?
Lead
+LeadIntro
+Kick
+Percussion
:
(
Lead
+LeadIntro
+Percussion
)*2
+Kick*4
:
(-t*2%1)*Lead*2
+LeadIntro*2
+Kick*4
+Percussion*4
)/3:0)/1.15,

xxx=q+=(Inp-q)/SR*6000,xxx=xxx+Delay[T%DelBufLen],

Delay[T%DelBufLen]=xxx/1.5,

atan2(xxx*2,PI)