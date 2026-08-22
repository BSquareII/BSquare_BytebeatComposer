bpm=117,
sr=48000,
spb=32768,

pitch=SQRT2-(PI/64),
speed=abs(bpm/120/sr*spb),

tt=t*pitch,
ts=t*speed,

t||(fx=[],R=exp),
fxi=0,

lpf=(x,c,r)=>(c+=1e-14,r+=1e-14,fx[++fxi]||=[0,0],fx[fxi][0]+=fx[fxi][1]+=(x-fx[fxi][0]-fx[fxi][1]*(1-sqrt(r)**.7)/c)*c),
hpf=(x,c,r)=>x-lpf(x,c,r),
bpf=(x,h,l,r)=>hpf(lpf(x,l,r),h,r),

dly=(x,l,f,w)=>(fxi++,fx[fxi]||=new Float32Array(l),o=x+fx[fxi][(t+w)%l|0],fx[fxi][t%l]=o*f),

rvrb=(x,c,l,f,d,w,e=x=>x)=>{let o=0;for(let i=0;i<=c;i++)o+=e((dly(x,l,f,PI**i,e)-x)/(1+c));return x*d+o*w},

wv=x=>sin(sin(x+sin(x*1.005+sin(x*3-cos(x*4))))-cos(x*2.005-cos(x*1.98)))+sin(x+sin(x*7)*R(1-ts/4096%1*3)),

x=lr=>rvrb(wv([1.005,.995][lr]*t/1.25/1.5**13*1.5**(ts>>12&7)*2**('0257'[ts>>16&3]/12)),32,[12288,16384][lr],.9,.35,15,x=>bpf(x,.1,.01,.3))*.6*min(1,R(ts/16384%1*5)/7)+lpf((random()-.5),ts&262144?min(1,R(ts/262144%1*3)/20,1):min(R(1-ts/262144%1*6)/2.12,1),.6)/3*min(1,R(ts/16384%1*3)/4)+atan(atan(sin((ts%16384)**.01*2048)*3)*R(1-ts/16384%1*12)*2+(random()-.5)*R(1-ts/16384%1*20)*2)/2*!(ts&16384)+tanh(tanh(sin((ts%16384)**.01*2e3)*3)*R(1-ts/16384%1*12)+bpf(random(),.01,.2,.1)*min(1,R(ts/16384%1*5)/9)**.6*R(1-ts/16384%1*5)*3)/1.2*!!(ts&16384)+hpf(random(),.1,.03)*R(1-ts/4096%1*14)/3+hpf(random(),.2,.1)*R(1-ts/16384%1*50)/2,

[x(0),x(1)]