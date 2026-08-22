function syn(t,a,f,b,n,o) {
  out = 0;
  O=max(t-o,0);
  for(;n>0;n--) {
    F = n * f * sqrt(1+b*n**2);
    A = a * exp(-1e-4*2*PI*F*O);
    out += A * sin(2*PI*F*t);
  }
  return out;
}

r=[70,73,68,77,68,65,70,73,73,70,65,68,77,68,73,70];

M=n=>n<=0?0:440*2**((n-69)/12);
X=[0];
return (t,s)=>{
  if(t==0)X=[0];
  if(t%1==0)X[0|t%32]=[0.1,M(r[t%16]),.5,7,t];
  return X.map(x=>syn(t,...x)).reduce((a,x)=>a+x);
}