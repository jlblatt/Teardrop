EFFECTS.push({

  SCENE: null, CAMERA: null , RENDERER: null,

  FFT: 64,

  WAVEFORMS: [],

  ST: Date.now(),

  /////////////////////////////////////////////////////////////////////////////////

  setup: function() {

    document.getElementById('help').innerHTML = "<strong>starburst</strong>";

    this.SCENE = new THREE.Scene();

    this.RENDERER = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
    this.RENDERER.autoClearColor = false;
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.RENDERER.domElement);

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = 600;

  }, //setup

  destroy: function() {

    for(var i = 0; i < this.WAVEFORMS.length; i++) {
      this.SCENE.remove(this.WAVEFORMS[i]);
    }

    this.WAVEFORMS = [];

    document.body.removeChild(this.RENDERER.domElement);

  }, //destroy

  input: function(e) {

  }, //input

  tick: function() {

    var i = this.WAVEFORMS.length;
    while(i--) {
      var w = this.WAVEFORMS[i];
      w.material.opacity *= .8;
      w.material.color =  i % 10 ? new THREE.Color(0, 0, 0) : new THREE.Color(Math.random(), Math.random(), Math.random());
      if(w.material.opacity < .02) {
        this.SCENE.remove(w);
        this.WAVEFORMS.splice(i, 1);
      }
    }

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: new THREE.Color(0, 0, 0), transparent: true, opacity: .8});

    if(Date.now() - this.ST < 25000) {
      material.blending = THREE.AdditiveBlending;
    } else if(Date.now() - this.ST > 30000) {
      this.ST = Date.now();
    } else {
      material.blending = THREE.MultiplyBlending;
    }

    for(var i = 0; i < TD.length; i++) {
      geometry.vertices.push(new THREE.Vector3(40 * (i - (TD.length / 2)), 10 * (TD[i] - 128), 0));
    }

    var mesh = new THREE.Line(geometry, material);
    this.SCENE.add(mesh);
    this.WAVEFORMS.push(mesh);

    this.CAMERA.rotation.z += 1;

    this.RENDERER.render(this.SCENE, this.CAMERA);

  }, //tick

  beat: function() {

  }, //beat

  resize: function() {

    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = 600;
    this.CAMERA.updateProjectionMatrix();
    
  } //resize
  
});
