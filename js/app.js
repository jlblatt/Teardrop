var
  SCENE, CAMERA, RENDERER,
  SONG, BUFFER, SOURCE, AUDIOCTX, ANALYSER, FD, TD, 
  VOLUME = 0, THRESHOLD = 0, LASTBEAT = 0,
  EFFECTS = [], EFFECT, EPTR = 0,
  FPS_SHOW = false, FPS_LAST = 0, FPS_COUNT = 0;

////////////////////////////////
// INIT
////////////////////////////////

document.addEventListener("DOMContentLoaded", function(event) { 

  //init three.js

  SCENE = new THREE.Scene();

  RENDERER = new THREE.WebGLRenderer();
  RENDERER.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(RENDERER.domElement);

  //init effects

  EFFECT = EFFECTS[EPTR];

  //setup input

  function inputEvent(e) {
    // http://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
    var vector = new THREE.Vector3();
    vector.set((e.clientX / window.innerWidth)  * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(CAMERA);
    var dir = vector.sub(CAMERA.position).normalize();
    var distance = -CAMERA.position.z / dir.z;
    var pos = CAMERA.position.clone().add(dir.multiplyScalar(distance));
    EFFECT.input(pos.x, pos.y);
  }

  window.onmousemove = inputEvent;

  window.ontouchmove = function(e) {
    e.clientX = e.touches[0].clientX;
    e.clientY = e.touches[0].clientY;
    inputEvent(e);
  }

  window.onkeypress = function(e) {
    e.clientX = Math.floor(Math.random() * window.innerWidth);
    e.clientY = Math.floor(Math.random() * window.innerHeight);
    inputEvent(e);

    if(e.which == 32) {
      EFFECT.destroy();
      EPTR++;
      if(EPTR > EFFECTS.length - 1) EPTR = 0;
      EFFECT = EFFECTS[EPTR];
      EFFECT.setup();
    }

    //return false;
  }

  //window resize

  window.onresize = function() {
    RENDERER.setSize(window.innerWidth, window.innerHeight);
    EFFECT.resize();
  };

  //setup audio
  
  window._newAnalyser = function (fftSize, smoothingTimeConstant) {
    ANALYSER = AUDIOCTX.createAnalyser();
    SOURCE.connect(ANALYSER);
    ANALYSER.connect(AUDIOCTX.destination);
    ANALYSER.fftSize = fftSize;
    ANALYSER.smoothingTimeConstant = smoothingTimeConstant;
    FD = new Uint8Array(ANALYSER.frequencyBinCount);
    TD = new Uint8Array(fftSize);
    ANALYSER.getByteFrequencyData(FD);
    ANALYSER.getByteTimeDomainData(TD);
  }

  window._formatTime = function(t) {
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    if(m < 10) m = '0' + m;
    if(s < 10) s = '0' + s;
    return m + ':' + s;
  }

  SONG = new Audio();
  SONG.addEventListener("canplay", function() {
    AUDIOCTX = new AudioContext();
    SOURCE = AUDIOCTX.createMediaElementSource(SONG);
    EFFECT.setup();
    SONG.play();
    player.classList.add("playing");
    document.getElementById("info").innerHTML = 'Tap-In - STS9 - 2015-10-30, Stage AE, Pittsburgh PA';
    document.getElementById("totaltime").innerHTML = _formatTime(SONG.duration);
  });
  SONG.src = "mp3/sts9.2015-10-30.m934b.vms32ub.zoomf8.24bit-t04.mp3";

  //setup drag and drop for custom songs
  //http://stackoverflow.com/questions/17944496/html5-audio-player-drag-and-drop

  window.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();

    document.querySelectorAll("canvas")[0].style.opacity = .5;

    var reader = new FileReader();

    reader.addEventListener('load', function(e) {

      var data = e.target.result;
      AUDIOCTX = new AudioContext();
      AUDIOCTX.decodeAudioData(data, function(buffer) {

        if(SONG) { 
          SONG.pause();
          SONG.src ="";
          SONG.load();
          SONG = null;
          player.classList.remove("playing");
        }

        if(BUFFER) {
          SOURCE.stop();
        }

        BUFFER = buffer;
        SOURCE = AUDIOCTX.createBufferSource();
        SOURCE.buffer = buffer;
        _newAnalyser(ANALYSER.fftSize, ANALYSER.smoothingTimeConstant);
        SOURCE.start();
        player.classList.add("playing");

        document.querySelectorAll("canvas")[0].style.opacity = 1;
        document.getElementById("totaltime").innerHTML = _formatTime(BUFFER.duration);

        document.getElementById("player").innerHTML = '<a id="playpause"></a>' + document.getElementById("player").innerHTML;
        document.getElementById("playpause").addEventListener('click', function() {
          if(player.classList.contains("playing")) AUDIOCTX.suspend();
          else AUDIOCTX.resume();
          document.getElementById("player").classList.toggle("playing");
        });

      });
    });

    reader.readAsArrayBuffer(e.dataTransfer.files[0]);

    new jsmediatags.Reader(e.dataTransfer.files[0])
      .setTagsToRead(["artist", "title", "album", "year"])
      .read({
        onSuccess: function(tag) {
          var artist = tag.tags.artist && tag.tags.artist.trim() ? tag.tags.artist : "";
          var title = tag.tags.title && tag.tags.title.trim() ? ' - ' + tag.tags.title : "";
          var album = tag.tags.album && tag.tags.album.trim() ? ' - ' + tag.tags.album : "";
          var year = tag.tags.year  && tag.tags.year.trim() ? ' (' + tag.tags.year + ')' : "";
          document.getElementById("info").innerHTML = artist + title + album + year;
        },
        onError: function(error) {
          document.getElementById("info").innerHTML = 'Error reading media tag :(';
        }
      });

    document.getElementById("playpause").remove();

  });

  window.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll("canvas")[0].style.opacity = .8;
  });

  window.addEventListener('dragstop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll("canvas")[0].style.opacity = 1;
  });

  //player controls

  document.getElementById('hide').addEventListener('click', function() {
    document.getElementById('player').classList.add('hidden');
  });

  document.getElementById('playpause').addEventListener('click', function() {
    if(document.getElementById('player').classList.contains("playing")) SONG.pause();
    else SONG.play();
    document.getElementById('player').classList.toggle("playing");
  });

  window.onkeypress = function(e) {
    if(e.which == 112 || e.which == 80) {
      document.getElementById('player').classList.remove('hidden');
    }
  }

  //let's go!

  loop();

});

