// settings:
// floatbeat, infix, 44kHz

cuckolded_black_mage = function(n) {
	np = n % 90000;
	nd = n % 1200000;
	
	var c, m;
	// fuck me
	var vogue = (666 / 10) + 4.5;
	if (nd < 300000) {
		c = 1;
		m = 2;
	}
	else if (nd < 500000) {
		var please_iwant2die = false;
		c = ((nd - 300000) / 200000) * 2 - 1;
		m = 2;
		vogue = 17;
	}
	else if (nd < 700000) {
		c = sin(n / (n / 40000));
		m = 2;
	}
	else if (nd < 1000000) {
		c = -1;
		m = 2;
	}
	else {
		c = sin(n / 10);
		m = 3; "doc comment"
	}

	var x = floor(np / 6000);
	if (c == -1 && x % (m + 1)) {
		return (sin(np / vogue) * sin(np / (vogue / 2)) * 2 - 1);
	}
	else if (x % (m + 8) < (m + 1)) {
		return (sin(np / vogue) * sin(np / (vogue / 2)) * 2 - 1) * c;
	}
	else if (x % (m + 1)) {
		return sin(np / 100) * sin(np / 50) * 2 - 1;
	}
	return 0;
},
cuckolded_black_mage(t) * (sin(t / 400) * 0.2 + 0.8) * round(sin(t / 100)) * (sin(t / 100000) * 0.2 * sin(t / 10) + 0.8)