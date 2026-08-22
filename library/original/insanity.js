t||(fx=[]),

fxi=0,
tri = time => asin(sin(time*PI/128))/PI,

lpf=(a,c)=>(fxi++,fx[fxi]??=0,fx[fxi]+=(a-fx[fxi])*c),
hpf=(a,c)=>a-lpf(a,c),
bpf=(a,h,l)=>lpf(hpf(a,h),l),


seq=(arr,speed,parse,len)=>parse?parseInt(arr[(t/2**speed|0)%(len??arr.length)],36):arr[(t/2**speed|0)%(len??arr.length)],


// reverb (DDR)
wsin=p=>(-cos(p/128*PI)+1)*128-.5,
dm=1e6,
dt=t,
rv=(a,s,T,r=a=>hpf(a,.02))=>{fxi++,fx[fxi]??=Array(dm).fill(0),wi=dt%dm,fe=a,ou=0;for(var {t,f,m} of s)ri=(dm+dt-round(t))%dm,fe+=fx[fxi][ri]*f,ou+=fx[fxi][ri]*m;return fx[fxi][wi]=r(fe),a*(1-T)+
ou*T},
rvHeads = [
[{t: 23e3+wsin(t/390), f: .3, m: .4},
{t: 19e3+wsin(t/680), f: .4, m: .5},
{t: 2e4+wsin(t/390), f: .2, m: .4},
{t: 24e3+wsin(t/190), f: .5, m: .3},
{t: 15e3+wsin(t/280), f: .3, m: .3}],
[{t: 18e3+wsin(t/390), f: .3, m: .3},
{t: 17e3+wsin(t/480), f: .2, m: .2},
{t: 24e3+wsin(t/700), f: .4, m: .3},
{t: 3e4+wsin(t/290), f: .3, m: .2},
{t: 22e3+wsin(t/380), f: .4, m: .3}]
],


delay=(input,length,feedback,volume)=>(
	fxi++,
	fx[fxi]??=Array(length).fill(0),
	output=input+fx[fxi][t%length],
	fx[fxi][t%length]=output*feedback,
	input+((output-input)*volume)
),

envelope=(attack,decay,hold=0)=>((ti=(t%(attack+decay+hold)))>(attack+hold)?max(0,1-(ti-attack-hold)/decay):min(1,ti/attack)),


ms=i=>rv(bpf(delay(delay(delay(tri(t/1.2*2**(seq("07CJMQTX",14,1)/12))*(envelope(2048,4096,10240)**.8+.3),8192,.4,1.2),12282,.4,1)/1.3,16384,.4,.7),.03,.9)+bpf(random(),.003,.1)*1.9*sin(t/2**17)**4,rvHeads[i],.5,x=>bpf(x,.01,.4)*1.01),
[ms(0),ms(1)]