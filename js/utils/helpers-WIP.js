// various helper functions


// use for unpacking xzip files
String.prototype._=function(a,b){
  return this.replaceAll(a,b);
};
// pull from array via item
Array.prototype.pullAtItem=function(a){
  let i=this.indexOf(a);
  if(i>-1){this.splice(i,1);}
  return this;
};
// pull from arrat via index of item
Array.prototype.pullAtIndex=function(i){
  if(i>-1){this.splice(i,1);}
  return this;
};
// quick ways of setting, getting, and removing custom properties
Element.prototype.setprop=function(property,value){
  if(value===undefined){
    this.setAttribute("data-"+property,"");
  }else{
    this.setAttribute("data-"+property,value);
  }
  return this;
};
Element.prototype.getprop=function(property){
  return this.getAttribute("data-"+property);
};
Element.prototype.hasprop=function(property){
  if(this.hasAttribute("data-"+property)){
    return true;
  }else{
    return false;
  }
};
Element.prototype.delprop=function(property){
  this.removeAttribute("data-"+property);
  return this;
}




// variable to hold data passed from js files containing data URIs
var URIBuffer="";

// load and run a script
function loadScript(filepath,callback){
  let s=document.createElement("script");
  s.src=filepath;
  page.appendChild(s);
  s.onload=()=>{
    callback(s);
  };
  s.onerror=()=>{
    console.log(`script not found -- "${filepath}"`);
    callback(s);
  };
}

// create and run a script with a string of code
function loadScriptAsString(string){
  let s=document.createElement("script");
  s.innerText=string;
  page.appendChild(s);
  s.remove();
}

// load any file into the URI buffer
function loadResource(filepath,callback){
  if(directoryMode==="virtualDirectory"){
    let pathString=filepath.replace("js/rsc","virtualDirectory").replace(".js","").replaceAll("/",".");
    callback(eval(pathString));
  }else if(directoryMode==="diskDirectory"){
    let s=document.createElement("script");
    s.src=filepath;
    page.appendChild(s);
    s.onload=()=>{
      callback(URIBuffer);
      URIBuffer=null;
      s.remove();
    };
    s.onerror=()=>{
      console.log(`resource not found -- "${filepath};URIBuffer set to null."`);
      callback("");
      URIBuffer=null;
      s.remove();
    };
  }
}





// helper function for starting a download
function initializeDownload(dataURL,downloadName){
  let a=document.createElement("a");
  a.href=dataURL;
  a.download=downloadName;
  page.appendChild(a);
  a.click();
  a.remove();
}

function printScreen(){
  initializeDownload(ren.src);
}




