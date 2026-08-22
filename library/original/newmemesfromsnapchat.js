//FLANGED reverb by NEWMEMESFROMSNAPCHAT

//for volume change variable
t||(v=Z=0),

//for reverb
t||(z=Array(mz=12345).fill(),
A=Array(x=round(4096*3.3333)).fill(),
S=Array(s=round(4096*3.3333)).fill()),

//volume change variable
C=(a, s)=>(v=min(1-t/128/a%1,v+1/s)),
c=(a, s) =>(Z=min(1-t/128/a%1,Z+1/s)),

//instrument
acidsine=(g,a, b, s)=>sin(min(min(a/s,256*2), g*t%256)/min(a,256*2)*PI*b*s),

//reverb instrument
z[t%mz]=acidsine(2**((t>>15^t>>13)%11%9%7/4+1/12)/2,-c(64,48**2)*256+128*2,2,exp(sin(t/128/128/2)*2)+1)/2*C(64, 32**2)+(z[t%mz]||0)/2,

//reverb channels
A[t%x]=(z[t%mz])+(A[round(t+t/506)%x]||0)/2, 
S[t%s]=z[t%mz]+(S[round(t-t/506)%s]||0)/2, 

//final
[S[t%s],A[t%x]]