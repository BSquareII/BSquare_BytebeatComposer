function pitchshifter(x) {
 return 2 ** (x / 12);
}

function saw_generator(t, w, x, y, z) {
 return abs(2 * atan(tan(t * w * pitchshifter(x))) / PI + abs(sin(y))) - z;
}

return function(t) {
 const T = 2 * PI * t;
 const a = saw_generator(T, 125, [0, 0, -2, -4][t / 2 & 3], 0, .5);
 const b = saw_generator(T, 125, [0, -2, -4, -5][t / 2 & 3], 0, .5);
 const c = saw_generator(T, 125, [0, -5, -7, -9][t / 2 & 3], 0, .5);
 const d = saw_generator(T, 125, [3, -5, -7, -2, 0, 0, 2, -3, 7, 5, 2, 7, -2, -5, 2, 0, 3, -5, -7, -2, 0, 0, 2, -3, -5, 2, -7, -3, -5, 2, -10, -12][t * 4 & 31], 1.5, 1);
 return a / 3 + b / 3 + c / 3 + d / 8;
}