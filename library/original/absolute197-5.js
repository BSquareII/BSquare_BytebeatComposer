t /= 1.25,
t2=t/44100,
p=1.05946309,

//notes
a=14080,
as=a*p,
b=as*p,
c=b*p,
cs=c*p,
d=cs*p,
ds=d*p,
e=ds*p,
f=e*p,
fs=f*p,
g=fs*p,
gs=g*p,
saw=function(n){return (t2*n)&63;},
sqr=function(n){return (t2*n)&64;},
sine=function(n){return 32*sin((t2*n)/10.25)+32;},

arpch=
[
c,e,g,
c,e,g,
c,e,g,
c,e,g,
a,f,g,
a,f,g,
a,f,g,
a,f,g,
a,c,e,
a,c,e,
a,c,e,
a,c,e,
g/2,a,c,
g/2,a,c,
g/2,a,c,
g/2,a,c],

bs=[a/2,c/2,[e,f][t>>18&1]/2,g/2],

((((saw(arpch[(t>>12)%48])+ 
(saw(arpch[(t>>12)%48]+96)))*4.2+
sine(bs[t>>15&3])+
sqr([a,c,eval('defg'[t>>16&3])][t>>12&3]*4)*2.2)/1.7+

(sqrt(t&16383)*32&64)*2.9+
(1e5/(t&4095)**3*1e6&127)*1.5)/3+

(sin(int(t/'25'[t>>15&1]))*t&128)*(-t>>9&31)/32*(1&t>>14)/3)/2  