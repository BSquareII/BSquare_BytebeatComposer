// ENTIRE SONG MADE WITH pulse() FUNCTION - DARK JUNGLE

// Caption: "You are walking into a haunted jungle among frozen trees and leaves. It seems like someone is watching you through the darkness..."

T=t/1.3,x=function(j){return (pulse=function(note,width){return ((a=t/j/128*2**(note/12)%256,(a^a+width))&2)?255:0},pulsetone=function(hz,width){return ((a=t/j*(hz/128/125),(a^a+width))&2)?255:0},c=T=>pulse([0,4,7,11][3&T>>13]-'0363'[3&T>>17],sin(T/262144*PI))*(1-T%8192/1E4)%256/6, // synth

g=pulse(-'0363'[T>>17&3]-24,.5+.25*sin(T/131072*PI))/4, // bass

z=38*(t/j/64*2**(([0,4,7,11][T>>11&3]-'0363'[T>>17&3])/12)&1)*(1-T%65536/1E5), // arppegiator thing

kickhat=function(s,l,x,p){return (s/(T%l)&255)+90*random()*!(-T>>x&1)*(1-T%p/p)},

snare=function(s,l,x){return 30*sin((t>>s)**3)*!(-T>>l&1)*(1-T%x/x)},

d=(c(T)+c(T-(f=12288))/2+c(T-f*2)/3+c(T-f*3)/4+c(T-f*4)/5+c(T-f*5)/6+c(T-f*6)/7+c(T-f*7)/8), // echoed synth

((T<=8388608+524288*3?d:400*abs(sin((A='GAME OVER. YOU FAILED TO ESCAPE. ',A.charCodeAt((T/j*t>>6)%A.length)))))+(T<=8388608+524288*2?T>524288?g:0:0)+(T<=8388608+524288?T>=1048576?z:0:0)+(T<=8388608?T>=2097152?(kickhat(3E5,1&T>>20?32768:16384,1&T>>21?12:13,1&T>>20?16384:8193)/3+snare(3,1&T>>20?15:14,1&T>>20?32768:16384)):0:0))/1.5+32)},[x(1.005),x(.995)]