////////////////////////////////
// SCREEN MESSAGE
////////////////////////////////



////////////////////////////////
// MAIN LOOP
////////////////////////////////

function loop(time) {

  requestAnimationFrame(loop);

  //fps

  if(FPS_SHOW && time - FPS_LAST > 1000) {
    console.log(FPS_COUNT);
    FPS_COUNT = 0;
    FPS_LAST = time;
  } else if(FPS_SHOW) {
    FPS_COUNT++;
  }

  //visuals

  if(!ANALYSER) return;

  ANALYSER.getByteFrequencyData(FD);
  ANALYSER.getByteTimeDomainData(TD);

  var sum = 0;
  for(var i = 0; i < FD.length; i++) {
    sum += FD[i];
  }

  VOLUME += ((sum / FD.length)  - VOLUME) * 0.12;

  if(VOLUME > THRESHOLD && VOLUME > 25 && time - LASTBEAT > 300) {
    EFFECT.beat();
    THRESHOLD = VOLUME * 1.2;
    LASTBEAT = time;
  }

  EFFECT.tick();

  TWEEN.update(time);

  RENDERER.render(SCENE, CAMERA);

  THRESHOLD *= 0.99;

  //player

  var currentTime;

  if(SONG) currentTime = SONG.currentTime;
  else currentTime = AUDIOCTX.currentTime;

  document.getElementById("currtime").innerHTML = _formatTime(currentTime);
}
