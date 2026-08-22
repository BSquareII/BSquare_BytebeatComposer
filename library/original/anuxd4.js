//https://youtu.be/V4GfkFbDojc?t=450&si=qKid3yeIMoswOdPj

t?0:x=[],X=0,t2=t,

ec=(a,b=12288,c=.42,d=.73,e=.79)=>(

f=X++,
t?0:x[f]=Array(b).fill(0),
a=a*c+x[f][t2%b]*d,
x[f][t2%b]=a*e,
a

),

t/=4,

kc=[0,3][t>>17&1],

p=(x,y=0,z=0)=>2**((x+y+z/100)/12-2)*t,

d=p([28,31,25,35][t>>12&3],kc)*465/(43+6*(t>>15&3^1)),
D=((d/4&t>>6)+d/2&127)+(d/6&127),

[ec(D),ec(D,24576)]