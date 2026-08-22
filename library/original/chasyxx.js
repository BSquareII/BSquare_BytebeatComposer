// FROM https://youtu.be/pAMgUB51XZA?t=117
t||(y=z=a=null),this.y??=1,z=0,this.a??=1,
//(t&1023 || !t )||(a=int(random()*255)),
(t%(q=1024*2))||(_=>{
a++;
if((z=GCD(a,y))==1){
	z=y+a+1
}else{
   z=(y/z);
}
y=z;
})(),(t*(2**((y%88)/12))/4&192)*(1-(t%q/q));
function GCD(a,b) {
    let tmp;
    while (b != 0) {
        if (a < b) {
            tmp = a;
            a = b;
            b = tmp;
        }
        tmp = b;
        b = a % b;
        a = tmp;
    }
    return a;
}
