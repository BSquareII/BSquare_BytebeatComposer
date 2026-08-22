dsp=0,n=i=>1.09*2**(i/12),p=(j,w)=>(j|j+w)&128,s=d=>max(min((((sqrt(t&8191)*26)&128)-64)*(t&4096?0:-t>>4&255)/50*(K='1  1 11 1    1 1'[l=t>>13&15])+(((sqrt((t&8191)*19000)+random()*90)&128)-64)*(-t>>5&255)*(S='    1    1  1   '[l])/120+((random()-.5)*((t>>11&3)==0?-t>>5&63:0)*1.8+((c=(t*d*n([(aA=[0,3,7,10])[u=t/2&3],(aB=[3,7,10,15])[u],(aC=[[0,5,8,12],[-2,2,5,10]][(z=t>>16&1)])[u],(aD=[0,3,7,10])[u],aC[u],(aE=[-4,0,3,7])[u],aC[u],aA[u]][a=t>>17&7])&128)-64)*(-t/3>>5&(v=256)-1)/v+c%v*(-t>>6&v-1)/v)/3+p(t*n([7,7,10,10,12,12,7,7,10,10,7,,,,,,10,10,12,12,5,5,7,10,7,7,12,,,,,,5,5,5,7,10,10,7,5,7,5,0,,,,,,5,5,5,7,10,10,7,5,7,5,0,,,,,,][t>>14&63]),sin(t*PI/2**19)*100)/3+(p(t*n([0,0,3,3,-4,-2,0,0,-4,-2,-4,-4,-4,-2,0,0][t>>16&15])>>2,20))/1.3-71+round(asin(sin(t*PI/2**6*n([aA[A2=t>>13&3],aB[A2],aC[A2],aD[A2],aC[A2],aE[A2],aC[A2],aA[A2]][a])))*4)*(t>>8&255)/60)*(min(K+S,1)==1?t>>5&255:255)/256,127),-127),m=[s(.995),s(1.005)],info = function(length) {
var lyrics = [
'Urmanda ğına yuldar ütä tütä',
'Yawğa kite başqort irðäre. Kem? Hay!',
'Nuğaybäk, hay, lim zilär, Nuğaybäk, ',
'Nuğaybäk, hay, lim zilär, äy häylük.',
'Yawıð doşmandarğa qarşı bara', 
'Haqlar ösön tıwğan ildären. Kem? Hay!',
'Nuğaybäk, hay, lim zilär, äy häylük',
'Nuğaybäk, hay, lim zilär, äy häylük.'
][t>>18&7]
throw lyrics
},
dsp>0||(t/512%1%1)?m:info()