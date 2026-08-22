output=function() {
	let elist = [];
	let i = 99;
	let index = 0;
	while (index < 100) {
		let str = "";
		str += `${i==0?"No more":i} ${i==1?"bottle":"bottles"} of beer on the wall,\n`;
		str += `${i==0?"No more":i} ${i==1?"bottle":"bottles"} of beer,\n`;
		if (i !== 0) {
			str += "Take one down, pass it around,\n";
		} else {
			str += "Go to the store, buy some more,\n";
			i = 100;
		}
		i--;
		str += `${i==0?"No more":i} ${i==1?"bottle":"bottles"} of beer on the wall.`;
		elist.push(str);
		index++;
	}
	return elist;
},
t?0:(melody=[8,8,8,3,3,3,8,8,8,8,(n=NaN),n,10,10,10,5,5,5,10,n,n,n,n,n,7,n,7,7,n,n,7,7,7,7,n,n,3,3,3,3,5,7,8,8,8,8],list=output()),
t&255?((t*2**(melody[(t*3>>12)%48]/12)*2&127)+16&128)*(1-t*3%4096/4096):(()=>{
	const idx = (t*3>>12)%48;
	let loops = Math.floor(t / 65536);
	loops %= list.length;
	let strList = ["\n", "\n", "\n", "\n", "\n"];
	let gotString = list[loops];
	if (idx >= 0) {
		strList[0] += gotString.split("\n")[0];
	}
	if (idx >= 12) {
		strList[1] += gotString.split("\n")[1];
	}
	if (idx >= 24) {
		strList[2] += gotString.split("\n")[2];
	}
	if (idx >= 36) {
		strList[3] += gotString.split("\n")[3];
	}
	
	throw "\n" + strList.join("");
})()