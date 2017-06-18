var camera, scene, renderer, composer;
var object, light;
var plane;
var glitchPass, audio, analyser,frequencyData;
var materials =  [];

// Start audio first
audio = document.getElementById('music');
audio.play();
//Init our scene
init();
// Kick off animate loop
animate();

function init() {
  var ctx = new AudioContext();
  var audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();

  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);
  // frequencyBinCount tells you how many values you'll receive from the analyser
  frequencyData = new Uint8Array(analyser.frequencyBinCount);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  //
  camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 300;
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x000000, 1, 1000 );
  object = new THREE.Object3D();
  scene.add( object );

  var geometry2 = new THREE.PlaneGeometry( 80, 50, 0 );
  var material2 = new THREE.MeshBasicMaterial({color: 0x2194ce});
  plane = new THREE.Mesh( geometry2, material2 );
  // plane.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
  // plane.position.multiplyScalar( Math.random() * 400 );
  // plane.scale.x = plane.scale.y = plane.scale.z = Math.random() * 50;
  loadTextures();

  // postprocessing
  composer = new THREE.EffectComposer( renderer );
  composer.addPass( new THREE.RenderPass( scene, camera ) );
  glitchPass = new THREE.GlitchPass(1000);
  glitchPass.renderToScreen = true;
  composer.addPass( glitchPass );

  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  composer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  analyser.getByteFrequencyData(frequencyData);
  requestAnimationFrame( animate );
  composer.render();
}

function loadTextures() {
  var loader = new THREE.TextureLoader();
  var doneCount = 0;
  for(var i = 1; i < 12; i++) {
    loader.load('assets/' + i + '.jpg',
     function(texture){
       material = new THREE.MeshBasicMaterial( {
         map: texture
       } );
       materials.push(material);
       if(++doneCount == 11){
         plane.material = material;
         object.add(plane);
       }
     });
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function tester() {
  var test = getRandomInt(1,11);
  plane.material = materials[test];
}

setInterval(tester, Math.random() * (7500 - 5000) + 5000);
