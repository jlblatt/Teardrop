EFFECTS.push({

  SCENE: null, CAMERA: null , RENDERER: null, 

  FFT: 64,

  TICK: 0, CLOCK: new THREE.Clock(true),

  PARTICLE_SYSTEM: null,

  /////////////////////////////////////////////////////////////////////////////////

  setup: function() {

    document.getElementById('help').innerHTML = "<strong>smattering</strong>";

    this.SCENE = new THREE.Scene();

    this.RENDERER = new THREE.WebGLRenderer();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.RENDERER.domElement);

    this.CAMERA = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    this.CAMERA.position.z = 100;

    this.PARTICLE_SYSTEM = new THREE.GPUParticleSystem({ maxParticles: 1000 });
    this.SCENE.add(this.PARTICLE_SYSTEM);

  }, //setup

  destroy: function() {

    document.body.removeChild(this.RENDERER.domElement);

  }, //destroy

  input: function(e) {

  }, //input

  tick: function(t) {

    var delta = this.CLOCK.getDelta();

    this.TICK += delta;

    if(this.TICK < 0) this.TICK = 0;

    if(delta > 0) {

      if(delta > 1) delta = 1;

      for(var i = 0; i < 5; i++) {
        this.PARTICLE_SYSTEM.spawnParticle({
          positionRandomness: 150,
          velocityRandomness: 0,
          colorRandomness: 1,
          turbulence: 0,
          lifetime: 4,
          size: 200,
          sizeRandomness: 1000
        });
      }

    } // delta > 0

    this.PARTICLE_SYSTEM.update(this.TICK);

    this.RENDERER.render(this.SCENE, this.CAMERA);

  }, //tick

  beat: function() {

    for(var i = 0; i < 100; i++) {
      this.PARTICLE_SYSTEM.spawnParticle({
        positionRandomness: 150,
        velocity: new THREE.Vector3(0, 0, -2),
        velocityRandomness: 0,
        color: 0xffffff,
        turbulence: 0,
        lifetime: 1,
        size: 200,
        sizeRandomness: 1000
      });
    }

  }, //beat

  resize: function() {

    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    this.CAMERA = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    this.CAMERA.position.z = 100;
    this.CAMERA.updateProjectionMatrix();
    
  } //resize
  
});
