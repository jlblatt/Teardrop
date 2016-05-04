EFFECTS.push({

  NAME: "dev",
  FFT: 128,

  POINTS: [],

  LINES: [],
  

  COLORCYCLE: function(c) {
    return c;
  },

  setup: function() {

    _newAnalyser(this.FFT, .5);

    CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    CAMERA.position.z = 2400;

    for(var i = -(this.FFT / 2) + .5; i < this.FFT / 2; i++) {

      var material = new THREE.MeshBasicMaterial({color: new THREE.Color(1, 1, 1)});
      var geometry = new THREE.CircleGeometry(1, 64);
      var mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (i * this.FFT) / 2;

      SCENE.add(mesh);
      this.POINTS.push(mesh);
    }

    //shaders

    COMPOSER = new THREE.EffectComposer(RENDERER);
    COMPOSER.addPass(new THREE.RenderPass(SCENE, CAMERA));

    var kaleidoPass = new THREE.ShaderPass(THREE.KaleidoShader);
    kaleidoPass.renderToScreen = true;

    COMPOSER.addPass(kaleidoPass);
    
  }, //setup

  destroy: function() {

    for(var i = 0; i < this.POINTS.length; i++) {
      SCENE.remove(this.POINTS[i]);
    }

    this.POINTS = [];

    COMPOSER = null;

  }, //destroy

  input: function() {

  }, //input

  tick: function() {

    var i = this.POINTS.length;
    for(var i = 0; i < this.POINTS.length; i++) {
      var fd = FD[Math.abs(i - this.FFT / 2)];
      if(this.POINTS[i].scale.x < fd) this.POINTS[i].scale.x = fd * 3;
      if(this.POINTS[i].scale.y < fd) this.POINTS[i].scale.y = fd * 3;
      var newscalex = this.POINTS[i].scale.x < 0 ? 0 : this.POINTS[i].scale.x * .98;
      var newscaley = this.POINTS[i].scale.y < 0 ? 0 : this.POINTS[i].scale.y * .98;
      this.POINTS[i].scale.x = newscalex;
      this.POINTS[i].scale.y = newscaley;
      var newcolor = this.COLORCYCLE(this.POINTS[i].material.color);
      this.POINTS[i].material.color = newcolor ? newcolor : {r: 1, g: 1, b: 1}; 
    }

  }, //tick

  beat: function() {

  }, //beat

  resize: function() {

    CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    CAMERA.position.z = 2400;
    
  } //resize
  
});
