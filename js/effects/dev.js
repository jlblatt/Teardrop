EFFECTS.push({

  FFT: 128,

  POINTS: [],

  LINES: null,
  LINESMESH: null,

  K_STATES: [null, 4, 6, 8, 10],
  K_PTR: 0,

  ROTATION: 0,

  THEMES: [
    [0x333333, 0x666666, 0x999999, 0xcccccc],
    [0x000000, 0x001111, 0x002222, 0x003333, 0x004444, 0x005555, 0x006666, 0x007777, 0x008888, 0x009999, 0x00aaaa, 0x00bbbb, 0x00cccc, 0x00dddd, 0x00eeee, 0x00ffff, 0xfffff],
    []
  ],

  T_PTR: 0,

  APPLY_THEME: function() {

    var cq = [];

    for(var i = 0; i < this.THEMES[this.T_PTR].length; i++) {
      cq.push(new THREE.Color(this.THEMES[this.T_PTR][i]));
    }

    for(var i = 0; i < this.POINTS.length; i++) {
      this.POINTS[i].colorQueue = cq;
      if(cq.length> 0) {
        var c = cq.shift();
        cq.push(c);
      }
    }

    this.LINESMESH.colorQueue = cq;

    this.beat();
    
  },

  /////////////////////////////////////////////////////////////////////////////////

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

    this.APPLY_THEME();
    
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

    //keys

    if(e.type == "keydown") {

      //colors

      if(e.which == 37 || e.which == 39) {

        if(e.which == 39) this.T_PTR++;
        else if(e.which == 37) this.T_PTR--;

        if(this.T_PTR < 0) this.T_PTR = this.THEMES.length - 1;
        if(this.T_PTR > this.THEMES.length - 1) this.T_PTR = 0;

        this.APPLY_THEME();

      }

      //kaleidoscopes

      if(e.which == 38 || e.which == 40) {

        if(e.which == 38) this.K_PTR++;
        else if(e.which == 40) this.K_PTR--;

        if(this.K_PTR < 0) this.K_PTR = this.K_STATES.length - 1;
        if(this.K_PTR > this.K_STATES.length - 1) this.K_PTR = 0;

        COMPOSER = null;

        if(this.K_STATES[this.K_PTR]) {
          COMPOSER = new THREE.EffectComposer(RENDERER);
          COMPOSER.addPass(new THREE.RenderPass(SCENE, CAMERA));

          var kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
          kaleidoPass.uniforms.sides = { type: "f", value: this.K_STATES[this.K_PTR] };
          kaleidoPass.uniforms.angle = { type: "f", value: 0 }
          kaleidoPass.renderToScreen = true;

          COMPOSER.addPass(kaleidoPass);
        }

      }

    }
    
    //mouse

    if(e.type == "click") {

      //rotations
    
      if(e.which == 1 && this.K_STATES[this.K_PTR]) {
        this.ROTATION++;
        if(this.ROTATION > 3) {
          this.ROTATION = 0;
        }
      }

    }

  }, //input

  tick: function() {

    if(this.ROTATION && COMPOSER) {
      COMPOSER.passes[1].uniforms.angle.value += this.ROTATION / 100;
    }

    for(var i = 0; i < this.POINTS.length; i++) {
      var fd = FD[Math.abs(i - this.FFT / 2)];
      if(this.POINTS[i].scale.x < fd) this.POINTS[i].scale.x = fd * 2.5;
      if(this.POINTS[i].scale.y < fd) this.POINTS[i].scale.y = fd * 2.5;
      var newscalex = this.POINTS[i].scale.x < 0 ? 0 : this.POINTS[i].scale.x * .97;
      var newscaley = this.POINTS[i].scale.y < 0 ? 0 : this.POINTS[i].scale.y * .97;
      this.POINTS[i].scale.x = newscalex;
      this.POINTS[i].scale.y = newscaley;
    }

    if(!this.LINES) return;

    for(var i = 0; i < this.LINES.vertices.length; i++) {
      var td = TD[i] - 128;
      this.LINES.vertices[i].setY(td * 25);
    }

    this.LINES.verticesNeedUpdate = true;

  }, //tick

  beat: function() {

    for(var i = 0; i < this.POINTS.length; i++) {
      if("colorQueue" in this.POINTS[i]) {
        if(this.POINTS[i].colorQueue.length > 0) {
          this.POINTS[i].material.color = this.POINTS[i].colorQueue[0];
          var c = this.POINTS[i].colorQueue.shift();
          this.POINTS[i].colorQueue.push(c);
        } else {
          this.POINTS[i].material.color = new THREE.Color(Math.random(), Math.random(), Math.random());  
        }
      }
    }

    if(!this.LINES) return;

    if(this.LINESMESH.colorQueue.length > 0) {
      this.LINESMESH.material.color = this.LINESMESH.colorQueue[0];
      var c = this.LINESMESH.colorQueue.shift();
      this.LINESMESH.colorQueue.push(c);
    } else {
      this.LINESMESH.material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
    }

  }, //beat

  resize: function() {

    CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    CAMERA.position.z = 2000;
    
    this.LINES.verticesNeedUpdate = true;

  } //resize
  
});
