var camera, scene, renderer, composer;
var object, light;
var glitchPass, audio, analyser,frequencyData;
var materials =  [];
init();
animate();
audio.play();
function updateOptions() {
var wildGlitch = document.getElementById('wildGlitch');
glitchPass.goWild=false;
}
function init() {
var text2 = document.createElement('div');
text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
text2.style.width = 100;
text2.style.height = 100;
text2.style.color = "white";
text2.innerHTML = "hi there!";
text2.style.top = 200 + 'px';
text2.style.left = 200 + 'px';
document.body.appendChild(text2);
var ctx = new AudioContext();
audio = document.getElementById('music');
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
    var plane = new THREE.Mesh( geometry2, material2 );
    // plane.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
    // plane.position.multiplyScalar( Math.random() * 400 );
    // plane.scale.x = plane.scale.y = plane.scale.z = Math.random() * 50;
    object.add(plane);


        var loader = new THREE.TextureLoader();
        loader.load('sprite.png',
         function(texture){
           material2 = texture;
           console.log("GOT SPRITE")
         });
        // load a resource
        loader.load(
          // resource URL
          'uh.png',
          // Function when resource is loaded
          function ( texture ) {
            console.log("GOT IT")
            // do something with the texture
            material = new THREE.MeshBasicMaterial( {
              map: texture
            } );
            plane.material = material;
          },
          // Function called when download progresses
          function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
          },
          // Function called when download errors
          function ( xhr ) {
            console.log( 'An error happened' );
          }
        );

// postprocessing
composer = new THREE.EffectComposer( renderer );
composer.addPass( new THREE.RenderPass( scene, camera ) );
glitchPass = new THREE.GlitchPass(1000);
glitchPass.renderToScreen = true;
glitchPass.goWild = true;
composer.addPass( glitchPass );
//
window.addEventListener( 'resize', onWindowResize, false );
updateOptions();

document.addEventListener('keydown',onDocumentKeyDown,false);
function onDocumentKeyDown(event){
  console.log("key");
  plane.material = material2;
}
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
var time = Date.now();
// object.rotation.x += 0.005;
// object.rotation.y += 0.01;
composer.render();
//renderer.render(scene, camera);
}
