NOTE_ORDER = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// important functions

function midi_to_frequency(note, a_freq=440) {
    frequency = 2**((note-69)/12) * a_freq
    return frequency
}

function note_to_midi(note) {
    if (note.includes("#")) {
        real_note = NOTE_ORDER.indexOf(note.slice(0, 2));
        octave = parseInt(note[2]);
	 }
    else if (note.includes("b")) {
        real_note = NOTE_ORDER.indexOf(note[0]) - 1;
        octave = parseInt(note[2]);
	 }
    else {
        real_note = NOTE_ORDER.indexOf(note[0]);
        octave = parseInt(note[1]);
	 }
    octave += 1;
        
    return real_note + octave * 12;
}

function note_to_frequency(note, a_freq=440) {
    midi = note_to_midi(note);
    freq = midi_to_frequency(midi, a_freq);
    return freq;
}

function get_tick_from_bpm(bpm) {
    tick_ms = 60/bpm * 1000;
    return tick_ms;
}
    
function frequency_to_signal(freq) {
    return freq/44100;
}

// FX

function highpass(freq, minfreq) { //not really highpass
    if (minfreq > 1.0) minfreq = frequency_to_signal(minfreq);
    if (freq < minfreq) freq = minfreq;
    return freq;
}

function lowpass(freq, maxfreq) { //not really lowpass
    if (maxfreq > 1.0) maxfreq = frequency_to_signal(maxfreq);
    if (freq > maxfreq) freq = maxfreq;
    return freq;
}

// instruments

//// synths

function pwm(volume=100, t, freq, lfo) {
	volume /= 100;

	sine_of = (freq * 2 * Math.PI) / 44100;
   sine_of_lfo = (lfo * 2 * Math.PI) / 44100;

	percent = Math.sin(sine_of_lfo * t) * 0.25 + 0.3;
   return (Math.floor(Math.abs(Math.sin(sine_of * t)) + percent) * 2.0 - 1) * volume;
}

function square(volume=100, t, freq, percent=0.5) {
	volume /= 100

	sine_of = (freq * 2 * Math.PI) / 44100;
   if (percent < 0.5) percent += 0.5;
   percent = percent - 0.2;

	return (Math.floor(Math.abs(Math.sin(sine_of * t)) + percent) * 2.0 - 1) * volume;
}

//// drums

function hat(volume=100, t) {
	volume /= 100;

	volume -= (t*(1+t)/2)/10000000;
	if (volume > 0) return highpass((Math.random() * 2) - 1.0, 5000) * volume;
	return 0.0;
}

function kick(volume=100, t) {
	volume /= 100;

	freq = 440;
   minfreq = freq/2.85;
   freq -= 0.25 * t;
   if (freq > minfreq) {
      sine_of = (freq * 2 * Math.PI) / 44100;
      return Math.sin(sine_of * t) * volume;
	}
   return 0.0;
}

function snare(volume=100, t) {
	volume1 = volume/100;
   volume2 = volume/100;

	sine_of = (210 * 2 * Math.PI) / 44100;

	volume1 -= (t*(1+t)/2)/20000000;
   volume2 -= (t*(1+t)/2)/5000000;
	if (volume1 > 0) {
      val = lowpass(highpass((Math.random() * 2) - 1.0, 300), 9000) * volume1;
      if (volume2 > 0) val += Math.sin(sine_of * t) * (volume2/2);
      return val;
	}
   return 0.0;
}

// song constants

BPM = 125;
TICK = get_tick_from_bpm(BPM) / 4000;

notesLead = [["C3", 6], ["D3", 1], ["D#3", 1], 
["D3", 6], ["D#3", 1], ["F3", 1], 
["D#3", 6], ["F3", 1], ["G3", 1], 
["F3", 2.66], ["D#3", 2.66], ["D3", 2.66], 
["C3", 16],
["D3", 0.33], ["D#3", 5.66], ["F3", 1], ["G3", 1], 
["F3", 2.66], ["D#3", 2.66], ["D3", 2.66], 
["C3", 4]];

notesBass = [["C1", 2], ["C2", 2], ["C1", 2], ["C2", 2], 
["D1", 2], ["D2", 2], ["D1", 2], ["D2", 2],
["D#1", 2], ["D#2", 2], ["D#1", 2], ["D#2", 2],
["F1", 2], ["F2", 2], ["F1", 2], ["F2", 2],
["A0", 2], ["A1", 2], ["A0", 2], ["A1", 2], ["A0", 2], ["A1", 2], ["A0", 2], ["A1", 2],
["G#0", 2], ["G#1", 2], ["G#0", 2], ["G#1", 2],
["A#0", 2], ["A#1", 2], ["A#0", 2], ["A#1", 2], 
["C1", 4]];

notesDrum = [["K", 2], ["H", 2], ["S", 2], ["H", 2]];

// making the song

song = [];

lead = [];
t = 0;
for (const note of notesLead) {
	freq = note_to_frequency(note[0]);
	t_start = t/44100;
	while (TICK*note[1]+t_start > t/44100) {
		inst = pwm(100, t, freq, 1);
		lead.push(inst);
		t += 1;
	};
};

bass = [];
t = 0;
for (const note of notesBass) {
	freq = note_to_frequency(note[0]);
	t_start = t/44100;
	while (TICK*note[1]+t_start > t/44100) {
		inst = square(100, t, freq);
		bass.push(inst);
		t += 1;
	};
	
};

let drum = kick;

drums = [];
t = 0;
for (let i = 0; i < 8; i++) {
	for (const note of notesDrum) {
		if (note[0] == "K") drum = kick
		else if (note[0] == "S") drum = snare
		else if (note[0] == "H") drum = hat;
		
		t_start = t/44100;
		t_startms = t;
		while (TICK*note[1]+t_start > t/44100) {
			inst = drum(100, t-t_startms);
			drums.push(inst);
			t += 1;
		};
	};
};

for (let i = 0; i < lead.length; i++) {
	leadid = lead[i] * 0.2;
	if (leadid === undefined) leadid = 0;
	bassid = bass[i] * 0.2;
	if (bassid === undefined) bassid = 0;
	drumsid = drums[i];
	if (drumsid === undefined) drumsid = 0;
	song.push(leadid + bassid + drumsid);
};

// final

return function (time, sampleRate) {
	return song[time * 44100];
}