sr = 48E3,
x = t / sr,
dt = t,
t || (
	_f = {},
	buf = {}
),
dlyfxi = 0,
FILTER = (x, fc, order, res, id) => {
	let isHPF = order < 0;
	let n = floor(abs(order));
	if (n === 0) return x;
	if (fc >= sr / 2) return isHPF ? 0 : x;
	if (fc <= 0) return isHPF ? x : 0;
	if (!_f[id]) _f[id] = { x1: [], x2: [], y1: [], y2: [] };
	let s = _f[id];
	let stages = floor(n / 2);
	let isOdd = n % 2 !== 0;
	let w0 = 2 * PI * fc / sr;
	let cosw = cos(w0);
	let sinw = sin(w0);
	let alpha, b0, b1, b2, a0, a1, a2, y;
	let out = x;
	for (let i = 0; i < stages; i++) {
		let poleAngle = (2 * i + 1 + n) * PI / (2 * n);
		let Q = res / (2 * abs(cos(poleAngle)));
		alpha = sinw / (2 * Q);
		if (isHPF) {
			b0 =  (1 + cosw) / 2;
			b1 = -(1 + cosw);
			b2 =  (1 + cosw) / 2;
		} else {
			b0 =  (1 - cosw) / 2;
			b1 =   1 - cosw;
			b2 =  (1 - cosw) / 2;
		}
		a0 = 1 + alpha;
		a1 = -2 * cosw;
		a2 = 1 - alpha;
		if (s.x1[i] == null) {
			s.x1[i] = s.x2[i] = s.y1[i] = s.y2[i] = 0;
		}
		y = (b0 / a0) * out + (b1 / a0) * s.x1[i] + (b2 / a0) * s.x2[i] - (a1 / a0) * s.y1[i] - (a2 / a0) * s.y2[i];
		s.x2[i] = s.x1[i]; s.x1[i] = out;
		s.y2[i] = s.y1[i]; s.y1[i] = y;
		out = y;
	}
	if (isOdd) {
		let idx = stages;
		let a = sinw / (cosw + sinw); 
		if (s.y1[idx] == null) s.y1[idx] = 0;
		let lpf_out = s.y1[idx] + a * (out - s.y1[idx]);
		s.y1[idx] = lpf_out;
		out = isHPF ? (out - lpf_out) : lpf_out;
	}
	return out;
},
cosp = (a, b, mu) => (
	mu = (1 - cos(mu * PI)) * .5,
	a * (1 - mu) + b * mu
),
dMax = 1e5,
dly = multiTapDelay = (inp, heads, mix, fbfn = x => x) => {
	dly_fxii = dlyfxi++;
	buf[dly_fxii] ??= new Float32Array(dMax);
	dly_wi = dt % dMax;
	dly_feed = inp;
	dly_out = 0;
	
	for(let head of heads){
		pos = dMax + dt - head.t;

		i0 = floor(pos) % dMax;
		i1 = (i0 + 1) % dMax;
		mu = pos - floor(pos);

		dly_ri = cosp(
			buf[dly_fxii][i0],
			buf[dly_fxii][i1],
			mu
		);
		dly_feed += dly_ri * head.fb;
		dly_out += dly_ri * head.m;
	};

	buf[dly_fxii][dly_wi] = fbfn(dly_feed);
	return inp * (1 - mix) + dly_out * mix;
},

saw = t => t / 128 % 2 - 1,
bpm = 122.405, ts = x * bpm / 60 * 16384, tt = x * 256 * 440, spb = 60 / bpm * sr,
m = x => tt * 2 ** ((x - 69) / 12),
FILTER(dly(-saw(m([[51, 50, 48, 50][(ts >> 12 & 31) / 6 & 3], 58, 65, 67, 65, 58][(ts >> 12 & 31) % 6])), [{t: spb * 3 / 4, m: 1, fb: .55}], .275), ts >> 17 > 2 ? 0 : ts >> 17 ? log((1 - (ts + 131072) / 262144 % 1) ** 2 + 1) * log(4) * 4920 + 80 : log((ts / 131072 % 1) ** 2 + 1) * log(4) * 4920 + 180, 8, 1.66) / PI *! (t / sr > 12)