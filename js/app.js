var
  WINX = window.innerWidth, WINY =  window.innerHeight,
  FPS = {show: false, last: Date.now(), count: 0},
  INPUT = {last: Date.now(), e: null, x: null, y: null, mousedown: false, cursor: null},
  SONG, SOURCE, AUDIOCTX, ANALYSER, FD, TD,
  SCENE, CAMERA, RENDERER,
  EFFECTS = [], EFFECT, EPTR = 0;

////////////////////////////////
// INIT
////////////////////////////////

document.addEventListener("DOMContentLoaded", function(event) { 

  //init three.js

  SCENE = new THREE.Scene();

  CAMERA = new THREE.PerspectiveCamera(75, WINX / WINY, 1, 10000);

  RENDERER = new THREE.WebGLRenderer();
  RENDERER.setSize(WINX, WINY);

  document.body.appendChild(RENDERER.domElement);

  //setup cursor

  var c_mat = new THREE.MeshBasicMaterial({color: 0xdddddd});
  var c_geo = new THREE.CircleGeometry(1, 12);
  INPUT.cursor = new THREE.Mesh(c_geo, c_mat);
  //SCENE.add(INPUT.cursor);

  //init effects
  EFFECT = EFFECTS[EPTR];

  //setup input

  function inputEvent(e) {
    INPUT.x = ((e.clientX / WINX) - 0.5);
    INPUT.y = ((e.clientY / WINY) - 0.5);
    INPUT.cursor.position.x = INPUT.x;
    INPUT.cursor.position.y = INPUT.y;
    INPUT.e = e;
    INPUT.last = Date.now();
    EFFECT.input();
  }

  window.onmousemove = inputEvent;

  window.onmousedown = function(e) {
    INPUT.mousedown = true;
    inputEvent(e);
  }

  window.onmouseup = function(e) {
    INPUT.mousedown = false;
  }

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

  //setup audio
  
  window._newAnalyser = function (fftSize) {
    AUDIOCTX = new AudioContext();
    SOURCE = AUDIOCTX.createMediaElementSource(SONG);
    ANALYSER = AUDIOCTX.createAnalyser();
    SOURCE.connect(ANALYSER);
    ANALYSER.connect(AUDIOCTX.destination);
    ANALYSER.fftSize = fftSize;
    FD = new Uint8Array(ANALYSER.frequencyBinCount);
    TD = new Uint8Array(fftSize);
    ANALYSER.getByteFrequencyData(FD);
    ANALYSER.getByteTimeDomainData(TD);
  }

  SONG = document.getElementById("song");

  SONG.addEventListener("canplay", function() {
    EFFECT.setup();
    //SONG.play();
  });

  //window resize

  window.onresize = function() {
    WINX = window.innerWidth;
    WINY =  window.innerHeight;
    RENDERER.setSize(WINX, WINY);
    EFFECT.resize();
  };

  //start

  loop();

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
