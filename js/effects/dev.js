EFFECTS.push({

  SCENE: null, CAMERA: null , RENDERER: null,

  FFT: 64,

  DOTS: [],

  BEAT: false,
  BT: Date.now(),

  /////////////////////////////////////////////////////////////////////////////////

  setup: function() {

    document.getElementById('help').innerHTML = "<strong>mmmmmmm</strong>";

    this.SCENE = new THREE.Scene();

    this.RENDERER = new THREE.WebGLRenderer();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.RENDERER.domElement);

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = 600;

  }, //setup

  destroy: function() {

    for(var i = 0; i < this.DOTS.length; i++) {
      this.SCENE.remove(this.DOTS[i]);
    }

    this.DOTS = [];

    document.body.removeChild(this.RENDERER.domElement);

  }, //destroy

  input: function(e) {

  }, //input

  tick: function() {

    var i = this.DOTS.length;
    while(i--) {
      var d = this.DOTS[i];
      d.position.x += d.dx * 6;
      d.position.y += d.dy * 6;
      d.position.z += d.dz * 24;
      d.material.opacity *= d.do;
      if(d.material.opacity < .02) {
        this.SCENE.remove(d);
        this.DOTS.splice(i, 1);
      }
    }

    if(this.BEAT) {

      for(var i = 0; i < TD.length; i++) {
        var geometry = new THREE.CircleGeometry(16, 32);
        var material = new THREE.MeshBasicMaterial({color: new THREE.Color(1, 1, 1), transparent: true, opacity: 1});
        var mesh = new THREE. Mesh(geometry, material);
        mesh.position.x = 32 * (i - (TD.length / 2));
        mesh.position.y = 10 * (TD[i] - 128);
        mesh.dx = Math.random() - .5;
        mesh.dy = Math.random() - .5;
        mesh.dz = Math.random() - .5;
        mesh.do = .95;
        this.SCENE.add(mesh);
        this.DOTS.push(mesh);
      }

      this.BEAT = false;

    }

    else {

      

    }

    this.RENDERER.render(this.SCENE, this.CAMERA);

  }, //tick

  beat: function() {

    this.BEAT = true;
    this.BT = Date.now();
  
  }, //beat

  resize: function() {

    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = 600;
    this.CAMERA.updateProjectionMatrix();
    
  } //resize
  
});
