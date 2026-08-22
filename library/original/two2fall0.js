// The Twelly Tools
// Just a set of tools created by me, with some MaxiToys and GreaserPirate inspirations.
// Configuration stuff
TrackProperties = {
	SampleRate: 32000, // Sample Rate to be played the track
	Tuning: 440, // The tuning of the track	
	SamplesPerBeat: 16384, // You can change this, this property means the samples per beat
	Volume: 1 / 2, // The volume of your track (on float-point number)
	BPM: 130, // The BPM of your track
},
t || (
	FilterBuffer = [],
	DelayBuffers = [], 
	[ResonanceX, ResonanceY] = [[], []]
),

// This calculates the t speed to be accorded to real BPM
Speed = TrackProperties.BPM / (60 * TrackProperties.SampleRate / TrackProperties.SamplesPerBeat),

// This calculates the exact tone 
Tone = (2 ** (-9 / 12)) * TrackProperties.Tuning * 128 / TrackProperties.SampleRate,

// T CONSTANTS
// These are the most important constants on your track
// tt is for the tone and ts for the speed
tt = t * Tone,
ts = t * Speed,

// UTILITIES
// Those functions are the utilities of your track, you'll need them!
// The Iterate function: Advance each element of an array
Iterate = (SourceArray, Speed) => SourceArray[(ts >> Speed) % SourceArray.length],

// This function clamps a signal, removing the offset and the clipping
AdvancedClamp = (Input, AmplitudeAmount, Mode) => (
	Mode === "Soft" ? 
		tanh(Input * AmplitudeAmount * PI / 128) * 128
	: Mode === "Hard" ? 
		min(max(Input * AmplitudeAmount, -128), 127) 
	: Mode == "Sine" ? 
		sin(Input * AmplitudeAmount * PI / 128) * 128
	: Mode == "Tri" ? 
		asin(sin(Input * AmplitudeAmount * PI / 128)) * 128
		/ (PI / 2)
	: 0
),

// The ST function: Converts a semitone to a real note
ST = (Semitone) => tt * 2 ** (Semitone / 12),

// The Decode & Encode function: Encodes and decodes base-64 strings to array (and viceversa)
BASE64_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/+",
Decode = (SourceString) => [...SourceString].map(x => (
	Result = [],
	x === "-" ? NaN : BASE64_CHARS.indexOf(x)
)),
Encode = (Numbers) => (Numbers.map(n => Number.isNaN(n) ? "-" : BASE64_CHARS[n]).join("")),

// The Sequence function: Advance each base-36 encoded string character and convert it to notes
Sequence = (SourceData, Speed, Transpose=0) => ST(Iterate(Decode(SourceData), Speed) + Transpose) || 0,

// The ProcessChord function: Process and converts a string to a chord
ProcessChord = (ChordProgression, Speed, Waveform) => (
	(Index = [...Iterate(ChordProgression, Speed)]).reduce((ac, i) => 
		ac + Waveform(ST(Decode(i))) % 256 / Index.length, 0
	)
),
// The Delay Function: This function applies reverb into a signal, using the absolute197 reverb method.
// EDIT: I made it infinitely instanciable!
DelayCallCount = 0,
Delay = (Input, Feedback=0.5, Samples=12288) => (
    Call = DelayCallCount++,
	DelayBuffers[Call] || (DelayBuffers[Call] = Array(Samples).fill(0)),
	Buffer = DelayBuffers[Call],
	Input += Buffer[t % Samples],
	Buffer[t % Samples] = Input * Feedback,
	Buffer[t % Samples]
),

