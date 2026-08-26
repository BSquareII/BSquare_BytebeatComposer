t?0:fx=[],fxi=0,dn=(x,y)=>isNaN(x)?y:x,nt=x=>2**(dn(x,-9e9)/12),lpf=(a,c,r)=>(c+=1e-14,fx[++fxi]??=[0,0],fx[fxi][0]+=fx[fxi][1]+=(a-fx[fxi][0]-fx[fxi][1]*(1-sqrt(r)**.7)/c)*c),hpf=(a,c,r)=>a-lpf(a,c,r),bpf=(a,h,l,r)=>lpf(hpf(a,h,r),l,r),del=(i,d,f,c=0)=>(fx[++fxi]??=Array(d).fill(0),out=i+fx[fxi][(t+c|0)%d],fx[fxi][t%d]=out*f,out),rev=(m,a,s,v,f,d,w,E=x=>x)=>{var out=0;for(let i=0;i<a;i++){out+=E((del(m,s+(v*i),f,i*1568+12e3+(cos(t/32e3*(i/70+.8))*96))-m)/a)};return m*d+(out*w);},bt=x=>(x&255)/128-1,pwm=(x,y)=>hpf(bt((x/2&127)+y&128),.004,.004),sqr=x=>pwm(x,64),tri=x=>asin(sin(x*PI/128))/PI*2,sinf=x=>sin(x*PI/128),sr=32e3,sb=32768,bpm=150,tun=440,not=-5,tt=t/sr*nt(not)*tun*64,dls=x=>round(x*sr/sb/(bpm/60)),ts=t/sr*(bpm/60)*sb,seq=(x,y)=>x[(ts>>y)%x.length],drm=(D,R)=>(F=2**R,P=ts%F,
{k:tanh(tanh(sin(P**.01*2e3)*12)*exp(-ts/F%1*2.7)+(random()-.5)*exp(-ts/F%1*14)),s:tanh(tanh(sin(P**.01*2200)*12)*exp(-ts/F%1*3)+(random()-.5)*exp(-ts/F%1*11)+bpf(random(),.03,.15,.25)*min(exp(ts/F%1*4.5)/9,1)*exp(-ts/F%1*2)*6.5),h:hpf(random(),.2,.4)*exp(-ts/F%1*6),b:atan2(sin(t/sr*256*440*PI/128),.1)*exp(-ts/F%1*4)/1.5," ":0}[seq(D,R)]),
ms=i=>(
D=i?1.005:.995,
P=nt(seq([0,-1,-2,2],17)),
z=+seq('0235',14),
mel=rev((bt(tt*D*D*nt(z)*P)+sqr(tt*nt(z+7)*P*D))*seq('1010011010110101',13),24,i?9545:9787,i?6956:7956,.5,.6,3,x=>bpf(x,.03,.3,.01)),
bs=tanh(sinf(tt/2*D*P)*70*exp(-ts/8192%1*7))*seq(`${'11001111'.repeat(3)}11100011`,12)/2,
bs2=hpf(bt(tt*D*P%256*(1+abs(sin(ts*PI/262144))*4.4)),.01,.01)*exp(-ts/seq([8192,16384,16384,16384],13)%1*1.75),
arp=pwm(tt*D*nt(seq('0357',12))*P,32),
dr=drm('k h s h ',13)+drm('h ',12),
sch=min(1,exp(ts/32768%1*5)/4),
mel*sch/2+dr*.9+arp/5+bs/2+bs2/3),
[ms(0),ms(1)].map(tanh)