T=t/48e3,
TAU=2*PI,
mtof=n=>440*2**((n-69)/12), D="0081cf0us1na2j30wk1jq11o1fz0wk1jv2bz0r81jq13f1e70t01qu2j30yc1sm2dr10421n7d41ov0t01p22of0pg1p20wc1qn0r81p22a70wk1p20wd1n50t01nf2tt0wk1p22n40yn1sr2hg1061uc0w81vz0wk1p22of0wk1p20y41hr0yc1li2dr0t01p211n1jj0yc1hy2hn0uu1g40uj1jj11w1jq0222e30zz1lg0y01sf0us1na2of0wk1jv11o1u70wk1qz2ft1201sk0wb1u71041sm28f13o1qu11m2501hy2fj07q09ncug00r2rz0wk1ue0132ok0zz2to00y2fn0t21sr2om0ur2h700w2ky1lj09z28i0uj1xm02j2fl13o1xy0zz1qb13e28802e0631hr11w2qe00w2dr2fg00r0132vn1jq0152fn11y28b00z0132j62mi00k00y40804g1qn0wk1js13q1sk0wf2fc00r1qn0wk21z02e2l00pb2fg00y1oz13q1nf2ae1031l813f00w1si13r2g71jr13m1sa00r28h13q1jv2gz00a13j2tk00r1sf0wk2ow1jj00r0ug29s0b804b0132h42ll1l407g03k39d00f00k0135ab00d00r00y3wo00w28f13o1so1061p00wf28d00r2j824t0132g409g28d00y2dw00w28d0in1hw00w28y07g00o2vo2fg00o0171ii0t010p1xn0132aa1xn1le2x600t2fl1ze0132c10102j300y1zq00w2a700y1jq01026o0gv39y2aq4b505w0d400y28w26n00m00r00v2ao2kt00r28k26l01321g0102fh00y25000w2a500v1k00pg14213g00o2fo2mk00o0171ka0pg1492g700b28k26j1lg3gq07l00t00m4kn2as2a702c04600y2ao25e2902c004607z4o24lt00o00y28w2fj00m00v2g02fh00k00rcgf02e02h28r2j102c00ob6702b02e2hk28d02905wb4c027044dhn03z0447yi04105w51f03u027044",
t||(s=0,q=[...Array(D.length/3|0)].map((_,i)=>(v=parseInt(D.substr(i*3,3),36),s+=v>>6,[s/96,(v&63)+49])),p=0),
(adv=()=>q[p]&&q[p][0]<=T&&(p++,adv()))(),
fm=(t,f)=>f&&(
 a=0.2*exp(-t*1.5),
 d=0.08*exp(-t*0.8),
 e=0.2*exp(-t*12),
 b=exp(-t*30),
 trem=1+0.2*sin(TAU*5*t),
 tanh(sin(TAU*f*t+5.8*d*sin(TAU*f*6.3*t))*a*trem*3)+
 (sin(TAU*f*t+4*b*sin(TAU*f*9.01*t))+.3*t*exp(-t*10))*e
),
q.slice(p>12?p-12:0,p).reduce((a,[t0,n])=>(dt=T-t0,dt<3?a+fm(dt,mtof(n)):a),0)/2