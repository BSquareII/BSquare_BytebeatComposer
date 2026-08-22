t?0:fx=[],fxi=0,lpf=(a,c,r)=>(c+=1e-14,fx[++fxi]??=[0,0],fx[fxi][0]+=fx[fxi][1]+=(a-fx[fxi][0]-fx[fxi][1]*(1-sqrt(r)**.7)/c)*c),hpf=(a,c,r)=>a-lpf(a,c,r),bpf=(a,h,l,r)=>lpf(hpf(a,h,r),l,r),del=(i,d,f,c=0)=>(fx[++fxi]??=Array(d).fill(0),out=i+fx[fxi][(t+c|0)%d],fx[fxi][t%d]=out*f,out),rev=(m,a,s,v,f,d,w,E=x=>x)=>{var out=0;for(let i=0;i<a;i++){out+=E((del(m,s+(v*i),f,i*1568+12e3+(cos(t/32e3*(i/70+.8))*96))-m)/a)};return m*d+(out*w);},bt=x=>(x&255)/128-1,pwm=(x,y)=>hpf(bt((x/2&127)+y&128),.01,.004),sr=48e3,bpm=137,sb=2**14,tn=440,not=-7,tt=t/sr*tn*256*2**(not/12),ts=t/sr*(bpm/60)*sb,dls=x=>floor(x*sr/(bpm/60)/sb),

m=i=>(
cha=[[0,4,7,11],[0,4,7,9],[-5,-1,2,6],[-5,-1,4,7]],
ch=rev(del(cha[ts>>15&3].map(E=>pwm(tt*(i?1.005:.995)*2**(E/12),sin(ts*PI/262144)*32+64)).reduce((a,b)=>a+b)*(sc=(ts/16384%1)),Dl=dls(12288),.5),24,i?2374:2686,i?1237:1585,.7,1,3,x=>lpf(x,.2,.1))/2*sqrt(sc),
bs=tanh(lpf(del(lpf(bt(tt/(i?4.02:3.98)*2**(cha[ts>>15&3][3]/12)),(1-ts/4096%1)**7,.4),Dl,.7),.1,.4)),
dr=[tanh(sin((ts%4096)**.1*65)*10)*(1-ts/4096%1)**3,tanh(tanh(sin((ts%4096)**.04*256)*20*(1-ts/4096%1)**17)*1.6+bpf(random(),.2,.2,.1)*10.25*min(1,ts/4096%1*3)*(1-ts/4096%1)**3),tanh(hpf(random(),.1,.1)*(1-ts/4096%1)**7*3)/2,tanh(sin(tt*PI/128*2**(-not/12))*5)*(1-ts/4096%1)**3,0]['0444142404441423'[ts>>12&15]],
tanh(ch+dr+bs*sc**1.25)
),[0,1].map(m)