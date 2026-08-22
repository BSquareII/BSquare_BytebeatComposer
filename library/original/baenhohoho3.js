var beatsPerMinute = 100

const DCOffset = true

_E=F=0 //dc offset setup

_S=_T=0
// filter setup
const T = beatsPerMinute/60

function DCOffsetFunction( code ) 
 { 
 return _E += (
  C = code - _E * ( DCOffset && 1 )
)/ 128 ,
 F += C - F ;
}
function drumMachineFunction( array , t , speed, volume = 1 )
 { var $ = 4 * t * speed % 1 ;
 switch( array.charAt( 4 * t * speed % array.length | 0) ){

 case 'B': return Math.tanh( 4* Math.sin (
 128 * Math.sqrt( $ / speed / T ) +  Math.random() * ( 1 - $ ) ** 14 
 ) *
 ( 1 - $ ) ** 2 
) * 1.06 ** volume
case 'I': return ( Math.random() -.5 ) * ( 1 - $ ) ** 3 * 1.06 ** volume
 case 'W': return (_S += _T += 1.5* ( Math.random() - .5 ) * (1 - $ ) ** .6 * 1.06 ** volume - _S / 16 - _T  /4 ) / 4
}
}//from WoolWL
 waveforms = 
 { sawtoothWave( x )
{ return x % 1 / 2}}
return t=>
DCOffsetFunction( 
 drumMachineFunction( 
 'BIBIWIBIIBIBWIBI',t*T,1)
+256 * t /1.06 ** ( 1+( t*T&15^6 ) ) *1.75%1*(1-t*T%1)**.5+ 
 256*t*1.06**(1+(t*T/2&7^1))*1.04/4%1) / 2