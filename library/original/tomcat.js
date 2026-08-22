//Boody Gliss by TomCat/Abaddon, bytebeat 1k for Winter Chip XVI, thanks to ern0 for some tips
//FM Piano constants from Funute's frequency machine
t/=22000,d="10001000100000007077999970779999707799F9",
H=n=>f=2**(n/12)*55,F=(d,s,l,r,p)=>l*sin(f*r*PI*(m+p))*(m<0?0:m<d?1-(1-s)*m/d:s)/f*.011,
P=(n,v)=>{f=H(n),o+=F(.407,.09,f*v*99,2,F(.707,.94,8,6.0072,F(.405,.94,2,24,0))+F(.075,.94,17,1.9976,0))},
G=(k,v)=>{for(i=0,j=t*32&k;m=t%(1/32)+i/32,i<4;)if(j>=i++)P((36.2-j+i)*12/7|0,v)},//Glissando white keys
C=k=>{for(i=0,m=t%1-(u&1?.25:.5);i<4;)P(("0x"+"158D"[i++]|0)-5*k+5,20)},
N=(k,n)=>{m=t%1-k,P(n+3,32)},S=k=>{for(f=k,m=t%.25;f<999;f+=k)o+=F(.25,0,f*600,2,0)},
b=(u=2*t-1)+2,o=128,u&31?N(0,b&2)|N(1/8,-b&2)|C(t&1)|2*u&7?0:G(15,6):G(31,13),
n=t&15<8?0:"0x"+d[(t*4&63)-24]|0,n&&S(H(n)),//play data with harmonics
o+=(4/(b%4)&16)+30*sin(b%4*2e3*exp(-b%4*15))**3//iq's kick+division
+(2*t&31?(u>0&&random()*(-32*b&(b-3&15?b&1?15:0:31)))*1.2:0)
+(t+15&15?0:3/(t%1)&32),//make open hat more punchy
min(max(o,0),255)