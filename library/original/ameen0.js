this.a??=b=c=d=e=f=g=h=i=j=0,
SR=48000,

t/=SR,
q=999,
Dec0=g+=(((-t*8%2)/2+1)-g)/32*(48000/SR),
Dec1=t<63?t<62?t*64%16+1:(t%1*64+64):64,
Dec2=t<63?t<62?t*128%16+1:(t%1*64+64):64,
Dec3=t<80?t<64?1:h+=((-t%1)-h)/32:1,

GenNote=x=>440*2**(x/12),

Clamp=x=>min(max(x,-1),1),
noi=x=>(x*=16,x-=x%16,cos(x*cos(x)))%1,
Sinf=x=>sin(x*2*PI),
Organ=x=>(x*=256,sinf(x+sinf(x*2)*4*Dec0+sinf(x*8)*16*Dec0**1.2)),
Saw=x=>(x*=256,y=n=>n<15?sinf(x*n)/(n**1+0.0001)/1.334+y(n+1):0,y(0)),

LIN=[[-14,-9,-14,-6,-14,-9,-14,-4,-14,-9,-14,-2,-14,-9,-14,1,-13,-9,-13,-6,-13,-9,-13,-4,-13,-9,-13,-2,-13,-9,-13,1],[-9,-6,-4,-3,-9,-6,-4,-1,-9,-6,-4,1,-9,-6,-4,3,-9,-6,-4,-9,-9,-6,-4,-11,-9,-6,-4,-13,-9,-6,-4,-15]],

p=t<80?t<64?0:1:0,

a+=b+=(GenNote(LIN[p][int(t*4&31)])-b)/512,
c+=d+=t<61?0:GenNote(50-d)/750,
e+=f+=(t<61?0:GenNote(50-f))/750,

LeadIntro=Organ(a/SR)/3*Dec3,
Lead=t<80?t<8?0:(Saw(t*GenNote([-26,-26,-26,-26,-25,-25,-25,-25][int(t&7)]))/3+Saw(t*GenNote([-21,-21,-21,-21,-21,-21,-21,-21][int(t*4&7)]))/16+Saw(t*GenNote([-18,-18,-18,-18,-16,-16,-14,-14][int(t*2&7)]))/3)/2:0,
Bass=t<80?t<24?0:sinf(cbrt(t*1099511627776%1099511627776))/2:0,
Percussion=t<80?(t<62?t<48?0:
noi(t*GenNote(31))/[Dec1,q,q,Dec1,q,q,Dec1,Dec1][int(t*4%8)]*2
+Clamp(noi(t*GenNote(36))/[Dec2,Dec2,Dec2,q][int(t*8%4)]):noi(c/48000)/Dec1+noi(e/48000)/Dec2
)/6:0,


(t<88?(t<40?t<16?Lead+LeadIntro+Bass+Percussion:(Lead+LeadIntro+Percussion)*2+Bass*4:(-t*2%1)*Lead*2+LeadIntro*2+Bass*4+Percussion*2)/3:0)/1.15