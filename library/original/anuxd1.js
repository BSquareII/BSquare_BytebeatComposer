BPM=95,
SR=48e3,
t?0:r=Array(64).fill(0),
L=0,
T=t*BPM/(SR*60)*8192,
z=(a,c=0)=>r[L]+=(eval("a*t*48e3/SR*2**([7,4,7-(l=T>>12&5),l][t&3]/12+1)"+(c?"&":"%")+"256")/8/(w=(T>>14)==15?1:exp((T/4096%1)**.8)**3)-1/w*16-r[L++])*(.2+.8*((T>>14)==15?1:(T+(1<<14)>>15)==7?(T+(1<<14))/(1<<15)%1:0)),

result=atan(tanh(((z(1)+z(1.01)+z(4/3)+z(4/3+.01)+z(1,1)+z(.99,1)+z(4/3,1)+z(4/3-.01,1))/32*!((T>>14)==15?T>>10+(T>>13&1)&1:0)+((T>>14)==15?0:1)*(cbrt(sin((T/32%128)**.04*500))*((T>>18?0b100001:0b10100110100001)>>(T>>12&15-(h=T>>18&&1)*8)&1)*!(T>>11&1)+(r[8]+=((random()-random())*((1-T/4096%1)**8*4%1)-r[8])*.3)*4*((T>>18?0b1000100:0b10001000100)>>(T>>12&15-h*8)&1)+(random()-random())/2*max(1-T/2048%1*2,0)**3*(T>>16>1))+sign(sin(z=PI*t*48e3/SR/2**("0375"[T>>16&3]/12+9)))*cos(z*3)/2*(0b10110000110011>>(T>>11&15)&1)*(T>>17>1))*2)),

console();

function console() {
	
	const author=["ANoUserXD","BaenHoHoHo"];
	const Title="wlgekelkqisqnsnziqsgignkzwwezl";
	const Remix="gqzkslneiw";
	
	if(!(t&511)){
		throw `\n\n${author[0]} - ${Title}\nRemix of ${Remix} by ${author[1]}\n\nBeats Per Minute: ${BPM}\nSample Rate: ${SR}\nDuration: ${int(t/SR/60%60)}:${int(t/SR%60)}:${int(t/SR*60%60)}`;
	} else {
		return result;
	}

}