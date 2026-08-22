function getPrimes(max) {
var sieve = [];
var i;
var j;
var primes = [];
for (i = 2; i <= max; ++i) {
if (!sieve[i]) {
primes.push(i);
for (j = i << 1; j <= max; j += i) {
sieve[j] = true;
}
}
}
return primes; 
}
var sec = int(t / (24000/5))+1
var result = 0
var primes = getPrimes(200)
for( var i = 0; i < primes.length; i++ ) {
   var j = primes[i]
   if( (sec/j) == int(sec/j) ) {
      result += ((t*128)/(1+(i)))&128?16:0
   }
}

return result