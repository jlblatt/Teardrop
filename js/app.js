var
  SCENE, CAMERA, RENDERER,
  SONG, BUFFER, SOURCE, AUDIOCTX, ANALYSER, FD, TD,
  EFFECTS = [], EFFECT, EPTR = 0, CURSOR,
  FPS = {show: false, last: Date.now(), count: 0};

////////////////////////////////
// INIT
////////////////////////////////

document.addEventListener("DOMContentLoaded", function(event) { 

  //init three.js

  SCENE = new THREE.Scene();

  RENDERER = new THREE.WebGLRenderer();
  RENDERER.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(RENDERER.domElement);

  //setup cursor

  var c_mat = new THREE.MeshBasicMaterial({color: 0xdddddd});
  var c_geo = new THREE.CircleGeometry(1, 12);
  CURSOR = new THREE.Mesh(c_geo, c_mat);
  SCENE.add(CURSOR);

  //init effects

  EFFECT = EFFECTS[EPTR];

  //setup input

  function inputEvent(e) {
    //http://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
    var vector = new THREE.Vector3();
    vector.set((e.clientX / window.innerWidth)  * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(CAMERA);
    var dir = vector.sub(CAMERA.position).normalize();
    var distance = -CAMERA.position.z / dir.z;
    var pos = CAMERA.position.clone().add(dir.multiplyScalar(distance));
    CURSOR.position.x = pos.x;
    CURSOR.position.y = pos.y;
    EFFECT.input();
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
  
  window._newAnalyser = function (fftSize) {
    ANALYSER = AUDIOCTX.createAnalyser();
    SOURCE.connect(ANALYSER);
    ANALYSER.connect(AUDIOCTX.destination);
    ANALYSER.fftSize = fftSize;
    FD = new Uint8Array(ANALYSER.frequencyBinCount);
    TD = new Uint8Array(fftSize);
    ANALYSER.getByteFrequencyData(FD);
    ANALYSER.getByteTimeDomainData(TD);
  }

  SONG = new Audio();
  SONG.addEventListener("canplay", function() {
    AUDIOCTX = new AudioContext();
    SOURCE = AUDIOCTX.createMediaElementSource(SONG);
    EFFECT.setup();
    SONG.play();
    loop();
  });
  SONG.src = "mp3/sts9.2015-10-30.m934b.vms32ub.zoomf8.24bit-t04.mp3";

  //setup drag and drop for custom songs
  //http://stackoverflow.com/questions/17944496/html5-audio-player-drag-and-drop

  window.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var reader = new FileReader();
    reader.addEventListener('load', function(e) {
      var data = e.target.result;
      AUDIOCTX = new AudioContext();
      AUDIOCTX.decodeAudioData(data, function(buffer) {
        if(SONG) { 
          SONG.pause();
          SONG.src ="";
          SONG.load();
        }
        if(BUFFER) {
          SOURCE.stop();
        }
        BUFFER = buffer;
        SOURCE = AUDIOCTX.createBufferSource();
        SOURCE.buffer = buffer;
        _newAnalyser(ANALYSER.fftSize);
        SOURCE.start();
      })
    })
    reader.readAsArrayBuffer(e.dataTransfer.files[0]); 
  });

  window.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

});

////////////////////////////////
// MAIN LOOP
////////////////////////////////

function loop(time) {

  requestAnimationFrame(loop);

  if(!ANALYSER) return;

  ANALYSER.getByteFrequencyData(FD);
  ANALYSER.getByteTimeDomainData(TD);

  EFFECT.tick();

  TWEEN.update(time);

  RENDERER.render(SCENE, CAMERA);

  //fps

  if(FPS.show && Date.now() - FPS.last > 1000) {
    console.log(FPS.count);
    FPS.count = 0;
    FPS.last = Date.now();
  } else if(FPS.show) {
    FPS.count++;
  }

}
