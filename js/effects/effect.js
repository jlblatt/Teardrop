EFFECTS['effectname'] = {

  HEIGHT: 8,
  WIDTH: 32,
  SIZE: 54,
  EQ: [],

  setup: function() {
    
    _newAnalyser(this.WIDTH);

    CAMERA = new THREE.PerspectiveCamera(75, WINX / WINY, 1, 10000);
    
    for(var i = -this.WIDTH / 2; i < this.WIDTH / 2; i++) {

      this.EQ.push([]);
      
      for(var j = -this.HEIGHT / 2; j < this.HEIGHT / 2; j++) {
      
        var material = new THREE.MeshBasicMaterial({color: 0xddddff, transparent: true, opacity: .8});

        var geometry = new THREE.BoxGeometry(this.SIZE, this.SIZE, this.SIZE);

        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = (i * this.SIZE * 1.35);
        mesh.position.y = (j * this.SIZE * 1.35);

        SCENE.add(mesh);
        this.EQ[this.EQ.length - 1].push(mesh);

      }

    }

  }, //setup

  input: function() {
    //console.log(this.EQ);
    //console.log(INPUT.x + ' *** ' + INPUT.y);
    CAMERA.position.z = (INPUT.y * this.SIZE * 8) + this.SIZE * 24;
  },

  tick: function() {

    for(var i = -AUDIODATA.length; i < AUDIODATA.length; i++) {

      // for(var j = 0; j < AUDIODATA)

      
    }

  }, //tick

  resize: function() {

    CAMERA = new THREE.PerspectiveCamera(75, WINX / WINY, 1, 10000);

  }
  
};
