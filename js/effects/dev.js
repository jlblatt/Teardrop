EFFECTS.push({

  NAME: "dev",
  FFT: 128,

  POINTS: [],

  LINES: null,
  LINESMESH: null,

  setup: function() {

    document.getElementById('help').innerHTML = "";

    _newAnalyser(this.FFT, .5);

    CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    CAMERA.position.z = 2400;

    for(var i = -(this.FFT / 2) + .5; i < this.FFT / 2; i++) {

      var material = new THREE.MeshBasicMaterial({color: new THREE.Color(.2, .2, .2)});
      var geometry = new THREE.CircleGeometry(1, 64);
      var mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (i * this.FFT) / 2;

      SCENE.add(mesh);
      this.POINTS.push(mesh);
    }

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

    if(e.type == "click") {

      if(!COMPOSER) {

        COMPOSER = new THREE.EffectComposer(RENDERER);
        COMPOSER.addPass(new THREE.RenderPass(SCENE, CAMERA));

        var kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
        kaleidoPass.uniforms['sides'] = { type: "f", value: 8.0 };
        kaleidoPass.uniforms['angle'] = { type: "f", value: (2 * Math.PI) / 16 };
        kaleidoPass.renderToScreen = true;

        COMPOSER.addPass(kaleidoPass);
      
      } else {
        
        COMPOSER = null;

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

  }, //tick

  beat: function() {

  }, //beat

  resize: function() {

    CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    CAMERA.position.z = 2400;
    
    this.LINES.verticesNeedUpdate = true;

  } //resize
  
});
