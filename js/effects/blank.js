EFFECTS.push({

  NAME: "blank",

  setup: function() {

    _newAnalyser(1024, .5);

    CAMERA = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    CAMERA.position.z = 600;

  }, //setup

  destroy: function() {

  }, //destroy

  input: function() {

  }, //input

  tick: function() {

  }, //tick

  beat: function() {

  }, //beat

  resize: function() {
    
  } //resize
  
});
