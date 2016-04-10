var
  FPS = {show: false, last: Date.now(), count: 0},
  INPUT = {last: Date.now(), e: null, x: null, y: null, mousedown: false, cursor: null},
  EFFECTS = {},
  SCENE, CAMERA, RENDERER;

////////////////////////////////
// INIT
////////////////////////////////

window.onload = function() {

  //init three.js

  SCENE = new THREE.Scene();

  CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  CAMERA.position.z = 600;

  RENDERER = new THREE.WebGLRenderer();
  RENDERER.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(RENDERER.domElement);

  //setup cursor

  var c_mat = new THREE.MeshBasicMaterial({color: 0x000000});
  var c_geo = new THREE.CircleGeometry(2, 24);
  INPUT.cursor = new THREE.Mesh(c_geo, c_mat);
  SCENE.add(INPUT.cursor);

  //setup input

  function inputEvent(e) {
    INPUT.x = ((e.clientX / window.innerWidth) - 0.5) * window.innerWidth;
    INPUT.y = ((e.clientY / window.innerHeight) - 0.5) * -window.innerHeight;
    INPUT.cursor.position.x = INPUT.x;
    INPUT.cursor.position.y = INPUT.y;
    INPUT.e = e;
    INPUT.last = Date.now();
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
    //return false;
  }

  //setup audio

  var audioElement = document.getElementById("song");

  audioElement.addEventListener("canplay", function() {
    var source = context.createMediaElementSource(audioElement);
    var analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);
  });

  //start

  loop();

}

////////////////////////////////
// MAIN LOOP
////////////////////////////////

function loop(time) {

  requestAnimationFrame(loop);

  TWEEN.update(time);

  //render

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
