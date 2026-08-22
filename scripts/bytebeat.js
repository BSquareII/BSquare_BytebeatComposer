import { deflateRaw, inflateRaw } from './pako.esm.min.mjs';

const loadScript = src => new Promise(resolve => {
	try {
		const scriptElem = document.createElement('script');
		scriptElem.type = 'module';
		scriptElem.async = true;
		scriptElem.src = src;
		scriptElem.addEventListener('load', () => resolve());
		scriptElem.addEventListener('error', () => console.error(`Failed to load the script ${src}`));
		document.head.appendChild(scriptElem);
	} catch (err) {
		console.error(err.message);
	}
});

globalThis.bytebeat = new class {
	constructor() {
		this.audioCtx = null;
		this.audioGain = null;
		this.audioRecordChunks = [];
		this.audioRecorder = null;
		this.audioWorkletNode = null;
		this.byteSample = 0;
		this.cacheParentElem = null;
		this.cacheTextElem = null;
		this.canvasContainer = null;
		this.canvasCtx = null;
		this.canvasElem = null;
		this.canvasHeight = 256;
		this.canvasPlayButton = null;
		this.canvasTimeCursor = null;
		this.canvasWidth = 1024;
		this.containerFixedElem = null;
		this.controlDrawMode = null;
		this.controlLag = null;
		this.controlPlaybackMode = null;
		this.controlRecord = null;
		this.controlSampleRate = null;
		this.controlSampleRateSelect = null;
		this.controlScale = null;
		this.controlScaleDown = null;
		this.controlScaleUp = null;
		this.controlSRDivisor = null;
		this.controlSRDivisorDown = null;
		this.controlSRDivisorUp = null;
		this.controlThemeStyle = null;
		this.controlTime = null;
		this.controlTimeUnits = null;
		this.controlVolume = null;
		this.controlVolumeDisplay = null;
		this.drawBuffer = [];
		this.drawEndBuffer = [];
		this.editorElem = null;
		this.errorElem = null;
		this.isCompilationError = false;
		this.isLagging = false;
		this.isNeedClear = false;
		this.isPlaying = false;
		this.isRecording = false;
		this.lastUpdateTime = 0;
		this.playbackSpeed = 1;
		this.settings = {
			drawMode: 'Waveform',
			drawScale: 0,
			isSeconds: false,
			srDivisor: 1,
			themeStyle: 'Default',
			volume: .5
		};
		this.songData = { mode: 'Floatbeat', sampleRate: 22050 };
		this.updateCounter = 0;
		this.init();
	}
	get editorValue() {
		return this.editorView ? this.editorView.state.doc.toString() : this.editorElem.value;
	}
	get saveData() {
		const a = document.body.appendChild(document.createElement('a'));
		a.style.display = 'none';
		const saveData = (blob, fileName) => {
			const url = URL.createObjectURL(blob);
			a.href = url;
			a.download = fileName;
			a.click();
			setTimeout(() => window.URL.revokeObjectURL(url));
		};
		Object.defineProperty(this, 'saveData', { value: saveData });
		return saveData;
	}
	get timeCursorEnabled() {
		return this.songData.sampleRate >> this.settings.drawScale < 2000;
	}
	animationFrame() {
		this.drawGraphics(this.byteSample);
		if (this.isPlaying) {
			this.requestAnimationFrame();
		}
	}
	clearCanvas() {
		this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	}
	copyLink() {
		navigator.clipboard.writeText(window.location);
	}
	drawGraphics(endTime) {
		if (!isFinite(endTime)) {
			this.resetTime();
			return;
		}
		const buffer = this.drawBuffer;
		const bufferLen = buffer.length;
		if (!bufferLen) {
			return;
		}
		const redColor = 100;
		const width = this.canvasWidth;
		const height = this.canvasHeight;
		const scale = this.settings.drawScale;
		const isReverse = this.playbackSpeed < 0;
		let startTime = buffer[0].t;
		let startX = this.mod(this.getX(startTime), width);
		let endX = Math.floor(startX + this.getX(endTime - startTime));
		startX = Math.floor(startX);
		let drawWidth = Math.abs(endX - startX) + 1;
		// Truncate large segments (for high playback speed or 512px canvas)
		if (drawWidth > width) {
			startTime = (this.getX(endTime) - width) * (1 << scale);
			startX = this.mod(this.getX(startTime), width);
			endX = Math.floor(startX + this.getX(endTime - startTime));
			startX = Math.floor(startX);
			drawWidth = Math.abs(endX - startX) + 1;
		}
		startX = Math.min(startX, endX);
		// Restoring the last points of a previous segment
		const imageData = this.canvasCtx.createImageData(drawWidth, height);
		const { data } = imageData;
		if (scale) {
			const x = isReverse ? drawWidth - 1 : 0;
			for (let y = 0; y < height; ++y) {
				const drawEndBuffer = this.drawEndBuffer[y];
				if (drawEndBuffer) {
					const idx = (drawWidth * (255 - y) + x) << 2;
					if (drawEndBuffer[0] === redColor) {
						data[idx] = redColor;
					} else {
						data[idx] = data[idx + 2] = drawEndBuffer[0];
					}
					data[idx + 1] = drawEndBuffer[1];
				}
			}
		}
		// Filling an alpha channel in a segment
		for (let x = 0; x < drawWidth; ++x) {
			for (let y = 0; y < height; ++y) {
				data[((drawWidth * y + x) << 2) + 3] = 255;
			}
		}
		// Drawing in a segment
		//NOTE: diagram view uses chasyxx's old diagram version from t-8492's bytebeat composer site
		//															(https://github.com/T-8492/bbeat2)
		const isWaveform = this.settings.drawMode === 'Waveform';
		const isDiagram = this.settings.drawMode === 'Diagram';
		let ch, drawPoint, drawWaveLine, drawDiagram;
		for (let i = 0; i < bufferLen; ++i) {
			const curY = buffer[i].value;
			const prevY = buffer[i - 1]?.value ?? [NaN, NaN];
			const isNaNCurY = [isNaN(curY[0]), isNaN(curY[1])];
			const curTime = buffer[i].t;
			const nextTime = buffer[i + 1]?.t ?? endTime;
			const curX = this.mod(Math.floor(this.getX(isReverse ? nextTime + 1 : curTime)) - startX, width);
			const nextX = this.mod(Math.ceil(this.getX(isReverse ? curTime + 1 : nextTime)) - startX, width);
			const diagramIteration = this.mod(curTime, 2 ** this.settings.drawScale);
			// Error value - filling with red color
			if ((isNaNCurY[0] || isNaNCurY[1]) && !isDiagram) {
				for (let x = curX; x !== nextX; x = this.mod(x + 1, width)) {
					for (let y = 0; y < height; ++y) {
						const idx = (drawWidth * y + x) << 2;
						if (!data[idx + 1] && !data[idx + 2]) {
							data[idx] = redColor;
						}
					}
				}
			}
			// Select mono or stereo drawing
			if ((curY[0] === curY[1] || isNaNCurY[0] && isNaNCurY[1]) && prevY[0] === prevY[1]) {
				drawPoint = this.drawPointMono;
				drawWaveLine = this.drawWaveLineMono;
				drawDiagram = this.drawDiagramMono;
				ch = 1;
			} else {
				drawPoint = this.drawPointStereo;
				drawWaveLine = this.drawWaveLineStereo;
				drawDiagram = this.drawDiagramStereo;
				ch = 2;
			}
			while (ch--) {
				if (isNaNCurY[ch] && !isDiagram) {
					continue;
				}
				const curYCh = curY[ch];
				if (!isDiagram) { // We are not drawing diagram
					// Points drawing
					for (let x = curX; x !== nextX; x = this.mod(x + 1, width)) {
						drawPoint(data, (drawWidth * (255 - curYCh) + x) << 2, ch);
					}
					// Waveform mode: vertical lines drawing
					if (isWaveform) {
						const prevYCh = prevY[ch];
						if (isNaN(prevYCh)) {
							continue;
						}
						const x = isReverse ? this.mod(Math.floor(this.getX(curTime)) - startX, width) : curX;
						for (let dy = prevYCh < curYCh ? 1 : -1, y = prevYCh; y !== curYCh; y += dy) {
							drawWaveLine(data, (drawWidth * (255 - y) + x) << 2, ch);
						}
					}
				} else {//We're drawing diagram, use that
					for (let x = curX; x !== nextX; x = this.mod(x + 1, width)) {
						drawDiagram(data, drawWidth, x, curYCh, diagramIteration, scale, isNaNCurY[ch], ch);
					}
				}
			}
		}
		// Saving the last points of a segment
		if (scale) {
			const x = isReverse ? 0 : drawWidth - 1;
			for (let y = 0; y < height; ++y) {
				const idx = (drawWidth * (255 - y) + x) << 2;
				this.drawEndBuffer[y] = [data[idx], data[idx + 1]];
			}
		}
		// Placing a segment on the canvas
		this.canvasCtx.putImageData(imageData, startX, 0);
		if (endX >= width) {
			this.canvasCtx.putImageData(imageData, startX - width, 0);
		} else if (endX <= 0) {
			this.canvasCtx.putImageData(imageData, startX + width, 0);
		}
		// Move the cursor to the end of the segment
		if (this.timeCursorEnabled) {
			this.canvasTimeCursor.style.left = endX / width * 100 + '%';
		}
		// Clear buffer
		this.drawBuffer = [{ t: endTime, value: buffer[bufferLen - 1].value }];
	}
	drawPointMono(data, i) {
		data[i++] = data[i++] = data[i] = 255;
	}
	drawPointStereo(data, i, ch) {
		if (ch) {
			data[i] = data[i + 2] = 255;
		} else {
			data[i + 1] = 255;
		}
	}
	drawWaveLineMono(data, i) {
		if (!data[i + 1]) {
			data[i++] = data[i++] = data[i] = 160;
		}
	}
	drawWaveLineStereo(data, i, ch) {
		if (ch) {
			if (!data[i + 2]) {
				data[i] = data[i + 2] = 160;
			}
		} else if (!data[++i]) {
			data[i] = 160;
		}
	}
	drawDiagramMono(data, DW, j, V, DI, scale, NaNchk) {
		const size = Math.max(1, 256 / (2 ** scale))
		for (let k = 0; k < size; k++) {
			let i = ((k + (DI * size)) * DW + j) << 2
			if (NaNchk) {
				data[i] = 100
			} else {
				data[i++] = data[i++] = data[i] = V & 255;
			}
		}
	}
	drawDiagramStereo(data, DW, j, V, DI, scale, NaNchk, ch) {
		const size = 256 / (2 ** scale)
		for (let k = 0; k < size; k++) {
			let i = ((k + (DI * size)) * DW + j) << 2
			if (NaNchk) {
				data[i] = 100
			} else if (ch == 1) {
				data[i] = data[i + 2] = V & 255;
			} else {
				data[i + 1] = V & 255;
			}
		}
	}
	escapeHTML(text) {
		this.cacheTextElem.nodeValue = text;
		return this.cacheParentElem.innerHTML;
	}
	expandEditor() {
		this.containerFixedElem.classList.toggle('container-expanded');
	}
	formatBytes(bytes) {
		if (bytes < 2e3) {
			return bytes + 'B';
		}
		// i fear the day we get a 1 Terabyte code. - Chasyxx, creator of the EnBeat_NEW fork
		const power1000i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)), 10);
		const power1000s = (power1000i ? (bytes / (1000 ** power1000i)).toFixed(2) : bytes) + ['B', 'KB', 'MB', 'GB', 'TB'][power1000i];
		const power1024i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
		const power1024s = (power1000i ? (bytes / (1024 ** power1000i)).toFixed(2) : bytes) + ['B', 'KiB', 'MiB', 'GiB', 'TiB'][power1024i];
		return `${power1024s}/${power1000s}`
	}
	generateLibraryEntry({
		author, children, codeMinified, codeOriginal, cover, date, description, exotic, file,
		fileFormatted, fileMinified, fileOriginal, mode, name, remix, sampleRate, stereo, url
	}) {
		let entry = '';
		const noArrayUrl = url && !Array.isArray(url);
		if (author) {
			let authorsList = '';
			const authorsArr = Array.isArray(author) ? author : [author];
			for (let i = 0, len = authorsArr.length; i < len; ++i) {
				const authorElem = authorsArr[i];
				if (typeof authorElem === 'string') {
					authorsList += '<b>' + authorElem + '</b>';
				} else {
					authorsList += `<a href="${authorElem[1]}" target="_blank">${authorElem[0]}</a>`;
				}
				if (i < len - 1) {
					authorsList += ', ';
				}
			}
			entry += `
				<details>
					<summary style="cursor:pointer;width:fit-content">
						${author == "ccret2022" ?
					authorsList
					+ ` <img style="vertical-align:-2px" title="Non-binary" src="./Assets/NBFlag.png" width="21" height="14"></img>` :
					author == "ANoUserXD (BSquareII)" ?
						authorsList
						+ ' <small style="color:#FF0">Owner of the website</small>' :
						authorsList
				}
					</summary>`;
		}
		if (name) {
			entry += url ? `<a href="${noArrayUrl ? url : url[0]}" target="_blank">${name}</a>` : name;
		}
		if (url && (!noArrayUrl || !name)) {
			if (noArrayUrl) {
				entry += `[<a href="${url}" target="_blank">link</a>]`;
			} else {
				const urlsList = [];
				for (let i = name ? 1 : 0, len = url.length; i < len; ++i) {
					urlsList.push(`<a href="${url[i]}" target="_blank">link${i + 1}</a>`);
				}
				entry += ` [${urlsList.join(', ')}]`;
			}
		}
		if (cover) {
			const { url: cUrl, name: coverName } = cover;
			entry += ` <span class="code-remix">(cover of ${cUrl ?
				`<a href="${cUrl}" target="_blank">${coverName}</a>` :
				`"${coverName}"`
				})</span>`;
		}
		if (remix) {
			const arr = [];
			const remixArr = Array.isArray(remix) ? remix : [remix];
			for (let i = 0, len = remixArr.length; i < len; ++i) {
				const { url: rUrl, name: remixName, author: rAuthor } = remixArr[i];
				arr.push(`${rUrl ? `<a href="${rUrl}" target="_blank">${remixName || rAuthor}</a>` : `"${remixName}"`
					}${remixName && rAuthor ? ' by ' + rAuthor : ''}`);
			}
			entry += ` <span class="code-remix">(remix of ${arr.join(', ')})</span>`;
		}
		if (date || sampleRate || mode || stereo || exotic) {
			let infoStr = date ? `(${date})` : '';
			if (sampleRate) {
				infoStr += `${infoStr ? ' ' : ''}${sampleRate}Hz`;
			}
			if (mode) {
				infoStr += (infoStr ? ' ' : '') + mode;
			}
			if (stereo) {
				infoStr += `${infoStr ? ' ' : ''}<span class="code-stereo">Stereo</span>`;
			}
			if (exotic) {
				infoStr += `${infoStr ? ' ' : ''}<span class="code-exotic" title="this code contains a custom function(s), that only works on this bytebeat player and chasyxx's bytebeat player. using any of these makes your code become forbidden and have no chance in being on the dollchan bytebeat library.">&#9888; EXOTIC &#9888;</span>`;
			}
			entry += ` <span class="code-info">${infoStr}</span>`;
		}
		const songData = codeOriginal || codeMinified || file ? JSON.stringify({ sampleRate, mode }) : '';
		if (codeMinified) {
			entry += ` <span class="code-length" title="Size in bytes">${this.formatBytes(new Blob([codeMinified]).size)}</span><button class="code-button code-toggle"` +
				' title="Minified version shown. Click to view the original version.">+</button>';
		} else if (codeOriginal) {
			if (Array.isArray(codeOriginal)) {
				codeOriginal = codeOriginal.join('\n');
			}
			entry += ` <span class="code-length" title="Size in bytes">${this.formatBytes(new Blob([codeOriginal]).size)}</span>`;
		}
		if (file) {
			if (fileFormatted) {
				entry += `<button class="code-button code-load code-load-formatted" data-songdata='${songData}' data-code-file="${file
					}" title="Click to load and play the formatted code">formatted</button>`;
			}
			if (fileOriginal) {
				entry += `<button class="code-button code-load code-load-original" data-songdata='${songData}' data-code-file="${file
					}" title="Click to load and play the original code">original</button>`;
			}
			if (fileMinified) {
				entry += `<button class="code-button code-load code-load-minified" data-songdata='${songData}' data-code-file="${file
					}" title="Click to load and play the minified code">minified</button>`;
			}
		}
		if (description) {
			entry += (entry ? '<br>' : '') + description;
		}
		if (codeOriginal) {
			if (Array.isArray(codeOriginal)) {
				codeOriginal = codeOriginal.join('\n');
			}
			entry += `<br><button class="code-text code-text-original${codeMinified ? ' hidden' : ''}" data-songdata='${songData}' code-length="${this.formatBytes(new Blob([codeOriginal]).size)}">${this.escapeHTML(codeOriginal)}</button>`;
		}
		if (codeMinified) {
			entry += `${codeOriginal ? '' : '<br>'}<button class="code-text code-text-minified"` +
				` data-songdata='${songData}' code-length="${this.formatBytes(new Blob([codeMinified]).size)}">${this.escapeHTML(codeMinified)}</button>`;
		}
		if (children) {
			let childrenStr = '';
			const len = children.length;
			if (len > 8) {
				childrenStr += `<details><summary class="code-button children-toggle">${len - 5} more bytebeats</summary>`;
				for (let i = 0; i < len; ++i) {
					if (i === len - 5) {
						childrenStr += '</details>';
					}
					childrenStr += this.generateLibraryEntry(children[i]);
				}
			} else {
				for (let i = 0; i < len; ++i) {
					childrenStr += this.generateLibraryEntry(children[i]);
				}
			}
			entry += `<div class="entry-children">${childrenStr}</div></details>`;
		}
		return `<div class="${codeOriginal || codeMinified || file || children ? 'entry' : 'entry-text'}">${entry}</div>`;
	}
	getX(t) {
		return t / (1 << this.settings.drawScale);
	}
	handleEvent(e) {
		let elem = e.target;
		switch (e.type) {
			case 'change':
				switch (elem.id) {
					case 'control-drawmode': this.setDrawMode(); break;
					case 'control-mode': this.setPlaybackMode(elem.value); break;
					case 'control-samplerate':
					case 'control-samplerate-select': this.setSampleRate(+elem.value); break;
					case 'control-theme-style': this.setThemeStyle(elem.value); break;
				}
				return;
			case 'click':
				switch (elem.tagName) {
					case 'svg': elem = elem.parentNode; break;
					case 'use': elem = elem.parentNode.parentNode; break;
					default:
						if (elem.classList.contains('control-fast-multiplier')) {
							elem = elem.parentNode;
						}
				}
				switch (elem.id) {
					case 'canvas-container':
					case 'canvas-main':
					case 'canvas-play':
					case 'canvas-timecursor': this.playbackToggle(!this.isPlaying); break;
					case 'control-counter':
					case 'control-counter-units': this.toggleCounterUnits(); break;
					case 'control-expand': this.expandEditor(); break;
					case 'control-link': this.copyLink(); break;
					case 'control-pause': this.playbackToggle(false); break;
					case 'control-play-backward': this.playbackToggle(true, true, -1); break;
					case 'control-play-forward': this.playbackToggle(true, true, 1); break;
					case 'control-rec': this.toggleRecording(); break;
					case 'control-reset': this.resetTime(); break;
					case 'control-scale': this.setScale(-this.settings.drawScale); break;
					case 'control-scaledown': this.setScale(-1, elem); break;
					case 'control-scaleup': this.setScale(1); break;
					case 'control-srdivisor-down': this.setSRDivisor(-1); break;
					case 'control-srdivisor-up': this.setSRDivisor(1); break;
					case 'control-stop': this.playbackStop(); break;
					default:
						if (elem.classList.contains('code-text')) {
							this.loadCode(Object.assign({ code: elem.innerText },
								elem.hasAttribute('data-songdata') ? JSON.parse(elem.dataset.songdata) : {}));
						} else if (elem.classList.contains('code-load')) {
							this.onclickCodeLoadButton(elem);
						} else if (elem.classList.contains('code-toggle') && !elem.getAttribute('disabled')) {
							this.onclickCodeToggleButton(elem);
						} else if (elem.classList.contains('library-header')) {
							this.onclickLibraryHeader(elem);
						} else if (elem.parentNode.classList.contains('library-header')) {
							this.onclickLibraryHeader(elem.parentNode);
						}
				}
				return;
			case 'input':
				switch (elem.id) {
					case 'control-counter': this.oninputCounter(e); break;
					case 'control-volume': this.setVolume(false); break;
					case 'editor-default': this.setFunction(); break;
				}
				return;
			case 'keydown':
				switch (elem.id) {
					case 'control-counter': this.oninputCounter(e); break;
					case 'editor-default': this.onkeydownEditor(e); break;
				}
				return;
			case 'mouseover':
				if (elem.classList.contains('code-text')) {
					elem.title = 'Click to play this code';
				}
				return;
		}
	}
	async init() {
		try {
			this.settings = JSON.parse(localStorage.settings);
		} catch (err) {
			this.saveSettings();
		}
		this.setThemeStyle();
		await this.initAudioContext();
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.initAfterDom());
			return;
		}
		this.initAfterDom();
	}
	initAfterDom() {
		this.initElements();
		this.parseUrl();
		loadScript('./scripts/codemirror.min.mjs');
	}
	async initAudioContext() {
		this.audioCtx = new AudioContext({ latencyHint: 'balanced', sampleRate: 48000 });
		this.audioGain = new GainNode(this.audioCtx);
		this.audioGain.connect(this.audioCtx.destination);
		await this.audioCtx.audioWorklet.addModule('./scripts/audioProcessor.js');
		this.audioWorkletNode = new AudioWorkletNode(this.audioCtx, 'audioProcessor',
			{ outputChannelCount: [2] });
		this.audioWorkletNode.port.addEventListener('message', e => this.receiveData(e.data));
		this.audioWorkletNode.port.start();
		this.audioWorkletNode.connect(this.audioGain);
		const mediaDest = this.audioCtx.createMediaStreamDestination();
		const audioRecorder = this.audioRecorder = new MediaRecorder(mediaDest.stream);
		audioRecorder.addEventListener('dataavailable', e => this.audioRecordChunks.push(e.data));
		audioRecorder.addEventListener('stop', () => {
			let file, type;
			const types = ['audio/webm', 'audio/ogg'];
			const files = ['track.webm', 'track.ogg'];
			while ((file = files.pop()) && !MediaRecorder.isTypeSupported(type = types.pop())) {
				if (types.length === 0) {
					console.error('Recording is not supported in this browser!');
					break;
				}
			}
			this.saveData(new Blob(this.audioRecordChunks, { type }), file);
		});
		this.audioGain.connect(mediaDest);
	}
	initElements() {
		// Containers
		this.cacheParentElem = document.createElement('div');
		this.cacheTextElem = document.createTextNode('');
		this.cacheParentElem.appendChild(this.cacheTextElem);
		this.containerFixedElem = document.getElementById('container-fixed');
		['change', 'click', 'input', 'keydown'].forEach(
			e => this.containerFixedElem.addEventListener(e, this));
		const containerScroll = document.getElementById('container-scroll');
		['change', 'click', 'mouseover'].forEach(e => containerScroll.addEventListener(e, this));

		// Volume
		this.controlVolume = document.getElementById('control-volume');
		this.controlVolumeDisplay = document.getElementById('control-volume-display');
		this.setVolume(true);

		// Canvas
		this.canvasContainer = document.getElementById('canvas-container');
		this.canvasElem = document.getElementById('canvas-main');
		this.canvasCtx = this.canvasElem.getContext('2d');
		this.canvasPlayButton = document.getElementById('canvas-play');
		this.canvasTimeCursor = document.getElementById('canvas-timecursor');
		this.onresizeWindow();
		document.defaultView.addEventListener('resize', () => this.onresizeWindow());

		// Controls
		this.controlCodeSize = document.getElementById('control-codesize');
		this.controlDrawMode = document.getElementById('control-drawmode');
		this.controlDrawMode.value = this.settings.drawMode;
		this.controlLag = document.getElementById('control-lag');
		this.controlPlaybackMode = document.getElementById('control-mode');
		this.controlPlayBackward = document.getElementById('control-play-backward');
		this.controlPlayForward = document.getElementById('control-play-forward');
		this.controlRecord = document.getElementById('control-rec');
		this.controlSampleRate = document.getElementById('control-samplerate');
		this.controlSampleRateSelect = document.getElementById('control-samplerate-select');
		this.controlScale = document.getElementById('control-scale');
		this.controlScaleDown = document.getElementById('control-scaledown');
		this.controlScaleUp = document.getElementById('control-scaleup');
		this.controlSRDivisor = document.getElementById('control-srdivisor');
		this.controlSRDivisorDown = document.getElementById('control-srdivisor-down');
		this.controlSRDivisorUp = document.getElementById('control-srdivisor-up');
		this.controlThemeStyle = document.getElementById('control-theme-style');
		this.controlThemeStyle.value = this.settings.themeStyle;
		this.setScale(0);

		// Time counter
		this.controlTime = document.getElementById('control-counter');
		this.controlTimeUnits = document.getElementById('control-counter-units');
		this.setCounterUnits();

		// Editor
		this.editorElem = document.getElementById('editor-default');
		this.errorElem = document.getElementById('error');
	}
	loadCode({ code, sampleRate, mode }, isPlay = true) {
		this.songData.mode = this.controlPlaybackMode.value = mode = mode || 'Bytebeat';
		if (this.editorView) {
			this.editorView.dispatch({
				changes: {
					from: 0,
					to: this.editorView.state.doc.toString().length,
					insert: code
				}
			});
		} else {
			this.editorElem.value = code;
		}
		this.setSampleRate(this.controlSampleRate.value = +sampleRate || 8000, false);
		this.setSRDivisor(0);
		const data = {
			mode,
			sampleRate: this.songData.sampleRate,
			sampleRatio: this.songData.sampleRate / this.audioCtx.sampleRate
		};
		if (isPlay) {
			data.playbackSpeed = this.playbackSpeed = 1;
			this.playbackToggle(true, false);
			data.resetTime = true;
			data.isPlaying = isPlay;
		}
		data.setFunction = code;
		this.sendData(data);
	}
	mod(a, b) {
		return ((a % b) + b) % b;
	}
	async onclickCodeLoadButton(buttonElem) {
		const response = await fetch(`library/${buttonElem.classList.contains('code-load-formatted') ? 'formatted' :
			buttonElem.classList.contains('code-load-minified') ? 'minified' :
				buttonElem.classList.contains('code-load-original') ? 'original' : ''
			}/${buttonElem.dataset.codeFile}`, { cache: 'no-cache' });
		this.loadCode(Object.assign(JSON.parse(buttonElem.dataset.songdata),
			{ code: await response.text() }));
	}
	onclickCodeToggleButton(buttonElem) {
		const parentElem = buttonElem.parentNode;
		const origElem = parentElem.querySelector('.code-text-original');
		const minElem = parentElem.querySelector('.code-text-minified');
		origElem?.classList.toggle('hidden');
		minElem?.classList.toggle('hidden');
		const isMinified = buttonElem.textContent === '–';
		parentElem.querySelector('.code-length').textContent =
			`${(isMinified ? minElem : origElem).getAttribute('code-length')}`;
		buttonElem.title = isMinified ? 'Minified version shown. Click to view the original version.' :
			'Original version shown. Click to view the minified version.';
		buttonElem.textContent = isMinified ? '+' : '–';
	}
	async onclickLibraryHeader(headerElem) {
		const containerElem = headerElem.nextElementSibling;
		const state = containerElem.classList;
		if (state.contains('loaded') || headerElem.parentNode.open) {
			return;
		}
		state.add('loaded');
		const waitElem = headerElem.querySelector('.loading-wait');
		waitElem.classList.remove('hidden');
		const response = await fetch(`./library/${containerElem.id.replace('library-', '')}.json`,
			{ cache: 'no-cache' });
		const { status } = response;
		waitElem.classList.add('hidden');
		if (status !== 200 && status !== 304) {
			state.remove('loaded');
			containerElem.innerHTML = `<div class="loading-error">Unable to load the library: ${status} ${response.statusText}</div>`;
			return;
		}
		containerElem.innerHTML = '';
		let libraryHTML = '';
		const libraryArr = await response.json();
		for (let i = 0, len = libraryArr.length; i < len; ++i) {
			libraryHTML += `<div class="entry-top">${this.generateLibraryEntry(libraryArr[i])}</div>`;
		}
		containerElem.insertAdjacentHTML('beforeend', libraryHTML);
	}
	oninputCounter(e) {
		if (e.key === 'Enter') {
			this.controlTime.blur();
			this.playbackToggle(true);
			return;
		}
		const byteSample = this.settings.isSeconds ? Math.round(this.controlTime.value * this.songData.sampleRate) :
			this.controlTime.value;
		this.setByteSample(byteSample);
		this.sendData({ byteSample });
	}
	onkeydownEditor(e) {
		if (e.key === 'Tab' && !e.shiftKey && !e.altKey && !e.ctrlKey) {
			e.preventDefault();
			const editorElem = e.target;
			const { value, selectionStart } = editorElem;
			editorElem.value = value.slice(0, selectionStart) + '\t' + value.slice(editorElem.selectionEnd);
			editorElem.setSelectionRange(selectionStart + 1, selectionStart + 1);
			this.setFunction();
		}
	}
	onresizeWindow() {
		const isSmallWindow = window.innerWidth <= 768 || window.innerHeight <= 768;
		if (this.canvasWidth === 1024) {
			if (isSmallWindow) {
				this.canvasWidth = this.canvasElem.width = 512;
			}
		} else if (!isSmallWindow) {
			this.canvasWidth = this.canvasElem.width = 1024;
		}
	}
	parseUrl() {
		let { hash } = window.location;
		if (!hash) {
			this.updateUrl();
			({ hash } = window.location);
		}
		let songData;
		if (hash.startsWith('#4')) {
			const dataArr = Uint8Array.from(atob(hash.substring(2)), el => el.charCodeAt());
			try {
				songData = {
					mode: ['Bytebeat', 'Signed Bytebeat', 'Floatbeat', 'Funcbeat', 'postfix'][dataArr[0]],
					sampleRate: new DataView(dataArr.buffer).getFloat32(1, 1),
					code: inflateRaw(new Uint8Array(dataArr.buffer, 5), { to: 'string' })
				};
			} catch (err) {
				console.error(`Couldn't load data from url: ${err}`);
			}
		} else if (hash.startsWith('#v3b64')) {
			try {
				songData = inflateRaw(Uint8Array.from(atob(hash.substring(6)), el => el.charCodeAt()), { to: 'string' });
				if (!songData.startsWith('{')) { // XXX: old format
					songData = { code: songData, sampleRate: 8000, mode: 'Bytebeat' };
				} else {
					songData = JSON.parse(songData);
					if (songData.formula) { // XXX: old format
						songData.code = songData.formula;
					}
				}
			} catch (err) {
				console.error(`Couldn't load data from url: ${err}`);
			}
		} else {
			console.error('Couldn\'t load data from url: unrecognized url data');
		}
		this.loadCode(songData || { code: this.editorValue }, false);
	}
	playbackStop() {
		this.playbackToggle(false, false);
		this.sendData({ isPlaying: false, resetTime: true });
	}
	playbackToggle(isPlaying, isSendData = true, speedIncrement = 0) {
		const isReverse = speedIncrement ? speedIncrement < 0 : this.playbackSpeed < 0;
		const buttonElem = isReverse ? this.controlPlayBackward : this.controlPlayForward;
		if (speedIncrement && buttonElem.getAttribute('disabled')) {
			return;
		}
		const multiplierElem = buttonElem.firstElementChild;
		const speed = speedIncrement ? +multiplierElem.textContent : 1;
		multiplierElem.classList.toggle('control-fast-multiplier-large', speed >= 8);
		const nextSpeed = speed === 64 ? 0 : speed * 2;
		this.setPlayButton(this.controlPlayBackward, isPlaying && isReverse ? nextSpeed : 1);
		this.setPlayButton(this.controlPlayForward, isPlaying && !isReverse ? nextSpeed : 1);
		if (speedIncrement || !isPlaying) {
			this.playbackSpeed = isPlaying ? speedIncrement * speed : Math.sign(this.playbackSpeed);
		}
		this.canvasContainer.title = isPlaying ? `Click to ${this.isRecording ? 'pause and stop recording' : 'pause'}` :
			`Click to play${isReverse ? ' in reverse' : ''}`;
		this.canvasPlayButton.classList.toggle('canvas-play-backward', isReverse);
		this.canvasPlayButton.classList.toggle('canvas-play', !isPlaying);
		this.canvasPlayButton.classList.toggle('canvas-pause', isPlaying);
		if (isPlaying) {
			this.canvasPlayButton.classList.remove('canvas-initial');
			if (this.audioCtx.resume) {
				this.audioCtx.resume();
				this.requestAnimationFrame();
			}
		} else {
			this.lastUpdateTime = 0;
			this.updateCounter = 0;
			this.isLagging = false;
			this.controlLag.innerText = '---';
			this.controlLag.classList.remove('control-lag-red');
			if (this.isRecording) {
				this.isRecording = false;
				this.controlRecord.classList.remove('control-recording');
				this.controlRecord.title = 'Record to file';
				this.audioRecorder.stop();
			}
		}
		this.isPlaying = isPlaying;
		if (isSendData) {
			this.sendData({ isPlaying, playbackSpeed: this.playbackSpeed });
		} else {
			this.isNeedClear = true;
		}
	}
	receiveData(data) {
		const { byteSample, drawBuffer, error } = data;
		if (typeof byteSample === 'number') {
			this.setCounterValue(byteSample);
			this.setByteSample(byteSample);
		}
		if (Array.isArray(drawBuffer)) {
			this.drawBuffer = this.drawBuffer.concat(drawBuffer);
			const limit = this.canvasWidth * (1 << this.settings.drawScale) - 1;
			if (this.drawBuffer.length > limit) {
				this.drawBuffer = this.drawBuffer.slice(-limit);
			}
		}
		if (error !== undefined) {
			let isUpdate = false;
			if (error.isCompiled === false) {
				isUpdate = true;
				this.isCompilationError = true;
			} else if (error.isCompiled === true) {
				isUpdate = true;
				this.isCompilationError = false;
			} else if (error.isRuntime === true && !this.isCompilationError) {
				isUpdate = true;
			}
			if (isUpdate) {
				this.errorElem.innerText = error.message;
				this.sendData({ errorDisplayed: true });
			}
			if (data.updateUrl !== true) {
				this.setCodeSize(this.editorValue);
			}
		}
		if (data.updateUrl === true) {
			this.updateUrl();
		}
	}
	requestAnimationFrame() {
		window.requestAnimationFrame(() => this.animationFrame());
	}
	resetTime() {
		this.isNeedClear = true;
		this.sendData({ resetTime: true, playbackSpeed: this.playbackSpeed });
	}
	saveSettings() {
		localStorage.settings = JSON.stringify(this.settings);
	}
	sendData(data) {
		this.audioWorkletNode.port.postMessage(data);
	}
	setByteSample(value) {
		this.byteSample = +value || 0;
		if (this.isNeedClear && value === 0) {
			this.isNeedClear = false;
			this.drawBuffer = [];
			this.clearCanvas();
			this.canvasTimeCursor.style.left = 0;
			if (!this.isPlaying) {
				this.canvasPlayButton.classList.add('canvas-initial');
			}
		}
	}
	setCounterUnits() {
		this.controlTimeUnits.textContent = this.settings.isSeconds ? 'sec' : 't';
		this.setCounterValue(this.byteSample);
	}
	setCodeSize(value) {
		this.controlCodeSize.textContent = `${this.formatBytes(new Blob([value]).size)} (${window.location.href.length}c)`;
	}
	setCounterValue(value) {
		this.controlTime.value = this.settings.isSeconds ?
			(value / this.songData.sampleRate).toFixed(2) : value;
		// Lag detection
		this.updateCounter++;
		if (this.updateCounter === 400) {
			this.updateCounter = 0;
			const time = Date.now();
			if (this.lastUpdateTime) {
				const lag =
					Math.min(Math.max(Math.round((time - this.lastUpdateTime) * 37.5 / 400) - 100, 0), 999);
				this.controlLag.innerText = lag + '%';
				if (lag > 3) {
					if (!this.isLagging) {
						this.isLagging = true;
						this.controlLag.classList.add('control-lag-red');
					}
				} else if (this.isLagging) {
					this.isLagging = false;
					this.controlLag.classList.remove('control-lag-red');
				}
			}
			this.lastUpdateTime = time;
		}
	}
	setDrawMode() {
		this.settings.drawMode = this.controlDrawMode.value;
		this.saveSettings();
	}
	setFunction() {
		this.sendData({ setFunction: this.editorValue });
	}
	setPlaybackMode(mode) {
		this.songData.mode = mode;
		this.updateUrl();
		this.sendData({ mode, setFunction: this.editorValue });
	}
	setPlayButton(buttonElem, speed) {
		const isFast = speed !== 1;
		buttonElem.classList.toggle('control-fast', isFast);
		buttonElem.classList.toggle('control-play', !isFast);
		if (speed) {
			buttonElem.firstElementChild.textContent = speed;
			buttonElem.removeAttribute('disabled');
		} else {
			buttonElem.setAttribute('disabled', true);
			buttonElem.removeAttribute('title');
			return;
		}
		const direction = buttonElem === this.controlPlayForward ? 'forward' : 'reverse';
		buttonElem.title = `Play ${isFast ? `fast ${direction} x${speed} speed` : direction}`;
	}
	setSampleRate(sampleRate, isSendData = true) {
		if (!sampleRate || !isFinite(sampleRate) ||
			// Float32 limit
			(sampleRate = Number(parseFloat(Math.abs(sampleRate)).toFixed(0))) > 3.4028234663852886E+38
		) {
			sampleRate = 8000;
		}
		sampleRate = Math.max(1, sampleRate);
		switch (sampleRate) {
			case 4000:
			case 6000:
			case 8000:
			case 11025:
			case 12000:
			case 16000:
			case 22050:
			case 24000:
			case 32000:
			case 44100:
			case 48000: this.controlSampleRateSelect.value = sampleRate; break;
			default: this.controlSampleRateSelect.selectedIndex = -1;
		}
		const oldSampleRate = this.songData.sampleRate;
		this.controlSampleRate.value = this.songData.sampleRate = sampleRate;
		this.controlSampleRate.blur();
		this.controlSampleRateSelect.blur();
		this.toggleTimeCursor();
		if (isSendData) {
			const data = {
				sampleRate: this.songData.sampleRate,
				sampleRatio: this.songData.sampleRate / this.audioCtx.sampleRate
			}
			if (this.songData.mode === 'Funcbeat') {
				data.byteSample = this.settings.isSeconds ? Math.round(this.controlTime.value * sampleRate) :
					Math.round(this.controlTime.value * sampleRate / oldSampleRate);
				this.setCounterValue(data.byteSample);
				this.setByteSample(data.byteSample);
			}
			this.updateUrl();
			this.sendData(data);
		}
	}
	setScale(amount, buttonElem) {
		if (buttonElem?.getAttribute('disabled')) {
			return;
		}
		const scale = Math.min(Math.max(this.settings.drawScale + amount, 0), 20);
		this.settings.drawScale = scale;
		this.controlScale.innerHTML = !scale ? '1x' :
			scale < 7 ? `1/${2 ** scale}${scale < 4 ? 'x' : ''}` :
				`<sub>2</sub>-${scale}`;
		this.saveSettings();
		this.clearCanvas();
		this.toggleTimeCursor();
		if (this.settings.drawScale <= 0) {
			this.controlScaleDown.setAttribute('disabled', true);
		} else {
			this.controlScaleDown.removeAttribute('disabled');
		}
		if (this.settings.drawScale >= 20) {
			this.controlScaleUp.setAttribute('disabled', true);
		} else {
			this.controlScaleUp.removeAttribute('disabled');
		}
	}
	setSRDivisor(increment) {
		const value = (this.settings.srDivisor || 1) + increment;
		if (value === 0) {
			return;
		}
		this.controlSRDivisor.textContent = this.settings.srDivisor = value;
		this.saveSettings();
		this.sendData({ srDivisor: value });
	}
	setThemeStyle(value) {
		if (!value) {
			value = this.settings.themeStyle;
			if (!value) {
				value = this.settings.themeStyle = 'Default';
				this.saveSettings();
			}
			document.documentElement.dataset.theme = value;
			return;
		}
		document.documentElement.dataset.theme = this.settings.themeStyle = value;
		this.saveSettings();
	}
	setVolume(isInit) {
		let volumeValue = NaN;
		if (isInit) {
			volumeValue = parseFloat(this.settings.volume);
		}
		if (isNaN(volumeValue)) {
			volumeValue = this.controlVolume.value / this.controlVolume.max;
		}
		this.controlVolume.value = this.settings.volume = volumeValue;
		this.controlVolume.title = `Volume: ${(volumeValue * 100).toFixed(0)}%`;
		this.controlVolumeDisplay.textContent = `${(volumeValue * 100).toFixed(0)}%`;
		this.saveSettings();
		this.audioGain.gain.value = volumeValue * volumeValue;
	}
	toggleCounterUnits() {
		this.settings.isSeconds = !this.settings.isSeconds;
		this.saveSettings();
		this.setCounterUnits();
	}
	toggleRecording() {
		if (!this.audioCtx) {
			return;
		}
		if (this.isRecording) {
			this.playbackToggle(false);
			return;
		}
		this.isRecording = true;
		this.controlRecord.classList.add('control-recording');
		this.controlRecord.title = 'Pause and stop recording';
		this.audioRecorder.start();
		this.audioRecordChunks = [];
		this.playbackToggle(true);
	}
	toggleTimeCursor() {
		this.canvasTimeCursor.classList.toggle('hidden', !this.timeCursorEnabled);
	}
	updateUrl() {
		const code = this.editorValue;
		this.setCodeSize(code);
		const codeArr = deflateRaw(code);
		// First byte is mode, next 4 bytes is sampleRate, then the code
		const outputArr = new Uint8Array(5 + codeArr.length);
		outputArr[0] = ['Bytebeat', 'Signed Bytebeat', 'Floatbeat', 'Funcbeat', 'postfix'].indexOf(this.songData.mode);
		outputArr.set(new Uint8Array(new Float32Array([this.songData.sampleRate]).buffer), 1);
		outputArr.set(codeArr, 5);
		// since we're dealing with Uint8Array I should use the non-map method I think - Chasyxx
		let str = "";
		for (let i = 0; i < outputArr.length; i++) {
			str += String.fromCharCode(outputArr[i]);
		}
		window.location.hash = '4' + btoa(str).replaceAll('=', '');
	}
}();