// helpers library
var helpers={
  
  // conversion helpers
  toDegrees:function(n){return n*0.0174533;},
  toRadians:function(n){return n*57.2958;},
  rgbToHex:function(r,g,b){
    let rFloat=r/255;
    let gFloat=g/255;
    let bFloat=b/255;
    let color=new $.Color(rFloat,gFloat,bFloat);
    return "#"+color.getHexString();
  },
  stringToBinary:function(s){
    let output="";
    for(let i=0;i<s.length;i++){
      output+=(0b100000000+s[i].charCodeAt(0)).toString(2).substring(1)/*+" "*/;
    }
    return output;
  },
  binaryToString:function(s){
    let binString="";
    s.match(/.{1,8}/g).map((bin)=>{
      binString+=String.fromCharCode(parseInt(bin,2));
    });
    return binString;
  },



  // math helpers
  getRandomIntegerLessThan(max){
    return Math.floor(Math.random()*max);
  },


  
  // 3d helpers
  setFogColor:function(r,g,b){
    if(scene.fog){
      let color=rgbToHex(r,g,b);
      scene.fog=new $.Fog(color,fogNear,fogFar);
    }
  },
  meshUtils:{
    box:(subdivisions)=>{
      let s=subdivisions;
      let mesh=new $.Mesh(new $.BoxGeometry(1,1,1,s,s,s),m);
      mesh.collisionList=[];
      mesh.slopeList=[];
      return mesh;
    },
    plane:(subdivisions)=>{
      let s=subdivisions;
      let mesh=new $.Mesh(new $.PlaneGeometry(1,1,s,s),m);
      mesh.collisionList=[];
      mesh.slopeList=[];
      return mesh;
    },
    sphere:()=>{
      let mesh=new $.Mesh(new $.SphereGeometry(1,32,32),m);
      mesh.collisionList=[];
      mesh.slopeList=[];
      return mesh;
    },
  },


  // light helper
  newLight:function(color,strength){
    let light   = new $.PointLight(color,strength);
    let sphere  = newSphere(new $.MeshBasicMaterial({color:color}));
    sphere.scale.set(10,10,10);
    light.add(sphere);
    if(lightSpheresVisible){
      sphere.visible=true;
    }else{
      sphere.visible=false;
    }
    return light;
  },




  // to do
  getWorldPosition:function(object){
    let v=new $.Vector3();
    object.getWorldPosition(v)
    return v;
  },
  getWorldRotation:function(object){
    let heading=0;
    let radians=0;
    let degrees=0;
    let finalMeasure=0;
    object.rotation.order="YXZ";
    heading=object.rotation.x;
    radians=heading>0?heading:(2*Math.PI)+heading;
    degrees=$.Math.radToDeg(radians);
    finalMeasure=(degrees-360)*-1;
    if(finalMeasure===-0){finalMeasure=0;}
    let x=finalMeasure;
    heading=object.rotation.y;
    radians=heading>0?heading:(2*Math.PI)+heading;
    degrees=$.Math.radToDeg(radians);
    finalMeasure=(degrees-360)*-1;
    if(finalMeasure===-0){finalMeasure=0;}
    let y=finalMeasure;
    heading=object.rotation.z;
    radians=heading>0?heading:(2*Math.PI)+heading;
    degrees=$.Math.radToDeg(radians);
    finalMeasure=(degrees-360)*-1;
    if(finalMeasure===-0){finalMeasure=0;}
    let z=finalMeasure;
    return new $.Vector3(x,y,z);
  },
  getWorldScale:function(object){
    let p=new $.Vector3();
    let q=new $.Quaternion();
    let s=new $.Vector3();
    object.matrixWorld.decompose(p,q,s);
    return new $.Vector3(s.x,s.y,s.z);
  },
  worldRotateX:function(object,degrees){
    object.rotation.x+=(degrees*-0.0174533);
    if(this.getWorldRotation(object).x>=360){object.rotation.x=deg(0);}
    if(this.getWorldRotation(object).x<0){object.rotation.x+=(360*-0.0174533);}
  },
  worldRotateY:function(object,degrees){
    object.rotation.y+=(degrees*-0.0174533);
    if(this.getWorldRotation(object).y>=360){object.rotation.y=deg(0);}
    if(this.getWorldRotation(object).y<0){object.rotation.y+=(360*-0.0174533);}
  },
  worldRotateZ:function(object,degrees){
    object.rotation.z+=(degrees*-0.0174533);
    if(this.getWorldRotation(object).z>=360){object.rotation.z=deg(0);}
    if(this.getWorldRotation(object).z<0){object.rotation.z+=(360*-0.0174533);}
  },
  resetWorldRotation:function(object){
    let worldRotation=this.getWorldRotation(object);
    // reset world rotation by rotating negative values of world rotation
    this.worldRotateX(object,worldRotation.x*-1);
    this.worldRotateY(object,worldRotation.y*-1);
    this.worldRotateZ(object,worldRotation.z*-1);
  },
  setWorldRotation:function(object,xDegrees,yDegrees,zDegrees){
    this.resetWorldRotation(object);
    this.worldRotateX(object,xDegrees);
    this.worldRotateY(object,yDegrees);
    this.worldRotateZ(object,zDegrees);
  },
  resetWorldPosition:function(object){
    let parent=object.parent;
    scene.attach(object);
    object.position.set(0,0,0);
    parent.attach(object);
  },
  setWorldPosition:function(object,x,y,z){
    let parent=object.parent;
    scene.attach(object);
    object.position.set(x,y,z);
    parent.attach(object);
  },
  worldTranslateX:function(object,globalDist){
    let worldPos=this.getWorldPosition(object);
    this.setWorldPosition(
      object,
      worldPos.x+globalDist,
      worldPos.y,
      worldPos.z,
    );
  },
  worldTranslateY:function(object,globalDist){
    let worldPos=this.getWorldPosition(object);
    this.setWorldPosition(
      object,
      worldPos.x,
      worldPos.y+globalDist,
      worldPos.z,
    );
  },
  worldTranslateZ:function(object,globalDist){
    let worldPos=this.getWorldPosition(object);
    this.setWorldPosition(
      object,
      worldPos.x,
      worldPos.y,
      worldPos.z+globalDist,
    );
  },
  // WIP
  drawRelationshipLine:function(a,b){
    let posA=this.getWorldPosition(a);
    let posB=this.getWorldPosition(b);
    let arrowStart=new $.Vector3(posA.x,posA.y,posA.z);
    let arrowEnd=new $.Vector3(posB.x,posB.y,posB.z);
    let points=[];
    points.push(arrowStart,arrowEnd);
    let material=new $.LineBasicMaterial( { color: 0x0000ff } );
    let geom=new $.BufferGeometry().setFromPoints(points);
    let line=new $.Line(geom,material);
    return line;
  },
  // distance culling
  visibilityDistanceCull:function(object){
    let pos=new $.Vector3(
      this.getWorldPosition(object).x,
      this.getWorldPosition(object).y,
      this.getWorldPosition(object).z,
    );
    if(camera.position.distanceTo(pos)>cullDistance){
      object.visible=false;
    }else{
      object.visible=true;
    }
  },
  // todo - version of distance culling that
  // culls the entire reference from the file
  // so it must be reloaded from the disk
  // when in view again (ideally)
  dataDistanceCull:function(object){},






  // misc/experimental helpers
  guessUsername=function(){
    let getUrl=window.location.href.replace("file:","");
    let rootDir=getUrl.match(/.:\/(.+?)\/(.+?)\//)[0];
    let driveLetter=rootDir[0];
    if(driveLetter==="C"){
      let subpath=rootDir.match(/Users\/(.+?)\//)[0];
      let uname=subpath.replace("Users","").replaceAll("/","");
      return uname;
    }else{
      return "";
    }
  },
  generateUUID:function(){
    let dt=new Date().getTime();
    let uuid="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(c)=>{
      let r=(dt+Math.random()*16)%16|0;
      dt=Math.floor(dt/16);
      return (c=="x"?r:(r&0x3|0x8)).toString(16);
    });
    return uuid;
  },
  generatePlayerID:function(){
    let name=this.guessUsername();
    if(name.length===0){name="guest";}
    let uuid=generateUUID();
    return name+"~~"+uuid;
  },
  sendMessage:function(messageText,toWindow){
    toWindow.postMessage(messageText,"*");
  },
  messageListen:function(revieverWindow,callback){
    revieverWindow.addEventListener("message",function(e){
      let messageText=e.data;
      callback(messageText);
    });
  },
  // create a custom console if a browser hasn't debug mode
  createCustomConsole:function(){
    console.stdlog=console.log.bind(console);
    console.logs=[];
    console.log=function(){
      console.logs.push(Array.from(arguments));
      console.stdlog.apply(console,arguments);
    };
    let div=document.createElement("div");
    div.style.position="fixed";
    div.style.bottom="0";
    page.appendChild(div);
    setInterval(()=>{
      let plist=[];
      console.logs.forEach((each)=>{
        plist.push(`<br style="border-width:0px;">`+each);
      });
      div.innerHTML=plist;
    });
  },
  // load string of content from a css file
  loadLinkedTextContent:function(filepath,selectorslist,callback){
    let link=document.createElement("link");
    link.rel="stylesheet";
    link.href=filepath;
    page.appendChild(link);
    link.onload=()=>{
      let clist=[];
      selectorslist.forEach((each)=>{
        let p=document.createElement("p");
        p.id=each.replace("#","");
        page.appendChild(p);
        let c=getComputedStyle(document.querySelector(each)).getPropertyValue("content");
        c=c.substring(1,c.length-1);
        c=c.replaceAll("\\","");
        c=c.replaceAll("//","");
        clist.push(c);
        p.remove();
      });
      link.remove();
      callback(clist);
    };
  },
};




var font={

  // set up font
  // usually define these before running renderTextLine function
  color       : "black"   , // html color || hex color || rgb() || rgba()
  family      : "arial"   , // arial || verdana || etc
  size        : "12px"    , // px || pt || etc
  style       : "normal"  , // normal || italic || oblique
  variant     : "normal"  , // normal || small-caps
  weight      : "normal"  , // normal || bold
  top         : "12",
  left        : "0",

  // webgl stuff

  webGLFontKerning        : 1.00,
  webGLFontKerningEnabled : false,

};