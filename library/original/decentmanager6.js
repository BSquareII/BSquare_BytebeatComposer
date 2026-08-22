// What you're seeing is feeshbread's Dead Data Reverb
t||(wsin=(phase)=>(-cos(phase/128*PI)+1)*128-.5,fx=[],dMax=1e6,lpf=lowPassFilter=(a,c)=>(lp_fxii=fxi++,fx[lp_fxii]??=0,fx[lp_fxii]+=(a-fx[lp_fxii])*c),hpf=highPassFilter=(a,c)=>a-lpf(a,c),bpf=bandPassFilter=(a,hc,lc)=>hpf(lpf(a,lc),hc),dly=multiTabDelay=(audio,heads,dw,fbfn=x=>x)=>{dly_fxii=fxi++;fx[dly_fxii]??=Array(dMax).fill(0);dly_wi	=dt%dMax;dly_feed=audio;dly_out=0;for(let head of heads){dly_ri=(dMax+dt-round(head.t))%dMax;dly_feed+=fx[dly_fxii][dly_ri]*head.fb;dly_out+=fx[dly_fxii][dly_ri]*head.m;}fx[dly_fxii][dly_wi]=fbfn(dly_feed);return audio*(1-dw)+dly_out*dw;}),fxi=0,dt=t,rvrbHeads=[[{t:4096+wsin(t/100),m:.5,fb:.15},{t:8192+wsin(t/250),m:.5,fb:.35},{t:12288+wsin(t/300),m:.1,fb:.45},{t:16384+wsin(t/380),m:.1,fb:.65}],[{t:4e3+wsin(t/230),m:.5,fb:.15},{t:8e3+wsin(t/270),m:.5,fb:.35},{t:12e3+wsin(t/280),m:.1,fb:.45},{t:16e3+wsin(t/200),m:.1,fb:.65}]],

Q=(

// Vibrato
Rate = 2000, // How fast/slow it can pulsating
Amount = 20, // How much it can vibrate
vi = sin(t / Rate) * Amount, // 'vi' as Vibrato
[a,b,c,d]=[[0,4,5,5],[4,8,9,8],[7,11,12,12],[11,14,16,14]], // This function i learned from PortablePorcelain

A=K=>((t+vi)*2**(K[t>>16&3]/12)%256/700)-.19,(A(a)+A(b)+A(c)+A(d))*['111010101010'[(t>>11)%12],'11101010101011101010101010101010'[t>>11&31]][t>>19&1]*min(1,[1,(t+32768)/32768%2][t>>19&1])

)*2.5,

[dly(Q,rvrbHeads[0],.55,x=>tanh(bpf(x,.01,.5)/200)*100),dly(Q,rvrbHeads[1],.55,x=>tanh(bpf(x,.01,.5)/150)*100)]