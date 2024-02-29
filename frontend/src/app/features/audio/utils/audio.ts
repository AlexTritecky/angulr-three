import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioAnalyzer {
  private isInit: boolean = false;
  public isPulse: boolean = false;
  private analyzer!: AnalyserNode;
  private gain!: GainNode;
  private bass: number = 0;
  private mid: number = 0;
  private high: number = 0;
  private level: number = 0;
  private frame: number = 0;
  private history: number = 0;
  private bufferLength!: number;
  private audioBuffer!: Uint8Array;

  constructor() {
    this.initUserMedia();
  }

  private initUserMedia(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(this.init.bind(this))
        .catch(this.initWithoutStream.bind(this));
    } else {
      console.log('getUserMedia not supported on your browser!');
      if (window.location.protocol === 'https:') {
        this.initWithoutStream();
      }
    }
  }

  private init(stream: MediaStream): void {
    const audioContext = new (window.AudioContext || window.AudioContext)();
    const source = audioContext.createMediaStreamSource(stream);

    this.analyzer = audioContext.createAnalyser();
    this.analyzer.fftSize = 128;
    this.gain = audioContext.createGain();
    source.connect(this.gain);
    this.gain.connect(this.analyzer);
    this.gain.gain.value = 70;

    this.resetHistory();

    this.bufferLength = this.analyzer.frequencyBinCount;
    this.audioBuffer = new Uint8Array(this.bufferLength);

    console.log('audio analyzer is init');

    this.isInit = true;
  }

  private initWithoutStream(): void {
    alert(
      'Microphone is not detected. Pulse is activated instead of mic input.'
    );
    this.resetHistory();
    console.log('audio analyzer is init without mic');
    this.isInit = true;
    this.isPulse = true;
  }

  update(): void {
    if (this.isInit) {
      let bass = 0,
        mid = 0,
        high = 0;

      if (!this.isPulse) {
        this.analyzer.getByteFrequencyData(this.audioBuffer);

        const passSize = this.bufferLength / 3;
        for (let i = 0; i < this.bufferLength; i++) {
          const val = Math.pow(this.audioBuffer[i] / 256, 2);

          if (i < passSize) bass += val;
          else if (i >= passSize && i < passSize * 2) mid += val;
          else if (i >= passSize * 2) high += val;
        }

        bass /= passSize;
        mid /= passSize;
        high /= passSize;
      } else {
        if (this.frame % 40 === Math.floor(Math.random() * 40)) {
          bass = Math.random();
          mid = Math.random();
          high = Math.random();
        }
      }

      this.bass = this.bass > bass ? this.bass * 0.96 : bass;
      this.mid = this.mid > mid ? this.mid * 0.96 : mid;
      this.high = this.high > high ? this.high * 0.96 : high;
      this.level = (this.bass + this.mid + this.high) / 3;

      this.history += this.level * 0.01 + 0.005;
    }

    this.frame++;
  }

  private resetHistory(): void {
    this.history = 0;
  }

  setGain(value: number): void {
    if (this.gain) {
      this.gain.gain.value = value;
    }
  }

  getGain(): number | undefined {
    if (this.gain) {
      return this.gain.gain.value;
    }
    return undefined;
  }

  getBass(): number {
    return this.bass || 0;
  }

  getMid(): number {
    return this.mid || 0;
  }

  getHigh(): number {
    return this.high || 0;
  }

  getLevel(): number {
    return this.level || 0;
  }

  getHistory(): number {
    return this.history || 0;
  }

  triggerPulse(isPulse: boolean): void {
    this.isPulse = isPulse;
  }
}