// FILTERS
// Those effects are filters, normal filters, so you've to use it well!
CallCount = 0,
LPF = LowPassFilter = (Input, Amp) => (
	Call = CallCount++,
	FilterBuffer[Call] ??= 0,
	FilterBuffer[Call] += (Input - FilterBuffer[Call]) * Amp
),
HPF = HighPassFilter = (Input, Amp) => (Input - LPF(Input, Amp)),
BPF = BandPassFilter = (Input, LowAmp, HighAmp) => HPF(LPF(Input, LowAmp), HighAmp),
NOF = NotchFilter = (Input, LowAmp, HighAmp) => (HPF(Input, HighAmp) + LPF(Input, LowAmp)) / 1.75,
LBF = LowBoostFilter = (Input, Amp, Level) => Input + LPF(Input, Amp) * Level,
HBF = HighBoostFilter = (Input, Amp, Level) => Input + HPF(Input, Amp) * Level,

// NEW! Low Pass Filter with Resonance ADDED!
// https://www.musicdsp.org/en/latest/Filters/29-resonant-filter.html
LPRCallCount = 0,
LPR = LowPassResonance = (Input, Frequency=.05, Resonance=.7) => (
    Call = LPRCallCount++,
    
    ResonanceX[Call] ??= 0,
    ResonanceY[Call] ??= 0,

    Feedback = Resonance + Resonance / (1 - Frequency),

    ResonanceX[Call] += Frequency * (Input - ResonanceX[Call] + Feedback * (ResonanceX[Call] - ResonanceY[Call])),
    ResonanceY[Call] += Frequency * (ResonanceX[Call] - ResonanceY[Call]),

    ResonanceY[Call]
),

Kick = (Time, Amplitude=128, Tone=8, Exponent=4) => Amplitude * sin(sin(Tone * cbrt(ts % Time))) * (1 - ts / Time % 1) ** Exponent,

Snare = (Time, Amplitude=256, Tone=12, Exponent=8) => (
	SnareNoise = BPF(random(), .1, .3) * Amplitude ,
	SnarePerc = AdvancedClamp(Kick(Time, Amplitude / 3, Tone, Exponent) + SnareNoise * (1 - ts / Time % 1) ** (Exponent / 3 | 0), 1, "Soft"),
	AdvancedClamp(LPR(SnarePerc, .7), 1, "Soft")
),

Hihat = (Time, Amplitude=128, Exponent=3) => (
	HihatNoise = HPF(random(), .6) * Amplitude,
	HihatNoise * (1 - ts / Time % 1) ** Exponent
),

Square = (Input, PulseWidth) => HPF((Input % 256 / 2 + PulseWidth) & 128, .005),
Triangle = (Input) => HPF(asin(sin(Input * PI / 128)) / (PI / 2) * 128 & ~15, .005),
 
MnBPattern = "7730",
LeadPattern = "rtqroqmokmjkhjfhefceac8a78573523",
KickOn = Iterate("1  1 1  ", 13),
SnareOn = Iterate("    1 1 ", 13),

Song = Lr => (
	Melody = Square([1.005, .995][Lr] * Sequence(MnBPattern, 16, 11), (ts >> 8 & 255)) * (1 - ts /4096 % 1),
	Lead = Delay(Triangle(Sequence(LeadPattern, 12, 11)) * (1 - ts / 4096 % 1)) * 1.25 * [1.005, .95][Lr],
	Bass = Tone => (Square(Sequence(MnBPattern, 16, -13 + Tone * [1.005, .995][Lr]), (ts >> 9 & 255))),
	Bass = (Bass(0) + Bass(7)) / 2,
	Drums = KickOn * Kick(8192, 128, 8, 1) + SnareOn * Snare(8192, 256, 12, 5) + Hihat(4096, 192, 1),
	PercussionChannels = AdvancedClamp(Drums, 1 / 4, "Soft"),
	NoteChannels = AdvancedClamp(Melody + Lead + Bass, 1 / 2, "Soft") * max(.25, ts / 16384 % 1),
	WetMix = AdvancedClamp(NoteChannels + PercussionChannels, 1 / 3, "Sine"),
	DryMix = LBF(AdvancedClamp(LPR(WetMix, .7), 1 / 2, "Soft"), .1, 2) / 2,
	AdvancedClamp(DryMix, 1, "Hard")
),
[Song(0), Song(1)]