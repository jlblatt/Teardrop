EFFECTS.push({

  SCENE: null, CAMERA: null , RENDERER: null,

  /////////////////////////////////////////////////////////////////////////////////

  setup: function() {

    document.getElementById('help').innerHTML = "<strong>blank</strong><br />this is a starting point for custom visualizations";

    this.SCENE = new THREE.Scene();

    this.RENDERER = new THREE.WebGLRenderer();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.RENDERER.domElement);

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = 600;

  }, //setup

  destroy: function() {

    document.body.removeChild(this.RENDERER.domElement);

  }, //destroy

  input: function(e) {

  }, //input

  tick: function() {

    this.RENDERER.render(this.SCENE, this.CAMERA);

  }, //tick

  beat: function() {

  }, //beat

  resize: function() {

    this.RENDERER.setSize(window.innerWidth, window.innerHeight);

    this.CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    this.CAMERA.position.z = 600;
    this.CAMERA.updateProjectionMatrix();
    
  } //resize
  
});
