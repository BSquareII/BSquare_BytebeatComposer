// "Quasars Of Destiny"
//
// Created by UltraDasher965/Practical_Bad4252/hexafluorine
//
// Remix of "Funky Stars" by Quazar of Sanxion (hence the name)
//
// Note: This is easily the best and biggest bytebeat I've ever done in a while, weighing over 2500 chars (1446 chars without the comments). I've spent 2 days making this bytebeat and honestly this time was worth it.
//
// also this one was laggy in the dollchan editor so i had to use kimapr's player

// Reverb effect
e=x=>(t?0:a=Array(r=12288).fill(0),b=x+a[t%r],a[t%r]=b/2,b),
// Clipping effect using the arctangent and the hyperbolic tangent
clip=z=>atan(tanh(z))*128,
// Melodies
m='C J MOC J Q R K C K KJF H J MOC ',
m2='CF7EJH8A',
m3='7A37CA57',
// Some important defines for the song (for optimization, of course)
u=7&t>>16,
A=8192,
// Start events (for each 8 bars, which is measured by 2**19 (simplified version of 524288))
s1=t>(sn=2**19),
s2=t>(sn*2),
s3=t>(sn*3),
s4=t>(sn*4),
s5=t>(sn*5),
s6=t>(sn*6),
s7=t>(sn*7),
s8=t>(sn*9),
// End events
e1=t<(sn*4),
e2=t<(sn*6),
e3=t<(sn*8),
e4=t<(sn*9),
e5=t<(sn*10),
// Risers
rise1=(ns=atan(tanh(sin((random()-random())/(1-t%sn/sn)/25))))*s3*e1/5,
rise2=ns*s5*e2/5,
rise3=ns*s7*e3/5,
// Main melody
// Note: "t+((sin(t>>13)*5)*cbrt(sin(t/327680))*sin(t*PI/2))" is used to make somewhat a glitch effect.
p=q=>e((sin((t+((sin(t>>13)*5)*cbrt(sin(t/327680))*sin(t*PI/2)))*PI/q*2**(parseInt(m[31&(t>>12^((3&(t>>14)>>(1&(t>>15)))*s4*e3))],36)/12)||0)*(1-t%4096/A)/3)*min(1,t/sn)),
// Intro chords (from bar 9 to bar 33)
f=g=>((t*g/5.8*2**(parseInt(m2[u],36)/12))&128)/600,
h=i=>((t*i/5.8*2**(parseInt(m3[u],36)/12))&255)/1200,
// Sine melody
sinmel=asin(sin(t*(1+(3&t>>13))/29*2**(parseInt(m2[u],36)/12)))*(1-t%A/A)/4,
// The pulse (for the drop)
pulse=((((t/0.69>>3)&128)-((t/0.7>>1)&128))&255)*(1-t%(n=A/'21232125'[7&t>>14])/n)/192,
// Some drum material (didn't include the kick as it didn't work for me)
snare=(((t*sin(t/1.75>>(3+(3&t>>11))))&255)-((t*sin(t>>(4+(3&t>>11))))&255))/256*(1-t%A/A)*(1&t>>14)*(1&-t>>13)*s5,
hat=(random()-random())*(1&t>>13)*(1-t%A/A)/4,
// the main song
j=k=>((p(45*k)-asin(p(90*k))+((p(67.5*k)*s3*e1)))+((((f(1*k)+f(1.01*k))*s1)-((h(4*k)+h(2.02*k))*s2)+((f(3.01*k)-f(1.51*k))*s3))*e1)+((rise1+(sin(10000*cbrt(t%16384)**.02)*s4*(1-t%A/A)*(1&-t>>13))+(sin(t*PI/360)/(4E4/(t%16384))*s4)+(pulse*s4)+rise2+e(sinmel*s6*e3)+((f(3.01*k)-f(1.51*k))*s7*e3)+rise3+snare)*e4)+(hat*s5))*(1+(s8*(1-t%sn/(sn/3))/2))*e5,
// And finally, the precujsqaloxlwoq- precious stereo material (0.001 pitch in between)
[clip(j(1.001)),clip(j(.999))]