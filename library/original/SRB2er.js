/*
 want a byte of my food?
 32khz
 
 by SRB2er



 hey there
 thanks for viewing this :)

 enjoy music and (terrible) comments
*/
l1HOLD=false,
l2HOLD=false,
note = function(n) {
 return pow(2,n/12)
},
randomInt = function(max) {
  return floor(random() * max);
},
lead1Null=function() {
 (ticks<128 & ticks>512 ? 0 // why do dis when the lead no happen
:(lead1Table[int(1+(ticks/2)%8)] ==null ? l1HOLD=true: l1HOLD=false))
},
lead2Null=function() {
 (ticks<512 & ticks>1024 ? 0 // why do dis when the lead no happen part 2
:(lead2Table[int(1+(ticks/2)%8)] ==null ? l2HOLD=true: l2HOLD=false))
},
//if you are wondering why the percussion are functions... since we r gonna use the same percussion often, doing this allows us to change all percussion at once!! yay!
kick=function() {
((ticks>64 & (ticks%16>=0 & ticks%16<2) ? k=((round((nKick)*64)&(1)))*(18-(ticks%8)*4) : k=0))
return k;
},
snare=function() {
 ((ticks>128 & (ticks%16>=8 & ticks%16<10) ? s=((round((nSnare)*64)&(1)))*(20-(ticks%8)*2) : 
(ticks>128 & (ticks%64>=62 & ticks%64<63.75) ? s=((round((nSnare)*64)&(1)))*(20-((ticks+2)%16)*2) //syncopated snare
: s=0)))
return s;
},
hihat=function() {
(((ticks*2)%4<=1 & ticks>64)? h=((round(random()*64)&(1)))*(16-((ticks*2)%4)*7):h=0)
return h;
},
spd=2400,
ticks=t/spd,
keyC=0, //keychange variable :))))
bassFreq=[
[12,15,12,19,12,17,10,21], // bass 1
[ 7,19, 7,19,14,21,14,26], // bass 2
[11,11,18,18,14,14,19,19] // bass 3
],
arpTable = [
[12,17,19],[15,17,21],[12,17,19],[15,18,21], //arps 1
[21,14,19],[14,19,23],[21,14,19],
[19,22,26], //arps 2
[23,26,29],[18,23,26],
],
lead1Table=[
24,24,24,24,24,24,24,24,
29,29,29,29,22,22,22,22,
22,22,22,22,19,19,19,19,
19,19,19,19,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,23,
24,24,24,24,24,24,24,24,
29,29,29,29,22,22,22,22,
22,22,22,22,30,31,31,31,
31,31,31,31,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ],//yes, there are several of the same notes. yes, i am lazy to make proper held notes. yes, there are arranged in 8s. yes, null entries are "note off"

lead2Table=[
22,22,22,22,22,22,34,34,
34,34,34,34,26,26,26,26,
26,26,26,26,29,29,29,29,
29,29,29,29,29,29,29,29,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
22,22,22,22,22,22,34,34,
34,34,34,34,26,26,26,26,
26,26,26,26,27,27,27,27,
22,22,22,22,22,22,22,22,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  ,
  ,  ,  ,  ,  ,  ,  ,  
],

lead3Table=[
23,23,18,18,
23,23,24,24,
23,23,18,18,
21,21,21,21,
23,23,18,18,
23,23,24,24,
16,16,16,16,
16,16,16,16
],
t%3==0 ? nSnare=random() : 0,
t%12==0 ? nKick=random() : 0, //so yknow how we r running at 32khz? ye so cuz of that random() gets reset stupid often, so instead every couple frames we save it's current value, so when we use this value, it'll update less often!!!! makes noise better
lead1Null(),
lead2Null(),
//key change
(ticks>896 & ticks<1024? keyC=2:0),
(ticks>1024? keyC=0:0),
  //====== SECTION 1 & 3 ======\\
//filler
(
ticks<512 | (ticks>768 & ticks<1024)?
//bass 1
(ticks<64 ? ((sin((t/256)*note((bassFreq[0][int((1+ticks/4)%8)]+keyC)) ))-1&(ticks-(ticks%4)*(ticks/8))) : ((sin((t/256)
* note((bassFreq[0][int((1+ticks/4)%8)]+keyC)) )-1)&(64-(ticks%4)*8))) + //thank blast brothers for the sin square thing :)))

// arp 1
//(ticks> 8 ? ((sin((t/32)*note((arpTable[int((ticks/16)%4)][int((1+ticks*2.5)%2)]+keyC)) -1))&(28-(ticks%8)*3)) : 0) +
//arp 1 real
(ticks>=128 ?
((sin((t/32)*note((arpTable[int((ticks/16)%4)][int((1+ticks*2.5)%2)]+keyC)) )-1)&(24-(ticks%8)*2)):0) +
//lead 1
((ticks>256 & ticks<896)& l1HOLD==false ?((sin((t/32)*note((lead1Table[int((ticks)%128)]+keyC)) )-1)&(24)): 0)+

//NES ah hihat
hihat() +
//Kick
(kick())+
//Snare

snare()

    //====== SECTION 2 ======\\
: ((ticks>512 & ticks<1024)  ?
//bass 2
((sin((t/256)
* note((bassFreq[1][int((1+ticks/4)%8)])) )-1)&(64-(ticks%4)*8)) + 
//arp 2
(((sin((t/32)*note((arpTable[int((ticks/32)%4)+4][int((1+ticks*2.5)%2)]+keyC)) )-1)&(24-(ticks%8)*2))) +
//lead 2
( l2HOLD==false?
((sin((t/32)*note((lead2Table[int((ticks)%128)]+keyC)) )-1)&(24)) :0)+
//NES ah hihat
hihat()+
//kick
kick()+
//Snare
snare()
:
   //====== SECTION 4 ======\\
((ticks>1024 & ticks<1664)? 
//pwm ah bass
//basically, we make a regular bass pattern like section 1,2 &3 but then we also add a copy with the difference its offset by a slight amount (t/255 instead of t/256). since we r adding make sure the volume of each is halved!! then profit!!
(((sin((t/256)
* note((bassFreq[2][int((ticks/8)%8)])) )-1)&(40-(ticks%8)*3))
+((sin((t/254)
* note((bassFreq[2][int((ticks/8)%8)])) )-1)&(40-(ticks%8)*3))) +


//what the hell
//the << stuff just transposes
((ticks>1152) ?((sin(((t<<(ticks>1408 & ((ticks*4)%2>=1)))/64)*note((lead3Table[int((ticks/4+16)%32)]+keyC)) )-1)
)&(20) : 0) +

//arp 3 (unused)
//(ticks>1408?(((sin((t/16)*note((arpTable[int((ticks/32)%2)+6][int((ticks*2.5)%2)]+keyC)) )-1)&(12-(ticks%8)*1.5))):0) +
//perc
kick()+

(ticks>1152 ? 
ticks>1392 & ticks<1408?0:snare()+hihat():0)

:

// final


ticks<1920?

((sin((t/256)
* note((bassFreq[2][int((ticks/8)%8)])) )-1)&(2+(ticks%8)*4))+
((sin((t/254)
* note((bassFreq[2][int((ticks/8)%8)])) )-1)&(2+(ticks%8)*4))+
(ticks<1888?
kick()+snare()+hihat():0)

:
//end
ticks<=1952?
((sin((t/256)
*note((11)) )-1)&(32-(ticks%32)*1))
+((sin((t/254)
* note((11)) )-1)&(32-(ticks%32)*1))

:0
)

)//sect2

)//main