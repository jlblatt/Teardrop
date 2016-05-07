EFFECTS.push({

  FFT: 128,

  POINTS: [],

  LINES: null,
  LINESMESH: null,

  K_STATES: [null, 4, 6, 8, 10],
  K_STATE: 0,

  ROTATION: 0,

  analyser: function() {

    _newAnalyser(this.FFT, .5);

  }, //analyser

  setup: function() {

    document.getElementById('help').innerHTML = "<strong>first contact</strong><br />arrow up/down to cycle kaleidoscopes<br />arrow left/right to cycle colors<br />click to change rotation";

    this.analyser();

    CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    CAMERA.position.z = 2000;

    //circles

    for(var i = -(this.FFT / 2) + .5; i < this.FFT / 2; i++) {

      var material = new THREE.MeshBasicMaterial({color: new THREE.Color(.2, .2, .2)});
      var geometry = new THREE.CircleGeometry(1, 64);
      var mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (i * this.FFT) / 2;

      SCENE.add(mesh);
      this.POINTS.push(mesh);
    }

    //lines

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({color: new THREE.Color(1, 1, 1)});

    for(var i = -(this.FFT  / 2) + .5; i < this.FFT / 2; i++) {
      geometry.vertices.push(new THREE.Vector3((i * this.FFT) / 2, 0 , -10));
    }

    var mesh = new THREE.Line(geometry, material);
    SCENE.add(mesh);
    this.LINES = geometry;
    this.LINESMESH = mesh;
    
  }, //setup

  destroy: function() {

    for(var i = 0; i < this.POINTS.length; i++) {
      SCENE.remove(this.POINTS[i]);
    }

    this.POINTS = [];

    SCENE.remove(this.LINES);
    this.LINES = null;

    SCENE.remove(this.LINESMESH);
    this.LINESMESH = null;

    COMPOSER = null;

  }, //destroy

  input: function(x, y, e) {

    //kaleidoscopes

    if(e.which == 38) this.K_STATE++;
    else if(e.which == 40) this.K_STATE--;

    if(this.K_STATE < 0) this.K_STATE = this.K_STATES.length - 1;
    if(this.K_STATE > this.K_STATES.length - 1) this.K_STATE = 0;

    COMPOSER = null;

    if(this.K_STATES[this.K_STATE]) {
      COMPOSER = new THREE.EffectComposer(RENDERER);
      COMPOSER.addPass(new THREE.RenderPass(SCENE, CAMERA));

      var kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
      kaleidoPass.uniforms.sides = { type: "f", value: this.K_STATES[this.K_STATE] };
      kaleidoPass.uniforms.angle = { type: "f", value: 0 }
      kaleidoPass.renderToScreen = true;

      COMPOSER.addPass(kaleidoPass);
    }

    //rotations

    if(e.type == "click" && e.which == 1 && this.K_STATES[this.K_STATE]) {
      this.ROTATION++;
      if(this.ROTATION > 3) {
        this.ROTATION = 0;
      }
    }

  }, //input

  tick: function() {

    var i = this.POINTS.length;
    for(var i = 0; i < this.POINTS.length; i++) {
      var fd = FD[Math.abs(i - this.FFT / 2)];
      if(this.POINTS[i].scale.x < fd) this.POINTS[i].scale.x = fd * 2.5;
      if(this.POINTS[i].scale.y < fd) this.POINTS[i].scale.y = fd * 2.5;
      var newscalex = this.POINTS[i].scale.x < 0 ? 0 : this.POINTS[i].scale.x * .97;
      var newscaley = this.POINTS[i].scale.y < 0 ? 0 : this.POINTS[i].scale.y * .97;
      this.POINTS[i].scale.x = newscalex;
      this.POINTS[i].scale.y = newscaley;
      this.POINTS[i].material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
    }

    if(!this.LINES) return;

    this.LINESMESH.material.color = new THREE.Color(Math.random(), Math.random(), Math.random());

    for(var i = 0; i < this.LINES.vertices.length; i++) {
      var td = TD[i] - 128;
      this.LINES.vertices[i].setY(td * 25);
    }

    this.LINES.verticesNeedUpdate = true;

    if(this.ROTATION && COMPOSER) {
      COMPOSER.passes[1].uniforms.angle.value += this.ROTATION / 60;
    }

  }, //tick

  beat: function() {

  }, //beat

  resize: function() {

    CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    CAMERA.position.z = 2000;
    
    this.LINES.verticesNeedUpdate = true;

  } //resize
  
});
