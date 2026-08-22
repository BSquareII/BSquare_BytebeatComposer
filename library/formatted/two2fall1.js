/* UNDERWORLD BY TWO2FALL */
/* A remake of my bytebattle entry Underworld, but with more effects! */
/* 22-11-2025 Twell Evans */

/* VARIABLES */
/* Do not touch this! This contains shortcuts and some important constants */
!t?(g=1.5,Z=min,Y=.5,q=14,$=1.3,f=-5,y=10,Q=12,P=256,O=128,F=max,j=16384,i=2*j,X=3*j,V=X/2*3,D=X*2,v=64,T=tanh,z=abs,C=cos,c=cbrt,s=sin,u=i/2,I=0,U=PI,bt=(i,l)=>(i*l|0)/l,B=x=>z(s(x)),M=[f,-3,0,2,f,-3,0,-3,f,-3,0,2,f,-2,0,f,-7,f,-3,0,-7,f,-3,2,-7,f,-3,4,-7,f,-3,5],M2=[q,Q,y,9,q,Q,y,7,q,Q,y,5,q,Q,y,4],A=[[f,-7,-9,-7],[2,0,-2,0],[7,5,3,5]])

/* SOUND */
/* This bunch of code makes the song sound, also do not touch this if you don't know! */

:(
R=random(),L=t*U, // These two variables are for the song sound
E=(l,x,T=t)=>(1-T/l%1)**x, // This creates a envelope
G=p=>t*2**(p/Q), // This creates a signal multiplied by t that its note is p 

// FM waves
W=l=>v*T(s(s(l*U/P)*$+l*U/O+C(l*U/v)*2+T(s(l*U/16)))),
W2=u=>O*T(s(s(u*U/O)*$+C(u*U/v)+z(s(u*U/32))+1.2*z(C(u*U/P)))),

// Melodies
m=t=>(W(G(M[31&t>>q])*2)*E(u,Y,t)), 
m2=t=>(W2(G(M2[15&t>>q]))/2*E(u,3,t)),
m2=m2(t)+(m2(t-X)/2)+(m2(t-V)/3)+(m2(t-D)/4),
m=m(t)+(m(t-X)/2)+(m(t-V)/3)+(m(t-D)/4),

// Bass
a=t=>Z(F((_=N=>W2(G(A[N][3&t>>18])/2)%P/3)(0)+_(1)+_(2)-v),v-1),
h=a(t),

// Percussions
K=P*c(T(s((t%(t&i?i:X))**Y)))*E(t&i?i:X,3), // kick
S=((t*s(t>>3)&O)*E(i,7)*(1&t>>15))*8, // snare
H=v*c(T(s(R*E(u,7)))), // hats

// Master
O2=(Z(F([h,h+m,h+m+K,h+m+K+S+H,2*h+K+S+H,h+g*m2,h+g*m2
+K,2*h+(2*m2)+K+S+H,2*h+2*m2+K+S+H,m2+h,m+Y*h,h]
[t>>20]+R,-O),O-1)||0),

// And finally, some distortion effects
O3=((t>>2&127+t>>19)>>9&1?
O2:1)-(I+=(O2-I)*B(L/i/v)/2),[T(O3/
v),T(O3/96)].map(x=>bt(x*O%P/O,
(t>>9&7)+(t>>9&t>>12&127)*8)*P/g|t>>12&7||
0).map(x=>T(x/O)*O))