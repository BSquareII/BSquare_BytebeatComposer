t?0:fx=[],fxi=0,lpf=(a,c,r)=>(c+=1e-14,fx[++fxi]??=[0,0],fx[fxi][0]+=fx[fxi][1]+=(a-fx[fxi][0]-fx[fxi][1]*(1-sqrt(r)**.7)/c)*c),hpf=(a,c,r)=>a-lpf(a,c,r),bpf=(a,h,l,r)=>lpf(hpf(a,h,r),l,r),del=(i,d,f,c=0)=>(fx[++fxi]??=Array(d).fill(0),out=i+fx[fxi][(t+c|0)%d],fx[fxi][t%d]=out*f,out),rev=(m,a,s,v,f,d,w,E=x=>x)=>{var out=0;for(let i=0;i<a;i++){out+=E((del(m,s+(v*i),f,i*1568+12e3+(cos(t/32e3*(i/70+.8))*96))-m)/a)};return m*d+(out*w);},bt=x=>(x&255)/128-1,

//credits to insanity for the bytebeat tools above^^^
//and also for the reverb fixing as well

s_=8,

t?0:b=c=d=0,C=cos,S=sin,l=t/s_>>11,a=PI*t/64*2**((((l/4&5|2)^l>>4&3+(l&6)/3)+(t%([0,0,2,3,0,-9,2,-11][l/4&7]+4))*7)/12),b+=S(S(S(S(a+S(a))+C(a/2))+C(2*a)+S(t*PI/s_/8192)+C(t*PI/s_/12e3))+a/2+C(a*3/4)+S(5/4*a)+4*S(t*PI/s_/15e3)),b/=2,c+=b/3-c/4,d+=c/5-d/4,

st=i=>rev(lpf(d*2,.3,.2),8,i?11e3:9e3,i?2e3:1700,.6,.5,2,x=>lpf(x,.07,.1)),

h=_=>(random()-.5)/2*(1-t/s_/4096%1)**2,
k=(x,y)=>x((t%(16384*s_))**.2*y)*2*max(1-t/16384/s_%1*2,0)**3,
s=x=>x(9e9*x(t>>2))*(1-t/s_/16384%1)**7*(t/s_>>14&1),
b_=x=>x(t/8+x(t/3)**2)*max(1-t/s_/8192%1*3,0)**2*(t/s_>>13&1),

[st(0)/*+h()+k(sin,30)+s(sin)+b_(sin)*/,st(1)/*+h()+k(cos,50)+s(cos)+b_(cos)*/].map(x=>atan(tanh(hpf(x,.01,.01)))*1.175)