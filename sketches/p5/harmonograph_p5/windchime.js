class Windchime {
  constructor() {
    this.chordNo = 1;
    this.pitches = [146, 165, 183, 195, 220, 244, 275, 293, 330, 367,
      391, 440, 489, 550, 587, 660, 734, 783, 880, 978, 1101, 1174, 1321, 1468, 1566];
    this.fifths = [[4, 9], [2, 6], [5, 10]];
    this.chords = [
      [5, 7, 11, 13, 14, 16, 18, 20, 22, 23],
      [6, 8, 9, 11, 13, 15, 16, 18, 20, 22],
      [5, 7, 8, 10, 12, 14, 15, 17, 19, 21]
    ];
    setInterval(() => { this.chordNo = (this.chordNo + 1) % this.chords.length; }, 8000);
  }

  playTone(frequency, duration, volume, type = 'sine') {
    this.context ||= new AudioContext();
    this.context.resume();
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);
  }

  soundNewUser() {
    for (const index of this.fifths[this.chordNo]) {
      this.playTone(this.pitches[index], 4.5, 0.035);
    }
  }

  soundWikiChange() {
    const chord = this.chords[this.chordNo];
    const index = chord[Math.floor(Math.random() * chord.length)];
    this.playTone(this.pitches[index], 2.4, 0.075, 'triangle');
  }
}
