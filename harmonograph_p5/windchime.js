/**************************
* Audio handling
**************************/
class Windchime {
  constructor() {
    // Cycling Chord Number
    this.chordNo = 1;
    
    // Tonal references
    this.pitches = [
      146, 165, 183, 195, 220, 244, 275, 293, 330, 367,
      391, 440, 489, 550, 587, 660, 734, 783, 880, 978,
      1101, 1174, 1321, 1468, 1566
    ];
    this.fifths = [
      [4,9], 
      [2,6], 
      [5,10]
    ]
    this.chords = [
      [5, 7, 11, 13, 14, 16, 18, 20, 22, 23],
      [6, 8, 9, 11, 13, 15, 16, 18, 20, 22],
      [5, 7, 8, 10, 12, 14, 15, 17, 19, 21]
    ];
    
    // New user pad/drone settings
    this.chordEnv = [0, [0.3, 1000], [0.3, 3000], [0, 5000]];
    this.chordFiltEnv = [700, [1200, 1500], [1500, 2000], [1000, 2500], [1000, 5000]];
    this.chordCutoff = T('env', {table:this.chordFiltEnv}).bang();
    
    this.chordChange = this.chordChange.bind(this);
    this.chordChange();
  }
  
  chordChange() {
    this.chordNo = this.chordNo === 2 ? 0 : this.chordNo + 1
    setTimeout(this.chordChange, 8000);
  }
  
  soundWikiChange(addition) {
    const chordNo = this.chordNo;
    const chords = this.chords;
    const pitches = this.pitches;

    let sound = T(addition ? 'sin' : 'saw', {freq:pitches[chords[chordNo][parseInt(random(0, 9))]], mul:0.09});
    sound = addition ? sound : T('lpf' , {cutoff: 670, Q: 12}, sound);
    sound = T('reverb', {room:2, damp:0.1, mix:0.7}, sound);
    
    T('perc', {r: 2500}, sound)
      .on('ended', function() {
        this.pause();
      })
      .bang()
      .play();
  }
  
  soundNewUser() {
    const chordCutoff = this.chordCutoff;
    const chordEnv = this.chordEnv;
    const chordNo = this.chordNo;
    const fifths = this.fifths;
    const pitches = this.pitches;
    
    let sound = T(
      'lpf',
      {cutoff:chordCutoff, Q:3},
      T('sin', {freq: pitches[fifths[chordNo][0]], mul:0.05}),
      T('sin', {freq: pitches[fifths[chordNo][1]], mul:0.05}),
      T('pink', {mul:0.1})
    );
    sound = T('reverb', {room:2, damp:0.1, mix:0.7}, sound);
  
    T('env', {table:chordEnv}, sound)
      .on('ended', function() {
        this.pause();
      })
      .bang()
      .play();
  }
};