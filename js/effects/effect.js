EFFECTS['effectname'] = {

  HEIGHT: 32,
  WIDTH: 32,
  SIZE: 54,
  EQ: [],
  CONTROLS: null,

  setup: function() {
    
    _newAnalyser(this.WIDTH * 2);

    CAMERA = new THREE.PerspectiveCamera(75, WINX / WINY, 1, 100000);
    CAMERA.position.z = this.SIZE * this.WIDTH;

    this.CONTROLS = new THREE.OrbitControls(CAMERA, RENDERER.domElement);
    
    for(var i = -this.WIDTH; i < this.WIDTH; i++) {

      this.EQ.push([]);
      
      for(var j = -this.HEIGHT / 2; j < this.HEIGHT / 2; j++) {
      
        var material = new THREE.MeshBasicMaterial({color: new THREE.Color(1 - ((j + this.HEIGHT / 2) / this.HEIGHT / 1.5), 1 - ((j + this.HEIGHT / 2) / this.HEIGHT / 1.5), 1), transparent: true, opacity: 0});
        var geometry = new THREE.BoxGeometry(this.SIZE, this.SIZE, this.SIZE);
        var mesh = new THREE.Mesh(geometry, material);

        material.blending = THREE.AdditiveBlending;

        mesh.position.x = (i * this.SIZE * 1.35);
        mesh.position.y = (j * this.SIZE * 1.35);

        SCENE.add(mesh);
        this.EQ[this.EQ.length - 1].push(mesh);

      }

    }

  }, //setup

  input: function() {
  
  },

  tick: function() {

    this.CONTROLS.update();

    for(var i = 0; i < this.WIDTH * 2; i++) {

      for(var j = 0; j < this.HEIGHT; j++) {

        var lvl = j / this.HEIGHT;
        var mat = this.EQ[i][j].material;

        if(FD[Math.abs(i - this.WIDTH)] / 256 > lvl) {
          mat.opacity = .8;
        } else {
          mat.opacity -= .2;
          if(mat.opacity < .1) {
            mat.opacity = .1;
          }
        }

      }

      var toff = this.HEIGHT / 2 + Math.floor(this.HEIGHT * 2 * (TD[i] - 128) / 128);
      if(toff < 0) toff = 0;
      if(toff > this.HEIGHT - 1) toff = this.HEIGHT - 1;

      this.EQ[i][toff].material.opacity = .8;
      
    }

  }, //tick

  resize: function() {

    CAMERA = new THREE.PerspectiveCamera(75, WINX / WINY, 1, 100000);
    CAMERA.position.z = this.SIZE * this.WIDTH;

    this.CONTROLS = new THREE.OrbitControls(CAMERA, RENDERER.domElement);

  }
  
};
