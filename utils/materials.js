// materials

function newBasicFlatMaterial(texture){
  let unifs={
    texsampler  : { type:"t",value:texture},
    numcols     : { value:numColors       },
    fogColor    : { type: "c", value: scene.fog.color },
    fogNear     : { type: "f", value: scene.fog.near  },
    fogFar      : { type: "f", value: scene.fog.far   },
  };
  let vshader=GL.bfv;
  let fshader=GL.bff;
  let newMaterial=new $.ShaderMaterial({
    uniforms        : unifs     ,
    vertexShader    : vshader   ,
    fragmentShader  : fshader   ,
    transparent     : true      ,
    fog             : false     ,
  });
  return newMaterial;
}

function newBasicLitMaterial(texture){
  let unifs=$.UniformsUtils.merge([$.UniformsLib.lights,{
    lightIntensity  : { type:"f",value:1.0    },
    texsampler      : { type:"t",value:texture},
    numcols         : { value:numColors       },
    fogColor    : { type: "c", value: scene.fog.color },
    fogNear     : { type: "f", value: scene.fog.near  },
    fogFar      : { type: "f", value: scene.fog.far   },
  }]);
  let vshader=GL.blv;
  let fshader=GL.blf;
  let newMaterial=new $.ShaderMaterial({
    uniforms        : unifs   ,
    vertexShader    : vshader ,
    fragmentShader  : fshader ,
    transparent     : true    ,
    lights          : true    ,
    fog             : true    ,
  });
  return newMaterial;
}

function newSpecialFlatMaterial(texture){
  let unifs={
    texsampler  : { type:"t",value:texture},
    width       : { value:320             },
    height      : { value:240             },
    pixelSize   : { value:pixelSize       },
    numcols     : { value:numColors       },
    fogColor    : { type: "c", value: scene.fog.color },
    fogNear     : { type: "f", value: scene.fog.near  },
    fogFar      : { type: "f", value: scene.fog.far   },
  };
  let vshader=GL.cfv;
  let fshader=GL.cff;
  let newMaterial=new $.ShaderMaterial({
    uniforms        : unifs     ,
    vertexShader    : vshader   ,
    fragmentShader  : fshader   ,
    transparent     : true      ,
    fog             : true      ,
  });
  return newMaterial;
}

function newSpecialLitMaterial(texture){
  let unifs=$.UniformsUtils.merge([$.UniformsLib.lights,{
    lightIntensity  : { type:"f",value:1.0    },
    texsampler      : { type:"t",value:texture},
    width           : { value:320             },
    height          : { value:240             },
    pixelSize       : { value:pixelSize       },
    numcols         : { value:numColors       },
    fogColor    : { type: "c", value: scene.fog.color },
    fogNear     : { type: "f", value: scene.fog.near  },
    fogFar      : { type: "f", value: scene.fog.far   },
  }]);
  let vshader=GL.clv;
  let fshader=GL.clf;
  let newMaterial=new $.ShaderMaterial({
    uniforms        : unifs     ,
    vertexShader    : vshader   ,
    fragmentShader  : fshader   ,
    transparent     : true      ,
    lights          : true      ,
    fog             : true      ,
  });
  return newMaterial;
}

// basic three color material
function newThreeBasicMaterial(color){
  return new $.MeshBasicMaterial({color:color});
}

// basic three wireframe material
function newWireframeMaterial(color){
  return new $.MeshBasicMaterial({color:color,wireframe:true});
}
