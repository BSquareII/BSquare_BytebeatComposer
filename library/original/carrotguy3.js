this.X??=0,

pitch=2**(-11/12)*447*256/48e3,n=$=>(2**($/12)),tt=t*pitch,

t||(buffer=[],$a=$b=0,fxi=0,fx=[]), sr=48e3,i=sr/4,bpm=175,

T=t*bpm/60*sr/131072,

p=(1/sr*256)*480,q=(30*sr)/(bpm*2/3),


L=[[0,3,7,10],[0,3,7,10],[-5,-2,2,5],[-2,0,3,7]][T>>16&3],

hexMel=function(hxm,spd){
return '0x'+hxm[(T>>spd)%hxm.length]
},

parse=function(pm,spd,loop){
return parseInt(pm[(T>>spd)%pm.length],36)
},

hs=hexsplit=function(hxm,spd,loop){
return '0x'+hxm.split('-')[(T>>spd)%loop]
},

ps=parsesplit=function(pm,spd,loop){
return parseInt(pm.split('-')[(T>>spd)%loop],36)
},

//Credits to Priscilla

inte=interpolation=function(mel){
return $a+=$b+=(n(mel)-$b)/256
},
cc=0,
lp=lopass=function(inp,freq){
call=cc++;
buffer[call]??=0,
buffer[call]+=((inp)-buffer[call])*freq
return buffer[call]
},

hp=hipass=function(inp,freq){
return inp-lp((inp),freq)},

bp=banpass=function(inp,hf,lf){
return hp(lp(inp,hf),lf)
},

//6th Wave 2-pole Filters
lp2=lopass2p=function(inp,freq){
return lp(lp(inp,freq),freq)
},

hp2=hipass2p=function(inp,freq){
return hp(hp(inp,freq),freq)
},

lpr=lopassResonance=function(inp,freq,res){(
call=cc++,
t||(buffer[call+'lp6']=0,buffer[call+'lp12']=0),
ct=min(freq,.999),
r=res+res/(1-ct),
buffer[call+'lp6']+=ct*(inp-buffer[call+'lp6']+r*(buffer[call+'lp6']-buffer[call+'lp12']))),
	buffer[call+'lp12']+=ct*(buffer[call+'lp6']-buffer[call+'lp12']
)

return buffer[call+'lp12']
},

hpr=hipassResonance=function(inp,freq,res){
return inp-lpr(inp,freq,res)
},

bpr=banpassResonance=function(inp,lf,hf,res){
return hpr(lpr(inp,lf,res),hf,res)
},

lpr2=lp2pr=function(inp,freq,res){
return lpr(lpr(inp,freq,res),freq,res)
},

hpr2=hp2pr=function(inp,freq,res){
return hpr(hpr(inp,freq,res),freq,res)
},

N=noise=function(c){
		ni=fxi++,
		fx[ni]??=0,
		fx[ni]=fx[ni]+(random()-.5-fx[ni])*c
		return fx[ni]},

//Waveforms

sqr=square=function(inp){
return ((inp%256/127-1)<0)-.5
},

pwm=function(inp,pwm){
return (inp%256/127-1)<(pwm/100)
},

si=sine=function(inp,hz){
return sin(inp*PI/hz)
},


tri=triangle=function(inp,hz){
return asin(sin(inp*PI/hz))/1.565
},


fm=freqModulator=function(inp,hz,freq){
return sin(freq*sin(inp*PI/hz))
},

syn=synthesizer=function(voices,mel){
a=b=>{
let out=0;for(x=0;x<voices;x++){

out+=(L=[0,3,7,10],
	I=6,
	(e=(t+(sr**2))/(sr/8e3)/((2048%(sr+x))+(x*3))*(i*1.024),
	e*mel%256/8

))

}return out/256-.75
}
return a()
},

kd=kickDrum=function(spd,i){
return i*cbrt(T%spd)
},

nd=noiseDrum=function(t,freq){
return (t%(freq)?R:R=random())
},

ec=echo=function(inp,out){
return (X++||(e=Array(inp).fill(0)),
	  			  a=(out%256)+e[t%(inp/2)],
	  			  e[t%(inp/2)]=a/Math.PI*2,
	  			  a/2)
},

sch=sidechain=function(spd,ramp){
return (T/spd%1)**ramp
},

dec=decay=function(spd,ramp){
return (1-T/spd%1)**ramp
},

cl=clamp=function(inp,mode="hard"){
return (mode=="hard"?min(max(inp%256,0),255):mode)
},

$d=detune=function(i,detune){
return n(i+((detune)/100))
},

chrd=t=>L.map(chrd=>pwm(t*n(chrd),35)%256).reduce((a,b)=>a+b)/2,


//Song test v2
hp(((hp(nd(t,9),.005)*dec(8192,3)+
lp(abs(1&kd(8192,2))-.5,.5)*dec(8192,3)*('10000100'[T>>13&7])*2+
echo(12288,hp2(sqr(tt*$d(parse('CJHF E EE A E A ',13),12)),.05)/1)+
chrd(tt)/4*((sin(t/44100))+2))/4-.75+
(hp2(sqr(tt/2*$d(parse('C  C E EE A E A ',13),12)),.05)/8)+bp(N(2)*dec(8192,3),.3,.7)),.001)