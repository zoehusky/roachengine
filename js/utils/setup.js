// global variables

var pixelSize           = 4.0;
var numColors           = 32;
var logicFPS            = 60;
var renderFPS           = 30;
var cullDistance        = 2048;
var compression         = true;
var globalMipmaps       = false;
var worldGravityFactor  = 30;
var jumpHeight          = 80;
var fogEnabled          = true;
var fogNear             = 300;
var fogFar              = 2100;
var fontRenderingEngine = "html";  /* can be either html || webgl*/

fpsLogicSlider.addEventListener("input",()=>{
  logicFPS=fpsLogicSlider.value;
});
fpsRenderSlider.addEventListener("input",()=>{
  renderFPS=fpsRenderSlider.value;
});

/* debug stuff */
var textLineWireframes  = false; 
var lightSpheresVisible = false;
var bonesVisible        = true;
var collisionVisible    = true;
var BGMTest             = false;
var debugGamePad        = false;

var editMode            = false;
var productionMode      = true;


if(editMode){
  fogEnabled          = false;
  compression         = false;
  numColors           = 255;
  globalMipmaps       = true;
  collisionVisible    = true;
  lightSpheresVisible = true;
}

if(productionMode){
  editMode=false;
  fogEnabled=true;
  compression=true;
  bonesVisible=false;
  numColors=32;
  globalMipmaps=false;
  collisionVisible=false;
  lightSpheresVisible=false;
}


if(globalMipmaps){numColors=255;}
if(!fogEnabled){fogNear=fogFar=9999;}




/* global lists (needed for helpers) */
var distanceCullingList = [];
var collisionList       = [];
var slopeList           = [];

/* loaders */
const texloader=new $.TextureLoader();
const geomloader=new $.BufferGeometryLoader();
const fontloader=new $.FontLoader();

/* scene setup (you will need these for some of the helpers) */
const canvas      = document.querySelector("#game");
const scene       = new $.Scene();
const camera      = new $.PerspectiveCamera(50,4/3,0.1,9999);
const renderer    = new $.WebGLRenderer({
  alpha:true,
  antialias:false,
  canvas:canvas
});


const camera2     = new $.PerspectiveCamera(50,4/3,0.1,9999);
camera2.position.set(1000,1000,1000);
camera2.lookAt(new $.Vector3(0,0,0));


/* hex color shorcuts for readability */
const colors={
  red           : 0xff0000,
  orange        : 0xff8000,
  yellow        : 0xffff00,
  green         : 0x00ff00,
  blue          : 0x0000ff,
  violet        : 0x8000ff,
  magenta       : 0xff00ff,
  white         : 0xffffff,
  black         : 0x000000,
  gray          : 0x808080,
  chartreuse    : 0xdfff00,
  goldenrod     : 0xffbf00,
  emergency     : 0xff5f15,
  peach         : 0xff7f50,
  cherry        : 0xde3163,
  saltwater     : 0x9fe2bf,
  turquoise     : 0x40e0d0,
  lavender      : 0x6495ed,
  saffron       : 0xccccff,
  skyblue       : 0x82c8ff,
  lightskyblue  : 0xc8e6ff,
  offblack      : 0x28282b,
  offwhite      : 0xfff5ee,
};


/* global caches to store data from disk (set as null first) as variables */
var fontCache       = null;
var geometryCache   = null;
var imageCache      = null;
var soundCache      = null;


/* define fog first */
scene.fog=new $.Fog(0xffffff,fogNear,fogFar);

/* leave undefined first, then define at start of runtime script */
var own;