s=1,BPM=120*s,sR=44100,r=abs(t/sR/180*3*16384*BPM),

// "Dead Data" Reverb Engine and Infinitely Instantiable 1 Pole Filters by Feeshbread
t||(wsin=(phase)=>(-cos(phase/128*PI)+1)*128-.5,fx=[],dMax=1e5,lpf=lowPassFilter=(a,c)=>(lp_fxii=fxi++,fx[lp_fxii]??=0,fx[lp_fxii]+=(a-fx[lp_fxii])*c),hpf=highPassFilter=(a,c)=>a-lpf(a,c),bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc),hc),dly=multiTabDelay=(audio,heads,dw,fbfn=x=>x)=>{dly_fxii=fxi++;fx[dly_fxii]??=Array(dMax).fill(0);dly_wi	=dt%dMax;dly_feed=audio;dly_out=0;for(let head of heads){dly_ri=(dMax+dt-round(head.t))%dMax;dly_feed+=fx[dly_fxii][dly_ri]*head.fb;dly_out+=fx[dly_fxii][dly_ri]*head.m;}fx[dly_fxii][dly_wi]=fbfn(dly_feed);return audio*(1-dw)+dly_out*dw;}),fxi=0,dt=t,q=(30*sR)/(BPM*2/3),
rvrbHeads=[[{t:1e3+wsin(t/210),m:.5,fb:.15},{t:1e4+wsin(t/250),m:.5,fb:.35},{t:17e3+wsin(t/300),m:.1,fb:.45},{t:37e3+wsin(t/380),m:.1,fb:.65},{t:q*1.005+wsin(t*1.005/256),m:.75,fb:.5}],[{t:11e2-wsin(t/230),m:.5,fb:.15},{t:13e3-wsin(t/270),m:.5,fb:.35},{t:14e3-wsin(t/280),m:.1,fb:.45},{t:4e4-wsin(t/400),m:.1,fb:.65},{t:q*.995-wsin(t*.995/256),m:.75,fb:.5}]],
pan=(a,dw,pt)=>a*(1-min(1,max(0,dw)))+a*min(1,max(0,dw))*abs(pt),

Q=(
sinc=x=>((x*64/PI*128+4096)+4096&8191)*(-(x*64/PI*128+4096)+4096&8191)*((((x*64/PI*128+4096)+4096&8192)>>12)-1)/16777215,
cosc=x=>sinc(x-256),
q=x=>(t*s/sR*256)*421*2**((x[r>>17&1]+6)/12)*PI/256,
tanh(bpf((sinc(q([-31,-27])+cosc(q([-31.05,-27.05]))*1.38)*1.5+cosc(q([-7,-5])+sinc(q([-6.95,-4.95]))*1.38)+sinc(q([-3,-1])+cosc(q([-3.05,-1.05]))*1.38)+cosc(q([0,0])+sinc(q([0.05,0.05]))*1.38)+sinc(q([4,4])+cosc(q([3.95,3.95]))*1.38)),.25,.25)*min(1,abs(sinc(r*PI/16384))*16)/2)*1.38*2.5
),

[pan(dly(Q,rvrbHeads[0],.55,x=>tanh(bpf(x,.01,.8)/200)*100)*min(1,r/8192%2),.55,1-(r>>12&1)),pan(dly(Q,rvrbHeads[1],.55,x=>tanh(bpf(x,.01,.8)/200)*100)*min(1,r/8192%2),.55,-(r>>12&1))]