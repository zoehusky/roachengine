/* /js/newMaterial.js */
(function(){
  window.newMaterial={
    // materials generated using my hand-coded shaders:
    basicFlat:function(texture){
      let unifs={
        texsampler  : { type:"t",value:null},
        numcols     : { value:globals.numColors       },
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
      if(!globals.mipmapsEnabled){
        if(texture!==null){
          texture.generateMipmaps=false;
          texture.minFilter=texture.magFilter=$.NearestFilter;
        }
      }
      newMaterial.shaderType="basicFlat";
      newMaterial.uniforms.texsampler.value=texture;
      return newMaterial;
    },
    basicLit:function(texture){
      let unifs=$.UniformsUtils.merge([$.UniformsLib.lights,{
        lightIntensity  : { type:"f",value:1.0    },
        texsampler      : { type:"t",value:null},
        numcols         : { value:globals.numColors       },
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
      if(!globals.mipmapsEnabled){
        if(texture!==null){
          texture.generateMipmaps=false;
          texture.minFilter=texture.magFilter=$.NearestFilter;
        }
      }
      newMaterial.shaderType="basicLit";
      newMaterial.uniforms.texsampler.value=texture;
      return newMaterial;
    },
    specialFlat:function(texture){
      let unifs={
        texsampler  : { type:"t",value:null},
        width       : { value:320             },
        height      : { value:240             },
        pixelSize   : { value:globals.pixelSize       },
        numcols     : { value:globals.numColors       },
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
      if(!globals.mipmapsEnabled){
        if(texture!==null){
          texture.generateMipmaps=false;
          texture.minFilter=texture.magFilter=$.NearestFilter;
        }
      }
      newMaterial.shaderType="specialFlat";
      newMaterial.uniforms.texsampler.value=texture;
      return newMaterial;
    },
    specialLit:function(texture){
      let unifs=$.UniformsUtils.merge([$.UniformsLib.lights,{
        lightIntensity  : { type:"f",value:1.0    },
        texsampler      : { type:"t",value:null},
        width           : { value:320             },
        height          : { value:240             },
        pixelSize       : { value:globals.pixelSize       },
        numcols         : { value:globals.numColors       },
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
      if(!globals.mipmapsEnabled){
        if(texture!==null){
          texture.generateMipmaps=false;
          texture.minFilter=texture.magFilter=$.NearestFilter;
        }
      }
      newMaterial.shaderType="specialLit";
      newMaterial.uniforms.texsampler.value=texture;
      return newMaterial;
    },
    // materials generated using Three's built-in engine
    wireframe:function(color){
      return new $.MeshBasicMaterial({color:color,wireframe:true});
    },
    basicThreeColored:function(color){
      return new $.MeshBasicMaterial({color:color});
    },
    basicThreeTextured:function(texture){
      return new $.MeshBasicMaterial({map:texture});
    },
    basicThreeLit:function(texture){
      return new $.MeshLamberMaterial({map:texture});
    },
  };
  
  $.Object3D.prototype.recompileShaderMaterial=function(){
    if(this.material.shaderType){// check to see if has custom shader
      //get image source and shader type
      let source=this.material.uniforms.texsampler.value.image.src;
      let shaderType=this.material.shaderType;
      let transparency=this.material.transparent;
      if(shaderType==="basicFlat"){
        texLoader.load(source,(texture)=>{
          this.material=newMaterial.basicFlat(texture);
          this.material.transparent=transparency;
        });
      }else if(shaderType==="basicLit"){
        texLoader.load(source,(texture)=>{
          this.material=newMaterial.basicLit(texture);
          this.material.transparent=transparency;
        });
      }else if(shaderType==="specialFlat"){
        texLoader.load(source,(texture)=>{
          this.material=newMaterial.specialFlat(texture);
          this.material.transparent=transparency;
        });
      }else if(shaderType==="specialLit"){
        texLoader.load(source,(texture)=>{
          this.material=newMaterial.specialLit(texture);
          this.material.transparent=transparency;
        });
      }
    }
  };

  /* send self to window.scripts for compiling */
  if(!window.scripts){window.scripts=[];}
  /* get file path */
  let errStack=(new Error).stack.toString();
  let lines=errStack.split("\n");
  let lastLine=lines[lines.length-1];
  let filePath=lastLine.replace(/(.+)at /,"").replace(/js:(.+)/,"js");
  let localPath=filePath.match(/\/js(.+)/,"")[0].replace("/","");
  /* push filepath + function as string */
  scripts.push("/* /"+localPath+" */\n("+arguments.callee.toString()+")();");
})();