// a library to generate some textures on the fly

var generateImage={

  initializeCanvas:function(width,height){
    let c=document.createElement("canvas");
    c.width=width;
    c.height=height;
    let cx=c.getContext("2d");
    c.cx=cx;
    return c;
  },
  
  exportCanvas:function(canvas,callback){
    let dataURL=canvas.toDataURL();
    let img=new Image();
    img.src=dataURL;
    img.onload=()=>{
      callback(img.src);
    };
  },


  pixel:function(r,g,b,a,callback){
    let c=this.initializeCanvas(1,1);
    c.cx.fillStyle="rgba("+r+","+g+","+b+","+a+")";
    c.cx.fillRect(0,0,1,1);
    this.exportCanvas(c,callback);
  },

  gradient:function(startColor,endColor,callback){
    let c=this.initializeCanvas(256,1);
    let grad=c.cx.createLinearGradient(0,0,c.width,0);
    grad.addColorStop(0,startColor);
    grad.addColorStop(1,endColor);
    c.cx.fillStyle=grad;
    c.cx.fillRect(0,0,c.width,c.height);
    this.exportCanvas(c,callback);
  },

  pixelMeasuringTool:function(width,height,callback){
    let c=this.initializeCanvas(width,height);
    c.cx.fillStyle="lightblue";
    c.cx.fillRect(0,0,width,height);
    for(let ix1=0;ix1<=width;ix1++){
      for(let iy1=0;iy1<=height;iy1++){
        if(((ix1%32)===0)&&((iy1%32)===0)){
          c.cx.fillStyle="blue";
          c.cx.fillRect(ix1,iy1,16,16);
          c.cx.fillRect(ix1+16,iy1+16,16,16);
        }
        if(((ix1%2)===0)&&((iy1%2)===0)){
          c.cx.fillStyle="yellow";
          c.cx.fillRect(ix1,iy1,1,1);
          c.cx.fillRect(ix1+1,iy1+1,1,1);
        }
      }
    }
    this.exportCanvas(c,callback);
  },

  UVGrid:function(callback){
    let c=this.initializeCanvas(256,256);
    let _darkgray    = "rgb(   64,   64,   64 )";
    let _lightgray   = "rgb(  150,  150,  150 )";
    let _magenta     = "rgb(  229,   22,  177 )";
    let _purple      = "rgb(  126,   22,  229 )";
    let _blue        = "rgb(   22,   74,  229 )";
    let _cyan        = "rgb(   22,  229,  229 )";
    let _lime        = "rgb(   22,  229,   74 )";
    let _chartreuse  = "rgb(  126,  229,   22 )";
    let _orange      = "rgb(  229,  177,   22 )";
    let _red         = "rgb(  229,   22,   22 )";
    w=c.width;
    h=c.height;
    c.cx.fillStyle=_lightgray;
    c.cx.fillRect(0,0,w,h);
    c.cx.fillStyle=_darkgray;
    for(let y=0;y<8;y++){
      for(let x=0;x<8;x++){
        if(x%2===0&&y%2===0){c.cx.fillRect((w/8)*x,(h/8)*y,w/8,h/8);}
        if(x%2===1&&y%2===1){c.cx.fillRect((w/8)*x,(h/8)*y,w/8,h/8);}
      }
    }

    let makePlusSymbol=(color,startX,startY)=>{
      let x=startX+(Math.floor(w/16));
      let y=startY+(Math.floor(h/16));
      c.cx.fillStyle=color;
      c.cx.fillRect(x,y+3,1,1);
      c.cx.fillRect(x,y+2,1,1);
      c.cx.fillRect(x,y+1,1,1);
      c.cx.fillRect(x,y+0,1,1);
      c.cx.fillRect(x,y-1,1,1);
      c.cx.fillRect(x,y-2,1,1);
      c.cx.fillRect(x,y-3,1,1);
      c.cx.fillRect(x+3,y,1,1);
      c.cx.fillRect(x+2,y,1,1);
      c.cx.fillRect(x+1,y,1,1);
      c.cx.fillRect(x+0,y,1,1);
      c.cx.fillRect(x-1,y,1,1);
      c.cx.fillRect(x-2,y,1,1);
      c.cx.fillRect(x-3,y,1,1);
    }
    for(let y=0;y<15;y++){
      for(let x=0;x<15;x++){
        let s;
        if(x===0||x===14) {s=_magenta     }
        if(x===1||x===13) {s=_purple      }
        if(x===2||x===12) {s=_blue        }
        if(x===3||x===11) {s=_cyan        }
        if(x===4||x===10) {s=_lime        }
        if(x===5||x===9)  {s=_chartreuse  }
        if(x===6||x===8)  {s=_orange      }
        if(x===7)         {s=_red         }
        makePlusSymbol(s,(w/8)*(x-y),(h/8)*y);
      }
    }
    this.exportCanvas(c,callback);
  },

  SMPTETest:function(callback){
    let c=this.initializeCanvas(320,240);
    let fillBox=(
      r,g,b,left,top,width,height
    )=>{
      c.cx.fillStyle="rgba("+r+","+g+","+b+",1)";
      c.cx.fillRect(left,top,width,height);
    };
    // different bar widths:
    let wa=Math.ceil(c.width/7);
    let wb=Math.ceil((wa*5)/4);
    let wc=Math.ceil(wa/3);
    // bar heights:
    let ha=160;
    let hb=20;
    let hc=60;
    // row 1
    fillBox(  192,192,192,  wa*0,0,wa,ha   ); // white
    fillBox(  192,192,  0,  wa*1,0,wa,ha   ); // yellow
    fillBox(    0,192,192,  wa*2,0,wa,ha   ); // cyan
    fillBox(    0,192,  0,  wa*3,0,wa,ha   ); // green
    fillBox(  192,  0,192,  wa*4,0,wa,ha   ); // magenta
    fillBox(  192,  0,  0,  wa*5,0,wa,ha   ); // red
    fillBox(    0,  0,192,  wa*6,0,wa,ha   ); // blue
    // row2
    fillBox(    0,  0,192,  wa*0,ha,wa,hb   ); // blue
    fillBox(   19, 19, 19,  wa*1,ha,wa,hb   ); // dark gray
    fillBox(  192,  0,192,  wa*2,ha,wa,hb   ); // magenta
    fillBox(   19, 19, 19,  wa*3,ha,wa,hb   ); // dark gray
    fillBox(    0,192,192,  wa*4,ha,wa,hb   ); // cyan
    fillBox(   19, 19, 19,  wa*5,ha,wa,hb   ); // dark gray
    fillBox(  192,192,192,  wa*6,ha,wa,hb   ); // white
    // row3
    fillBox(    0, 33, 76,  wb*0,ha+hb,wb,hc            ); // navy blue
    fillBox(  255,255,255,  wb*1,ha+hb,wb,hc            ); // pure white
    fillBox(   50,  0,106,  wb*2,ha+hb,wb,hc            ); // violet
    fillBox(   19, 19, 19,  wb*3,ha+hb,wb,hc            ); // dark gray
    fillBox(    9,  9,  9,  (wb*4)+(wc*0)-2,ha+hb,wc,hc ); // almost black
    fillBox(   19, 19, 19,  (wb*4)+(wc*1)-2,ha+hb,wc,hc ); // dark gray
    fillBox(   29, 29, 29,  (wb*4)+(wc*2)-2,ha+hb,wc,hc ); // less dark gray
    fillBox(   19, 19, 19,  wa*6,ha+hb,wa,hc            ); // dark gray
    this.exportCanvas(c,callback);
  },

  pawprint:function(color,callback){
    let c=this.initializeCanvas(32,32);
    let groups0=[[10,370,-400,0.4],[-10,40,-30,0.4]];
    let svgString=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">`;
    let pathPrefix=`<path style="fill:${color};stroke:none" d="m `;
    groups0.forEach((each)=>{
      svgString+=`
      <g transform="rotate(${each[0]}) translate(${each[1]},${each[2]}) scale(${each[3]})">
      ${pathPrefix}-126,1038 c 22,50 15,102 -15,116 -31,14 -75,-15 -97,-65 -22,-50 -15,-102 15,-116 31,-14 75,15 97,65 z"/>
      ${pathPrefix}183,1038 c -22,50 -15,102 15,116 31,14 75,-15 97,-65 22,-50 15,-102 -15,-116 -31,-14 -75,15 -97,65 z"/>
      ${pathPrefix}6,937 c 11,54 -6,103 -39,111 -33,7 -70,-30 -81,-84 -11,-54 6,-103 39,-110 33,-7 70,30 81,84 z"/>
      ${pathPrefix}49,937 c -11,54 6,103 39,110 33,7 70,-30 81,-84 11,-54 -6,-103 -39,-110 -33,-7 -70,30 -81,84 z"/>
      ${pathPrefix}-35,1118 c -8,14 -46,60 -72,76 -26,15 -58,39 -53,93 5,53 60,76 96,74 36,-2 104,-8 153,-1 48,6 110,1 124,-49 14,-51 -17,-84 -43,-102 -25,-18 -67,-74 -80,-99 -12,-25 -78,-72 -126,9 z"/>
      </g>
      `;
    });
    svgString+=`</svg>`;
    let dataURI="data:image/svg+xml,"+svgString;
    let img=new Image();
    img.src=dataURI;
    img.onload=()=>{
      c.cx.drawImage(img,0,0,c.width,c.height);
      this.exportCanvas(c,callback);
    };
  },

  textLine_HTML:function(textString,callback){
    let c=this.initializeCanvas(320,32);
    let w=c.width;
    let h=c.height;
    c.cx.imageSmoothingEnabled=false;
    if(textLineWireframes){  // create wireframe background if applicable
      c.cx.fillStyle="CornflowerBlue";
      c.cx.strokeStyle=cx.fillStyle;
      c.cx.fillRect(0,0,    w,1); // top side
      c.cx.fillRect(w-1,0,  1,h); // right side
      c.cx.fillRect(0,h-1,  w,1); // bottom side
      c.cx.fillRect(0,0,    1,h); // left side
      c.cx.beginPath();
      c.cx.moveTo(0,0);
      c.cx.lineTo(w,h); // diagonal, top left to down right
      c.cx.stroke();
      c.cx.beginPath();
      c.cx.moveTo(0,h);
      c.cx.lineTo(w,0); // diagonal, down left to top right
      c.cx.stroke();
    }
    // style font
    c.cx.fillStyle=font.color;
    c.cx.font=`${font.style} ${font.variant} ${font.weight} ${font.size} ${font.family}`;
    // draw text
    c.cx.fillText(textString,font.left,font.top);
    // export
    this.exportCanvas(c,callback);
  },

  textLine_WEBGL:function(textString,callback){
    // load json font
    let filepath="";
    if      (font.family==="theban"             ){filepath="js/rsc/fonts/jsonURI/theban.js";              }
    else if (font.family==="timessans"          ){filepath="js/rsc/fonts/jsonURI/timessans.js";           }
    else if (font.family==="timessansbold"      ){filepath="js/rsc/fonts/jsonURI/timessansbold.js";       }
    else if (font.family==="timessansbolditalic"){filepath="js/rsc/fonts/jsonURI/timessansbolditalic.js"; }
    else if (font.family==="timessansitalic"    ){filepath="js/rsc/fonts/jsonURI/timessansitalic.js";     }
    else if (font.family==="wingdings"          ){filepath="js/rsc/fonts/jsonURI/wingdings.js";            }
    else                                         {filepath="js/rsc/fonts/jsonURI/wingdings.js";            }

    // define font material based on font.color
    let fontMaterial=newThreeBasicMaterial(font.color);
    
    // load font
    loadResource(filepath,(data)=>{
      // create temporary offscreen canvas and scene
      let c    = document.createElement("canvas");
      c.width  = 320;
      c.height = 32;
      let wordsScene      = new $.Scene();
      let wordsCamera     = new $.OrthographicCamera(-160,160,16,-16,1,1000);
      let wordsRenderer   = new $.WebGLRenderer({
        alpha     : true,
        antialias : false,
        canvas    : c,
      });
      wordsCamera.position.z= 100;
      
      // wireframes
      let wordsBGBox        = newBox(newWireframeMaterial(colors.lavender));
      wordsBGBox.position.z = -1;
      if(!textLineWireframes){ wordsBGBox.visible=false; }
      wordsBGBox.scale.set(319,31,0);
      wordsScene.add(wordsBGBox);

      // create font mesh - default kerning
      if(!font.webGLFontKerningEnabled){
        fontloader.load(data,(f)=>{
          let geometry=new $.TextGeometry(textString,{
            font    : f   	,
            size    : 12.25	,
            height  : 0   	,
          });
          let wordsMesh=new $.Mesh(geometry,fontMaterial);
          wordsMesh.position.set(-160+font.left,0,0);
          wordsScene.add(wordsMesh);
          // render the scene
          wordsRenderer.render(wordsScene,wordsCamera);
          this.exportCanvas(c,callback);
        });
      }else{
        // create font meshes - custom kerning
        // split textString into separate letters and
        // spawn each as a spearate mesh
        let distanceFromLeft    = 0;
        // let previousLetterWidth;
        let previousLetterWidth = 0;
        for(let i=0;i<textString.length;i++){
          fontloader.load(data,(f)=>{
            let geometry=new $.TextGeometry(textString[i],{
              font    : f   	,
              size    : 12.25	,
              height  : 0   	,
            });
            let letterMesh=new $.Mesh(geometry,fontMaterial);
            wordsScene.add(letterMesh);
            // get bounding box and calculate kerning
            let boundingBox=new $.Box3();
            geometry.computeBoundingBox();
            boundingBox.copy(geometry.boundingBox).applyMatrix4(letterMesh.matrixWorld);
            letterMesh.position.set(-160+font.left+distanceFromLeft,0,0);
            previousLetterWidth=boundingBox.max.x;
            if(previousLetterWidth===-Infinity){previousLetterWidth=5;}// give spaces a width
            distanceFromLeft+=Math.round(font.webGLFontKerning*(parseFloat(Math.round(previousLetterWidth+1))));
          });
        }
        wordsRenderer.render(wordsScene,wordsCamera);
        this.exportCanvas(c,callback);
      }
    });
  },
};
