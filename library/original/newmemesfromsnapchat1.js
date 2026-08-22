//======================//
//        TIME          //
//======================//

t /= V = 0.75,
P = 2**(6/12)
, 
// Pattern
G = 'KHKHSHKSKSKHSKHS'[t/8192 & 15]
, 
//======================//
//     WAVE HELPERS     //
//======================//

gS = t =>
    sin(
        t +
        sin(t*6/5)/2 +
        sin(t/3*2.75)/3
    ), 

No = (t, m=1) =>
    gS(
        t/24 +
        gS(t/23)*4*gS(t/38) -
        gS(t/28)
    ) *
    gS(t/7) *
    cos(t*PI/m), 

//======================//
//     INSTRUMENTS      //
//======================//

Dr = t =>
    tanh(
        sin(
            tanh(t/40000)*200 +
            (1 - tanh(t/200)) * No(t/3,9)*3 +
            gS(tanh(t/10000)*30)/2
        ) *
        (1 - tanh(t/2000)**50)
    ) *
    tanh(t/50)
, 
Hi = t =>
    No(t*PI/2,4) *
    (1 - tanh(t/2100)**2)
, 
Sn = t =>
    tanh(
        No(t/8,3) *
        No(t,8) *
        tanh(t/1500)**80 * 80 +

        gS(t/22 + gS(t/32)**7 * 8) *
        sin(t/32)**3 +

        Dr(t)*2
    ) *
    (1 - tanh(t/8192))
, 
Sna = t => Sn(t*PI/1.25)
, 
//======================//
//        MAIN          //
//======================//

func =
    Hi(t%8192 * 7/5 * V * P) * (G == 'H') +
    (
        Dr((t%2**13) * V * P) * (G == 'K') +
        Sna((t%2**13) * V * P) * (G == 'S')
    )
, 
//======================//
//     REVERB SETUP     //
//======================//

Az = Array
, 
r = (i,g,C,V,S,P,W,M,e,I) => (

    L = 0,

    H = (s,b,x,y,z) =>
        L++ < b ? s(b,x,y,z) : L = 0,

    R = (d,t,l,s) => (
        t.push(Az(l - s*L).fill(0)),
        H(R,d,t,l,s)
    ),

    t
    ? 0
    : (
        O = Az(),
        p = Az(),
        s = Az(),

        R(C,O,V,S),
        R(P,p,W,M),
        R(P,s,W,M)
    ),

    // Comb
    F = d =>
        (O[L].shift() + H(F,d)),

    F(C),

    o = d =>
        (O[L].push(i - g*O[L][0]) + H(o,d)),

    o(C),

    c = d =>
        (O[L][O[L].length-1] + H(c,d)),

    // Allpass
    f = d => (
        p[L].shift(),
        p[L].push(L ? s[L-1][s[L-1].length-1] : c(C)),

        s[L].shift(),
        s[L].push(
            -g * p[L][p[L].length-1] +
            p[L][0] +
            g * s[L][0]
        ),

        H(f,d)
    ),

    f(P),

    I*i + s[P][s[P].length-1]/C*e
)
, 
//======================//
//       OUTPUT         //
//======================//

r(func, .9, 14, 2048, 140, 0, 150, 200, 1, 4) / 4