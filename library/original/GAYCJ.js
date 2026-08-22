bpm=117,
sr=48000,
spb=32768,

pitch=SQRT2-(PI/64),
speed=abs(bpm/120/sr*spb),

tt=t*pitch,
ts=t*speed,

btf=x=>((x)&255)/128-1,
noi=random()-random(),
p=x=>2**(x/12),
seq=(x,s,l)=>x[(s)%l],
seq2=(x,s,l)=>p(x[(s)%l]),
seqparse=(x,m,s,l)=>parseInt(x[(s)%l],m),
seqparse2=(x,m,s,l)=>p(parseInt(x[(s)%l],m)),
n=x=>x||0,
st=(t,s)=>t>s,
en=(t,e)=>t<e,
env=(t,l,c)=>(1-t/l%1)**c,
env2=(t,l,c)=>exp(-t/l%1*c),
sc=(t,l,c)=>(t/l%1)**(1/c),
ris=(t,s,e,l,c)=>(t<s?t>e?0:(t/l%1)**c:0),
fad=(t,l,c)=>(t<l?(t/l%1)**c:1),
nc=(t,l,e)=>min(1,t/l*e%e)*min(1,e-t/l*e%e),

C=[-60,-48,-36,-24,-12,0,12,24,36,48,60],
Cb=[-59,-47,-35,-23,-11,1,13,25,37,49,61],
D=[-58,-46,-34,-22,-10,2,14,26,38,50,62],
Db=[-57,-45,-33,-21,-9,3,15,27,39,51,63],
E=[-56,-44,-32,-20,-8,4,16,28,40,52,64],
F=[-55,-43,-31,-19,-7,5,17,29,41,53,65],
Fb=[-54,-42,-30,-18,-6,6,18,30,42,54,66],
G=[-53,-41,-29,-17,-5,7,19,31,43,55,67],
Gb=[-52,-40,-28,-16,-4,8,20,32,44,56,68],
A=[-51,-39,-27,-15,-3,9,21,33,45,57,69],
Ab=[-50,-38,-26,-14,-2,10,22,34,46,58,70],
B=[-49,-37,-25,-13,-1,11,23,35,47,59,71],

t||(fx=[]),
fxi=0,

lpf=(x,c,r)=>(c+=1e-14,r+=1e-14,fx[++fxi]||=[0,0],fx[fxi][0]+=fx[fxi][1]+=(x-fx[fxi][0]-fx[fxi][1]*(1-sqrt(r)**.7)/c)*c),
hpf=(x,c,r)=>x-lpf(x,c,r),
bpf=(x,h,l,r)=>hpf(lpf(x,l,r),h,r),

dly=(x,l,f,w)=>(fxi++,fx[fxi]||=new Float32Array(l),o=x+fx[fxi][(t+w)%l|0],fx[fxi][t%l]=o*f),

rvrb=(x,c,l,f,d,w,e=x=>x)=>{let o=0;for(let i=0;i<=c;i++)o+=e((dly(x,l,f,PI**i,e)-x)/(1+c));return x*d+o*w},

dist=(x,a)=>tanh(x*a),
dist2=(x,a)=>atan(x*a),

bc=(x,c)=>(x*c|0)/c,

sqr=x=>sign(sin(x)),
sqr2=x=>(x&1)*2-1,
tri=x=>asin(sin(x))*PI/2,
tri2=x=>abs(x%256-127.5)/64-1,
saw=x=>((x)%1-.5)*2,
saw2=x=>atan(tan(x))/PI*2,
supsaw=(x,c,p)=>{let s=0;for(let i=0;i<c;i++)s+=(x+=524288,saw(x*(1+p/256)**i));return s/c},
pul=(x,p)=>((x&255)<p?255:0)/127-1,
org=x=>(sin(x)+sin(x*2)+sin(x*4)+sin(x*8)+sin(x*16)+sin(x*32)+sin(x*64))/7,
wvb=(x,e)=>(asin(sinc(sinc(x)+cosc(x*6)))*e)/PI*2||0,
nam=x=>(seqparse('G808CEFGFEC842101248CFGFC8410148'[x&31],17)-8)/8,
sinc=x=>((x*64/PI*128+4096)+4096&8191)*(-(x*64/PI*128+4096)+4096&8191)*((((x*64/PI*128+4096)+4096&8192)>>12)-1)/16777215,
cosc=x=>sinc(x-256),
tanc=x=>(_=(x+PI/2)%PI-PI/2,_2=_*_,(_*(105-10*_2))/(105-45*_2+_2*_2)),
TB303=(x,a,t,s,e)=>sin(x%PI*2*a)*env(t,s,e),

wv=x=>sin(x+sin(x*1.005+sin(x*.995))),

x=lr=>rvrb(wv([1.005,.995][lr]*t/1.25/1.5**13*1.5**(ts>>12&7)*seq2('0257',ts>>16,4)),32,[12288,16384][lr],.9,.35,15,x=>bpf(x,.1,.01,.3))*sc(ts,16384,PI)/2+dist(([sin,cos][lr]([1.005,.995][lr]*(ts%16384)**.5)+noi/16)*env2(ts,16384,4),4)/2+sin(16834/(ts%16384)-t/64+lpf(noi,.1,.1)*4)*env2(ts,16384,4)*(ts&16384)/16384/2,

[x(0),x(1)]