EFFECTS.push({

  SCENE: null, CAMERA: null , RENDERER: null,

  FFT: 128,

  WAVEFORMS: [],

  BEAT: false,
  BT: Date.now(),

  /////////////////////////////////////////////////////////////////////////////////

  setup: function() {

    document.getElementById('help').innerHTML = "<strong>wav</strong>";

    this.SCENE = new THREE.Scene();

    this.RENDERER = new THREE.WebGLRenderer();
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
      w.position.x += w.dx;
      w.position.y += w.dy;
      w.position.z += w.dz;
      w.material.opacity *= w.do;
      if(w.material.opacity < .02) {
        this.SCENE.remove(w);
        this.WAVEFORMS.splice(i, 1);
      }
    }

    if(this.BEAT) {

      for(var i = -2; i < 2; i += .2) {

        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({color: new THREE.Color(1, 1, 1), transparent: true});

        for(var j = 0; j < TD.length; j++) {
          geometry.vertices.push(new THREE.Vector3(12 * (j - (TD.length / 2)), 10 * (TD[j] - 128) + i, 0));
        }

        var mesh = new THREE.Line(geometry, material);

        mesh.position.z = 250;
        mesh.material.opacity = 1;
        mesh.dx = 0;
        mesh.dy = 0;
        mesh.dz = 12;
        mesh.do = .99;
        this.BEAT = false;

        this.SCENE.add(mesh);
        this.WAVEFORMS.push(mesh);

      }

    }

    else {

      var geometry = new THREE.Geometry();
      var material = new THREE.LineBasicMaterial({color: new THREE.Color(1, 1, 1), transparent: true});

      for(var i = 0; i < TD.length; i++) {
        geometry.vertices.push(new THREE.Vector3(16 * (i - (TD.length / 2)), 10 * (TD[i] - 128), 0));
      }

      var mesh = new THREE.Line(geometry, material);

      mesh.dx = Math.random() - .5;
      mesh.dy = Math.random() - .5;
      mesh.dz = Math.random() - .5;
      mesh.do = .97;
      mesh.material.opacity = 150 / (Date.now() - this.BT);
      if(mesh.material.opacity > .8) mesh.material.opacity = .8;

      this.SCENE.add(mesh);
      this.WAVEFORMS.push(mesh);

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
