const tau =	2*PI;
const BPM =	150;
const T =	BPM/60;

function FM(input, amplitude) {
	return sin(input+sin(input)*amplitude);
}

function FM2(input, amplitude) {
	return FM(FM(input,amplitude)+FM(input,amplitude),amplitude)
}

function MIDI(note) {
	return isNaN(note)?0:440*2**((note-69)/12);
}

function drums(instrument, time, speed) {
	const pattern = instrument[time*speed%instrument.length|0];
	if(pattern == "k") {
		return sin((time*speed%1)**.3*200)*3*max(1-time*speed%1*1.5,0)**4;
	}
	else if(pattern == "h") {
		return (random()-.5)*2*max(1-time*speed%1*2,0)**3;
	}
	else if(pattern == "s") {
		return sin((time*speed%1)**.2*500)*4*max(1-time*speed%1*3,0)**5+sin((time*4e3|0)**4)*max(1-time*speed%1*2,0)**1.5;
	}
}

return function(time) {
	return tanh(atan(FM2(time*MIDI([65,65,64,69,67,70,69,67][time*T%8|0]),7)/3+FM(time*MIDI([65,69,72,70][time*T/8%4|0]),6)/2+drums("khskhksh",time,T)));
}