//functions
decay = (code,speed,bounce) => (code&255)*(-t>>speed&31)**(1+(bounce*PI))/27.13,
tri = pitch => (t*pitch&64?-t*pitch>>2&31:t*pitch>>2&31)*2*PI,
sine = pitch => 128+sin(t*pitch)*64,
noi = (pitch,vol) => t*sin(t*pitch>>13)&vol,
charcodeat = (string,code) => string.charCodeAt(code),
kick = (bounce,sawtooth,square,speed) => (sqrt((t%(2**speed))*bounce)&31)*sawtooth + (sqrt((t%(2**speed))*bounce)&32)*square,
sinkick = (f1,speed,bounce)=>57*f1(sin(sqrt(t%(2**speed))*bounce))*128,
seq = (speed,length,arr) => (arr[length&t>>speed]),
ternary = (var1,var2,var3) => var1?var2:var3,
time = (code,start,end) => code*(start<t)*(end>t),
note_scale = (notes,pitch,length,speed) => 2**(parseInt(notes[length&t>>speed],36)/12)*pitch,
dist = (code,val) => (code&255)*(1+val)&255,
kickdist = (arr,speed,power=4e5,kickspd=[8191,16383][1&t>>15],distmulti=4.94) => power/(t&(kickspd-(distmulti*arr[(t>>speed)%arr.length]))),
noisnr = (pitch,vol) => t*sin(t*pitch>>8)&vol,
this.cde??=0, lpfilter = (code,value) => (cde=(cde*value+(code&255))/(value+1)),

(lpfilter(t*[1,1.2,1.35,1.125][3&t>>ternary(t&16384,3,7)],t>>7&127)//|lpfilter(note_scale('3075',1.33,3,8),3)
+ (note_scale('38B3F38D169B6D1F',0.19*(3&-t>>11),15,13)*t&-t>>7&63)*1.5)/2