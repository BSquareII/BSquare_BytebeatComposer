num=128*(131072<t), // drum decay
(sin(.997**(t&16383)*num/2)/3+sin(.9964**(t&16383)*num/3)/3+cos(sin(.99762**(t&16383)*num/1.5)+ // kick waveform shaper
5*cos(.999395**(t<<'0000000000001123'[15&t>>13]&16383)*num/4))/4)/1.3 // main kick
-.2+2*sin(
14/ // amount of snare??
sin(sin(sin(sin(t/33.8))+(t/24.3))+(t/23.3)*1.1+.78*(t/73))+(t/33))/
(3+(t>>1&16383)/num)*(262144<t) // decay
+sin(sin(sin(sin(sin(sin(sin(t/10.8))+.94*(t/9.4))+1.094*(t/8.93))+.7*(t/8.2)+.5*(t/7.22))+(t/4.3))+(t/.94)) // bell hihat
/(3+(t<<[0,0,0,0,0,0,0,1][7&t>>12]&8191)/(num/PI)) // decay
+((tan(sin(t/8*pow(2,(t>>15&3)/12)))+tan(sin(t/8*pow(2,(t>>15&3)/12)))) // cowbell
.toString(6) // used .toString() for more realism
/4)/(9+((t<<min(-t>>13&(7-(1&t>>13|(3+(1&t>>15)))),(1&t>>15)+1) // used min() function to prevent the decay from going above certain decay speed
+8192)&16383)/33)*13+ // decay 
random()*(-t>>8&127)*(131072<t)*((131072+32768)>t)/128+ // little random() snare for when the beat starts
((sin(sin(sin(t/69.4*(d=(1+(.06*(1&t>>15))+(.125*(1&t>>15)*(1&t>>16)))*1.6))+cos(1.7*sin(t/54*d)*sin((t/33*d)+cos(.5-sin(t/20*d))+(t/44.3*d))+sin(t/9.5*d))/(5+((t+8192)&16383)/400)*12))/3))*(131072<t) //interesting bass 