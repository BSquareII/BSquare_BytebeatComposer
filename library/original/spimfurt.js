(
//sd seq backwards
((0b00010000000100000001000000010000>>(t>>14)&1)*
(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin
//sd freq chartacter
(t/3))*5+(t/12.4))+
(t/2.4))+(t/4.3))*3+
(t/14))+
(t/55))*2+
(t/20)))
//sd envelope
/(5+(t&16383)/109)*8)

+
//bd
((0b010001010001000010000000110000001>>(t>>14)&1)*(Math.sin(Math.sin(Math.sin(Math.sin
(t/100))*2+
(8000/(250+(t&16383)))+ //bd pitch down envelope 
(t/280))))
/(3+(t&16383)/100)*3)

+
//hihat closed
((0b01110101010101010101010110110101>>(t>>12)&1)*(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin
(t/1.3))+
(t/40000))/3+
(t/3))+
(t/1))+
(t/8))+
(t/13))+
(t/0.412)))   
/(5+(t&4095)/(140+((t>>13&3)*-35))))*8 //envelope variator 0-3)

+
//guitar, overcomplicated. constant for C at the 48000Hz is about t*1.395
((Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin
(t/32*Math.pow(2,(t>>17&15)/12)*1.395*Math.pow(2,0.01/12)))+
(t/32*Math.pow(2,(t>>17&15)/12)*1.395*Math.pow(2,4.02/12)))+
(t/32*Math.pow(2,(t>>17&15)/12)*1.395*Math.pow(2,2.01/12)))+
(t/32*Math.pow(2,(t>>17&15)/12)*1.395*Math.pow(2,2.08/12)))+ 
(t/32*Math.pow(2,(t>>17&15)/12)*1.395*Math.pow(2,-12.00/12)))*2+(110000/(t>>3&16383)/20)+ //envelope of the overdrive
(t/32*Math.pow(2,(t>>17&15)/12)*1.395*Math.pow(2,-5/12)))*2+
(t/32*Math.pow(2,(t>>17&15)/12)*1.395*Math.pow(2,-5.00/12)))*2+
(t/32*Math.pow(2,(t>>17&15)/12)*1.395*Math.pow(2,-24.01/12))))
/(3+(t>>3&16383)/800))

+
((0b110000000000000000000000000001111>>(t>>14)&1)*(Math.sin(Math.sin(Math.sin(Math.sin(Math.sin(
(t/2.3))+
(t/5.7))+
(t/4.3))*9+
(t/18000))/(1+(t>>2&16383)/800)*8+ //amplitude down envelope
(0))/
(1+(t>>2&16383)/3050))/3)


)/5