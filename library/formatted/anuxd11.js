/*
	squsinsaw (C-compatible version)
	by ANoUserXD

	OG mix: squsinsaw music by _elevate__
	(https://www.reddit.com/r/bytebeat/comments/s7aiep/squsinsaw_music/)
	
	credits: sine-nomath by erlehmann
	(https://github.com/erlehmann/algorithmic-symphonies/blob/master/sine-nomath/)
*/


//1
//distorted sine wave


(

(

t*4*((t>>10&3)==3?3/2:(t>>10&3)==2?6/5:(t>>10&3)==1?9/8:1)*((t>>13&3)==3?4/3:(t>>13&3)==2?3/2:1)
&63

) * (

-t*4*((t>>10&3)==3?3/2:(t>>10&3)==2?6/5:(t>>10&3)==1?9/8:1)*((t>>13&3)==3?4/3:(t>>13&3)==2?3/2:1)
&63

) * (

	(

	t*4*((t>>10&3)==3?3/2:(t>>10&3)==2?6/5:(t>>10&3)==1?9/8:1)*((t>>13&3)==3?4/3:(t>>13&3)==2?3/2:1)
	&64

	)
	/32
	-1

)
/32
+32

) % (

1+(-t>>4&63)

) +


//2
//square wave


(

t*(((t>>10&31)==7|(t>>10&31)==19|(t>>10&31)==27)?2:t>>10&1?0:1+(t>>11&1))*((t>>13&3)==3?4/3:(t>>13&3)==2?3/2:1)&64

) * !!(t>>16&7) +


//3
//sawtooth wave


(

t*2*((t>>8&15)==11?2:(t>>8&15)==10?3/2:(t>>8&15)==9?6/5:(t>>8&15)==8?1:0)&31

) * ((t>>16&7)>1) +


//4
//square wave (kick)


(

131072/((t&4095)+1)&64

) * ((t>>16&7)>1) +


//5
//snare


(

((t*t<<(t>>3)*(t>>2))>>(t|t/3)*(t>>5)&63)

) * 2 / (

1+(t>>8&15)

) * ((t>>16&7)>1&t>>12)

