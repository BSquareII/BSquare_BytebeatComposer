crush = 1, // comment to disable bitcrush
t /= 16e3,

FS = 375.376,

n = [
	4/5, 1, 6/5, 3/2, 9/5,  3/2, 4/3, 6/5, 2, 3/2, 4/3, 9/8, 6/5, 9/8, 9/10, 2/3,
	4/5, 1, 6/5, 3/2, 15/8, 3/2, 4/3, 6/5, 2, 3/2, 4/3, 9/8, 6/5, 9/8, 4/3,  3/2
],

b = [4/5, 9/10, 1, 3/4, 4/5, 15/16, 1, 6/5],

snd = t => (sin(2*PI*t) + 2*sin(PI*((t + 1/6)%1)) - 1)/2,
mus = (t, a) => snd(FS*(n[floor(t)%32] || 0)*(t%1)/6)*(1 - t%1)*min((t%1)*a, 1),

typeof crush == "undefined" ? 0 : (
	k = 4.86e3,
	t1 = floor(t*k)/k
),

res = t => (
	mus(t, 8)
	+ Array(32).fill(0).map((_, x) => mus(t - (x + 2)/5, 3)/(1.5*x + 3)).reduce((a, b) => a + b)
	+ snd(FS*(b[floor(t/4)%8] || 0)*(t%4)/12)*pow(1 - t%4/4, 0.2)*1.5
)/3,

(typeof crush == "undefined") ? res(t) : floor(96*(0.375*res(t) + 0.625*res(t1)))/96