EFFECTS.push({

  SCENE: null, CAMERA: null , RENDERER: null, 

  FFT: 64,

  TICK: 0, CLOCK: new THREE.Clock(true),

  PARTICLE_SYSTEM: null,

  /////////////////////////////////////////////////////////////////////////////////

  setup: function() {

    document.getElementById('help').innerHTML = "<strong>blank (with particles)</strong><br />this is a starting point for custom visualizations";

    this.SCENE = new THREE.Scene();

    this.RENDERER = new THREE.WebGLRenderer();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.RENDERER.domElement);

    this.CAMERA = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    this.CAMERA.position.z = 100;

    this.PARTICLE_SYSTEM = new THREE.GPUParticleSystem();
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

      this.PARTICLE_SYSTEM.spawnParticle({
        position: new THREE.Vector3(),
        //positionRandomness: 100,
        positionRandomness: 0,
        velocity: new THREE.Vector3(),
        velocityRandomness: 2,
        color: 0xffffff,
        colorRandomness: 1,
        turbulence: 0,
        lifetime: 5,
        size: 20,
        sizeRandomness: 50
      });

    } // delta > 0

    this.PARTICLE_SYSTEM.update(this.TICK);

    this.RENDERER.render(this.SCENE, this.CAMERA);

  }, //tick

  beat: function() {

  }, //beat

  resize: function() {

    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    this.CAMERA = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    this.CAMERA.position.z = 100;
    this.CAMERA.updateProjectionMatrix();
    
  } //resize
  
});
