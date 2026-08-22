tVanilla=t,
t||(rvA=[]),rvI=0,
$A=t==0,
rv=(X,L,dry=0.5,wet=0.5,dry2=0,T=t,Q=false,F=x=>x)=>(
	(t&&!(rvA[rvI]==undefined))||(
		rvA.push(Array(L).fill(0))
	),
	//(()=>{throw rv})()
	OUTPUT1=rvA[rvI][Q?int(T%L):t%L]=
		F(rvA[rvI][Q?t%L:int(T%L)])*wet+
		(X&255)*dry,
	Q?OUTPUT1+X*dry2:rvA[rvI][t%L]+X*dry2
),
vocode=(pitch=3/4,n=1024,input,name='filter',T=tVanilla)=>{
	this[name]??={Array: null};
	this[name].Array??=Array(n).fill(0);
	this[name].Array[floor(T)%n]=input;
	return this[name].Array[floor(T*pitch)%n];
},
r = repeat = (x, y) => Array(x).fill(y).flat(9),
t ? 0 : fx = r(3e5, 0),
lim = limiter = (x, sp = .1) => ( // FROM https://www.reddit.com/r/bytebeat/comments/10nnfbt/
	x &= 255,
	mi = fx[fxi] = min( fx[fxi] + sp, x, 255),
	mx = fx[fxi + 1] = max( fx[fxi + 1] - sp, x, mi+9),
	fxi+=2,
	(x-mi)*255/(mx-mi)
),
fxi = 0,
 SubDrumPattern=(a,b)=>b.test(a.toString(2)),tt=t>>6&255,drumPattern=t=>SubDrumPattern(t+tt,/^...1/)&&(SubDrumPattern(t+tt,/^..1/)||SubDrumPattern(t+tt,/^....1/)),dP=drumPattern((t>>2)%(2048/[1,1,1,1,1,1,2,2][t>>13&7]))?127:0,


R=t*10/(4+(t>>17)%16)*(1+(3&t>>15))>>(1&t>>14)&128,
SIG=[t>>13&1?0:R,R*(1-(t%16384)/16384),rv(R*(amp=1.00006**-(t&16383)),16384,0.2,0.8)*2][2],

lim(SIG+R*amp,0.01)/2+dP