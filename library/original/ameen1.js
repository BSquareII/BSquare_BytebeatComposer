orig_samprate=11025, // The samplerate of the Bytebeat.

pitch_shift=0.5, // The amount of pitch-shifting.

buffer_size=8192, // The buffer size, only change this if you know what you're doing.

// Hint: If the Bytebeat has many low-frequency instruments, you can set buffer_size to 12288, if it has many high-freq instruments, you can set buffer_size to 6144 or 4096, but it's best to just use 8192.

buffer_size=orig_samprate/48000*buffer_size,pitch_shift-=0.000001,this.seekpos??=0,seekpos+=buffer_size/pitch_shift,t%=buffer_size,t+=seekpos/buffer_size,t/=48000/orig_samprate/pitch_shift,t-=t%1,// Don't touch this line 😠


// Bytebeat here \\\\\\\\\\\\\\\\\\\\\\\

i=t&8191,(((t>>9^(t>>9)-1^1)%13*t&255)/2+((t>>3|t<<(t>>12&2))*(4096>i)+(t>>4|t*(t^t+t/256))*(4095<i)&255)/2)*(2+(t>>16))

// Bytebeat here ///////////////////////


































// If your JS Bytebeat uses a variable other than 't' for time (like 'i'), don't contact me for the inconvenience, I will rip my face to shreds, I spent half an hour trying to figure out the logic, thank you.