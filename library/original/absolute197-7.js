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
// you can use halfsine.reg() or halfsine.exp() if this confuses you.
halfsine = {reg: pitch => abs(sin(t/32*pitch))*16, exp: pitch => 8*exp(sin(t/16*pitch))},
triangle = {reg: pitch => asin(sin(t/64*pitch))+64, half: pitch => tan(sin(t/64*pitch))+64},
mix = (l,r) => (l&255)/2+(r&255)/2,
notemix = (l,r,lspd,rspd) => (t*2**(l[(t>>lspd)%l.length]/12)/2&127)+((t*2**(r[(t>>rspd)%r.length])/12)/2&127),

notemix([8,5,3,,0,6,,3,],[3,,0,-2,,-5],12,11)