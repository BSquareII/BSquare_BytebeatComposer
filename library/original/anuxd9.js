t?0:fx={a:[],b:[],c:[],d:[],e:[]},

fxi=0,


lpf=(a,c,r)=>(c+=1e-14,fx.a[fxi]||=fx.b[fxi]||=0,fx.a[fxi]+=fx.b[fxi]+=(a-fx.a[fxi]-fx.b[fxi++]*(1-sqrt(r)**.7)/c)*c),

hpf=(a,c,r)=>a-lpf(a,c,r),

bpf=(a,h,l,r)=>lpf(hpf(a,h,r),l,r),

del=(i,d,f,c=0)=>(fx.c[fxi]||=Array(d).fill(0),out=i+fx.c[fxi][(t+c|0)%d],fx.c[fxi++][t%d]=out*f,out),

rev=(m,a,s,v,f,d,w,E=x=>x)=>{var out=0;for(let i=0;i<a;i++){out+=E((del(m,s+(v*i),f,i*1568+12e3+(cos(t/32e3*(i/70+.8))*96))-m)/a)};return m*d+(out*w);},

sl=(x,y)=>(fx.d[fxi]||=fx.e[fxi]||=0,fx.d[fxi]+=fx.e[fxi]+=(x-fx.e[fxi++])/y),

T=t/(v=1.8)|0,m=t*2**((+"0275"[T>>18&3]+[0,7,8,10,0,7,2,5,3,7,10,15,7,2,12,8][T>>((T%3)==2?13:(T%3)==1?12:10)-(T>>20&1?0:3)&15])/12),g=(x,y=1)=>x&&(cbrt(asin(sin(m*x*PI/127)))+cbrt(asin(sin(m*y*x*PI/128))))/2+g(x-1),f=(x,y)=>g(1+x,y)/(1+x),i=y=>(f(T>>20&1?4+round(9*abs(sin(T/131072*PI)**2)):10,y)*cos(T/(u='31'[T>>12&1])%4096*PI/(8192*u))**.4||0),[i(1.003),i(.997)].map(x=>(u=T/16384%1*2,h=T>>14&1,tanh(atan2(bpf(x,.02,.15,.45)*8*min(u,1)+asin(sin(cbrt(t%(16384*v))*7))*15*max(1-u,0)**2*!h+cbrt(sin((t%(16384*v))**0.3*30))*15*max(1-u,0)**.75*(!(T>>10&15)&h)+lpf((random()-random()),.25,.2)*18*max(1-u*1.125,0)**1.5*h+tan(sin(cbrt(t*2**("0275"[T>>18&3]/12)&1023)*4))*3*min(u*.875,1)**3,PI))))