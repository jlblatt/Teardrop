EFFECTS.push({

  SCENE: null, CAMERA: null, RENDERER: null, COMPOSER: null,

  FFT: 128,

  POINTS: [],

  LINES: null,
  LINESMESH: null,

  ROTATION: 0,

  K_STATES: [null, 4, 6, 8, 10],
  K_PTR: 0,

  THEMES: [
    [0x001111, 0x002222, 0x003333, 0x004444, 0x005555, 0x006666, 0x007777, 0x008888, 0x009999, 0x00aaaa, 0x00bbbb, 0x00cccc, 0x00dddd, 0x00eeee, 0x00ffff, 0x00eeee, 0x00dddd, 0x00cccc, 0x00bbbb, 0x00aaaa, 0x009999, 0x008888, 0x007777, 0x006666, 0x005555, 0x004444, 0x003333, 0x002222, 0x001111],
    [0x111111, 0x333333, 0x555555, 0x777777, 0x999999, 0xbbbbbb, 0xdddddd],
    [0xFFC30D, 0xFFC30D, 0xFFC30D, 0x000000],
    []
  ],
  T_PTR: 0,

  BLENDS: [
    { blend: THREE.NoBlending, opacity: 1 },
    { blend: THREE.NormalBlending, opacity: .8 },
    { blend: THREE.AdditiveBlending, opacity: .8 }
  ],
  B_PTR: 0,

  APPLY_THEME: function() {

    var cq = [];

    for(var i = 0; i < this.THEMES[this.T_PTR].length; i++) {
      cq.push(new THREE.Color(this.THEMES[this.T_PTR][i]));
    }

    for(var i = 0; i < this.POINTS.length; i++) {
      this.POINTS[i].colorQueue = cq.slice();
      if(cq.length> 0) {
        var c = cq.shift();
        cq.push(c);
      }
    }

    this.LINESMESH.colorQueue = cq.slice();

    this.beat();
    
  },

  APPLY_BLEND: function() {
    for(var i = 0; i < this.POINTS.length; i++) {
      this.POINTS[i].material.blending = this.BLENDS[this.B_PTR].blend;
      this.POINTS[i].material.opacity = this.BLENDS[this.B_PTR].opacity;
    }

  },

  /////////////////////////////////////////////////////////////////////////////////

  analyser: function() {

    _newAnalyser(this.FFT, .5);

  }, //analyser

  setup: function() {

    this.SCENE = new THREE.Scene();

    this.RENDERER = new THREE.WebGLRenderer();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.RENDERER.domElement);

    document.getElementById('help').innerHTML = "<strong>first contact</strong><br />number keys to change theme color<br />arrow up/down to cycle kaleidoscopes<br />arrow left/right to cycle blend modes<br />right shift to change rotation";

    this.analyser();

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = 2000;

    //circles

    for(var i = -(this.FFT / 2) + .5; i < this.FFT / 2; i++) {

      var material = new THREE.MeshBasicMaterial({transparent: true, opacity: 1});
      var geometry = new THREE.CircleGeometry(1, 64);
      var mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (i * this.FFT) / 2;

      this.SCENE.add(mesh);
      this.POINTS.push(mesh);
    }

    //lines

    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({transparent: true, opacity: 1});

    for(var i = -(this.FFT  / 2) + .5; i < this.FFT / 2; i++) {
      geometry.vertices.push(new THREE.Vector3((i * this.FFT) / 2, 0 , -10));
    }

    var mesh = new THREE.Line(geometry, material);
    this.SCENE.add(mesh);
    this.LINES = geometry;
    this.LINESMESH = mesh;

    this.APPLY_THEME();
    this.APPLY_BLEND();
    
  }, //setup

  destroy: function() {

    for(var i = 0; i < this.POINTS.length; i++) {
      this.SCENE.remove(this.POINTS[i]);
    }

    this.POINTS = [];

    this.SCENE.remove(this.LINES);
    this.LINES = null;

    this.SCENE.remove(this.LINESMESH);
    this.LINESMESH = null;

    this.COMPOSER = null;

    document.body.removeChild(this.RENDERER.domElement);

  }, //destroy

  input: function(e) {

    //keys

    if(e.type == "keydown") {

      //colors

      if(e.which >= 49 && e.which <= (49 + this.THEMES.length - 1)) {
        this.T_PTR = e.which - 49;
        this.APPLY_THEME();

      } else if(e.which >= 97 && e.which <= (97 + this.THEMES.length - 1)) {
        
        this.T_PTR = e.which - 97;
        this.APPLY_THEME();

      }

      //blends

      if(e.which == 37 || e.which == 39) {

        if(e.which == 39) this.B_PTR++;
        else if(e.which == 37) this.B_PTR--;

        if(this.B_PTR < 0) this.B_PTR = this.BLENDS.length - 1;
        if(this.B_PTR > this.BLENDS.length - 1) this.B_PTR = 0;

        this.APPLY_BLEND();

      }

      //kaleidoscopes

      if(e.which == 38 || e.which == 40) {

        if(e.which == 38) this.K_PTR++;
        else if(e.which == 40) this.K_PTR--;

        if(this.K_PTR < 0) this.K_PTR = this.K_STATES.length - 1;
        if(this.K_PTR > this.K_STATES.length - 1) this.K_PTR = 0;

        this.COMPOSER = null;

        if(this.K_STATES[this.K_PTR]) {
          this.COMPOSER = new THREE.EffectComposer(this.RENDERER);
          this.COMPOSER.addPass(new THREE.RenderPass(this.SCENE, this.CAMERA));

          var kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
          kaleidoPass.uniforms.sides = { type: "f", value: this.K_STATES[this.K_PTR] };
          kaleidoPass.uniforms.angle = { type: "f", value: 0 }
          kaleidoPass.renderToScreen = true;

          this.COMPOSER.addPass(kaleidoPass);
        }

      }

      //rotations
    
      if(e.which == 16 && this.K_STATES[this.K_PTR]) {
        this.ROTATION++;
        if(this.ROTATION > 3) {
          this.ROTATION = 0;
        }
      }

    }

  }, //input

  tick: function() {

    if(this.ROTATION && this.COMPOSER) {
      this.COMPOSER.passes[1].uniforms.angle.value += this.ROTATION / 100;
    }

    for(var i = 0; i < this.POINTS.length; i++) {
      var fd = FD[Math.abs(i - this.FFT / 2)];

      if(this.POINTS[i].scale.x < fd) this.POINTS[i].scale.x = fd * 2.5;
      if(this.POINTS[i].scale.y < fd) this.POINTS[i].scale.y = fd * 2.5;
      var newscalex = this.POINTS[i].scale.x < 0.1 ? 0.1 : this.POINTS[i].scale.x * .97;
      var newscaley = this.POINTS[i].scale.y < 0.1 ? 0.1 : this.POINTS[i].scale.y * .97;
      this.POINTS[i].scale.x = newscalex;
      this.POINTS[i].scale.y = newscaley;
    }

    if(!this.LINES) return;

    for(var i = 0; i < this.LINES.vertices.length; i++) {
      var td = TD[i] - 128;
      this.LINES.vertices[i].setY(td * 25);
    }

    this.LINES.verticesNeedUpdate = true;

    if(this.COMPOSER) this.COMPOSER.render();
    else this.RENDERER.render(this.SCENE, this.CAMERA);

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

    if("colorQueue" in this.LINESMESH && this.LINESMESH.colorQueue.length > 0) {
      var c = this.LINESMESH.colorQueue.shift();
      this.LINESMESH.material.color = c;
      this.LINESMESH.colorQueue.push(c);
    } else {
      this.LINESMESH.material.color = new THREE.Color(Math.random(), Math.random(), Math.random());
    }

  }, //beat

  resize: function() {

    this.RENDERER.setSize(window.innerWidth, window.innerHeight);
    if(this.COMPOSER) this.COMPOSER.setSize(window.innerWidth, window.innerHeight);

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = 2000;
    this.CAMERA.updateProjectionMatrix();
    
    this.LINES.verticesNeedUpdate = true;

  } //resize
  
});
