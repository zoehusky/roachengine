/* /js/utils.js */
(function(){
  
  // use for unpacking xzip files
  String.prototype._=function(a,b){
    return this.replaceAll(a,b);
  };

  // replace at an index in a string
  String.prototype.replaceAt=function(index,replacement){
    if(index>=this.length){
      return this.valueOf();
    }
    return this.substring(0,index)+replacement+this.substring(index+1);
  }

  // pull from array via item
  Array.prototype.pullAtItem=function(a){
    let i=this.indexOf(a);
    if(i>-1){this.splice(i,1);}
    return this;
  };

  // pull from array via index of item
  Array.prototype.pullAtIndex=function(i){
    if(i>-1){this.splice(i,1);}
    return this;
  };

  // input degrees > output radians
  window.deg=function(n){
    return n*0.0174533;
  }

  // input radians > output degrees
  window.rad=function(n){
    return n*57.2958;
  }

  // owner funcs
  Element.prototype.setprop=function(property,value){
    if(value===undefined){
      this.setAttribute("data-"+property,"");
    }else{
      this.setAttribute("data-"+property,value);
    }
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
  };

  // new utils code
  window.utils={
    xZip:{

      allCharacters:"01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()-_=+<>?|/:{}[]., ;'`\t\v\f\b".match(/.{1,1}/g),
      
      getMostCommonItem:function(itemsArray){
        // count occurences in array
        let counts={};
        for(let n of itemsArray){
          counts[n]=counts[n]?counts[n]+1:1;
        }
        // reorder counts by value size
        let sortable=[];
        for(let n in counts){
          sortable.push([n,counts[n]]);
        }
        sortable.sort(function(a,b){
          return b[1]-a[1];
        });
        // return most common
        return sortable[0];
      },
      
      getMostCommonPairing:function(bigString){
        // split string
        let pairings=bigString.match(/.{1,2}/g);
        let offsetPairings=bigString.substring(1,bigString.length-1).match(/.{1,2}/g);
        offsetPairings.forEach((each)=>{pairings.push(each)});
        let mostCommon=this.getMostCommonItem(pairings);
        // console.log(mostCommon);
        if(mostCommon[1]>1){
          return{
            pairing  : mostCommon[0],
            count    : mostCommon[1],
          };
        }
      },
      
      getUnusedCharacters:function(s){
        let legalCharacters=[];
        this.allCharacters.forEach((character)=>{
          if((s.replaceAll(character,"").length===s.length)){
            legalCharacters.push(character);
          }
        });
        return legalCharacters;
      },
      
      zip_hex:function(inputString){
        let a=LZUTF8.compress(inputString,[]);
        let hexString="";
        a.forEach((each)=>{
          let hex=each.toString(16);
          if(hex.length===0){hex="00";}
          else if(hex.length===1){hex="0"+hex;}
          hexString+=hex;
        });
        let workingString=hexString;
        let endString=")";
        let stringToReturn=()=>"utils.xZip.unzip_hex(\""+workingString+"\""+endString;
        let passThrough=(newCharacter)=>{
          if(this.getMostCommonPairing(workingString)!==undefined){
            let mostCommonPairing=this.getMostCommonPairing(workingString).pairing;
            workingString=workingString.replaceAll(mostCommonPairing,newCharacter);
            endString=`._("${newCharacter}","${mostCommonPairing}")`+endString;
          }
        };
        let listOfUnusedCharacters=this.getUnusedCharacters(hexString);
        let listOfVersions=[];
        let listOfVersionLengths=[];
        listOfUnusedCharacters.forEach((each)=>{
          listOfVersions.push(stringToReturn());
          listOfVersionLengths.push(stringToReturn().length);
          passThrough(each);
        });
        listOfVersionLengths.sort((a,b)=>a-b);
        let smallestVersionLength=listOfVersionLengths[0];
        let smallestList=[];
        listOfVersions.forEach((each)=>{
          if(each.length===smallestVersionLength){
            smallestList.push(each);
          }
        });
        return smallestList[0];
      },
    
      zip_dec:function(inputString){
        let a=LZUTF8.compress(inputString,[]);
        let decString="";
        a.forEach((each)=>{
          let dec=each.toString();
          if(dec.length===0){dec="000";}
          else if(dec.length===1){dec="00"+dec;}
          else if(dec.length===2){dec="0"+dec;}
          decString+=dec;
        });
        let workingString=decString;
        let endString=")";
        let stringToReturn=()=>"utils.xZip.unzip_dec(\""+workingString+"\""+endString;
        let passThrough=(newCharacter)=>{
          if(this.getMostCommonPairing(workingString)!==undefined){
            let mostCommonPairing=this.getMostCommonPairing(workingString).pairing;
            workingString=workingString.replaceAll(mostCommonPairing,newCharacter);
            endString=`._("${newCharacter}","${mostCommonPairing}")`+endString;
          }
        };
        let listOfUnusedCharacters=this.getUnusedCharacters(decString);
        let listOfVersions=[];
        let listOfVersionLengths=[];
        listOfUnusedCharacters.forEach((each)=>{
          listOfVersions.push(stringToReturn());
          listOfVersionLengths.push(stringToReturn().length);
          passThrough(each);
        });
        listOfVersionLengths.sort((a,b)=>a-b);
        let smallestVersionLength=listOfVersionLengths[0];
        let smallestList=[];
        listOfVersions.forEach((each)=>{
          if(each.length===smallestVersionLength){
            smallestList.push(each);
          }
        });
        return smallestList[0];
      },
    
      zip_raw:function(inputString){
        // note - doing this automatically gets rid of newlines/cr's
        // avoid having those in the inputString
        inputString=inputString
          .replaceAll("\\","\\\\")
          .replaceAll("\"","\\\"")
          .replaceAll("\n","")
          .replaceAll("\r","")
        ;
        let workingString=inputString;
        let endString="";
        let stringToReturn=()=>"\""+workingString+"\""+endString;
        let passThrough=(newCharacter)=>{
          /* get most common 2 letter pairing for this pass */
          if(this.getMostCommonPairing(workingString)!==undefined){
            let mostCommonPairing=this.getMostCommonPairing(workingString).pairing;
            workingString=workingString.replaceAll(mostCommonPairing,newCharacter);
            endString=`._("${newCharacter}","${mostCommonPairing}")`+endString;
          }
        };
        let listOfUnusedCharacters=this.getUnusedCharacters(inputString);
        let listOfVersions=[];
        let listOfVersionLengths=[];
        listOfUnusedCharacters.forEach((each)=>{
          listOfVersions.push(stringToReturn());
          listOfVersionLengths.push(stringToReturn().length);
          passThrough(each);
        });
        listOfVersionLengths.sort((a,b)=>a-b);
        let smallestVersionLength=listOfVersionLengths[0];
        let smallestList=[];
        listOfVersions.forEach((each)=>{
          if(each.length===smallestVersionLength){
            smallestList.push(each);
          }
        });
        return smallestList[0];
      },
      
      unzip_hex:function(inputString){
        let a=inputString.match(/.{1,2}/g);
        let b=[];
        a.forEach((each)=>{
          b.push(parseInt(each,16));
        });
        return LZUTF8.decompress(new Uint8Array(b),[]);
      },
      
      unzip_dec:function(inputString){
        let a=inputString.match(/.{1,3}/g);
        return LZUTF8.decompress(new Uint8Array(a),[]);
      },
    
      // automatically finds best compression method
      // will return original string if ineffective
      zip:function(inputString){
        let method0=inputString;
        let method1=this.zip_hex(inputString);
        let method2=this.zip_dec(inputString);
        let method3=this.zip_raw(inputString);
        let versions=[
          method0,
          method1,
          method2,
          method3,
        ];
        let lengths=[
          method0.length,
          method1.length,
          method2.length,
          method3.length,
        ];
        lengths.sort((a,b)=>a-b);
        let smallestVersionLength=lengths[0];
        let smallestList=[];
        versions.forEach((each)=>{
          if(each.length===smallestVersionLength){
            smallestList.push(each);
          }
        });
        return smallestList[0];
      },
    },// end of xZip

    initializeDownload:function(dataURL,downloadName){
      let a=document.createElement("a");
      a.href=dataURL;
      a.download=downloadName;
      page.appendChild(a);
      a.click();
      a.remove();
    },
    printScreen(){
      this.initializeDownload(ren.src);
    },

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
    getRandomIntegerLessThan(max){
      return Math.floor(Math.random()*max);
    },

    // misc/experimental helpers
    guessUsername:function(){
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
      if(name.length===0){
        name="<guest-"+this.generateUUID()+">";
      }
      return name;
    },
    sendMessage:function(messageText,toWindow){
      toWindow.postMessage(messageText,"*");
    },
    messageListen:function(receiverWindow,callback){
      let f=(e)=>{
        let messageText=e.data;
        callback(messageText);
        receiverWindow.removeEventListener("message",f);
      };
      receiverWindow.addEventListener("message",f);
    },
    sendSelfToOpener:function(){
      this.sendMessage("<!DOCTYPE html>"+page.outerHTML,(window.opener||window.parent));
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

    getAllComments:function(){
      var comments=[];
      var filterNone=()=>NodeFilter.FILTER_ACCEPT;
      // Fourth argument, which is actually obsolete according to the DOM4 standard, is required in IE 11
      var iterator=document.createNodeIterator(document,NodeFilter.SHOW_COMMENT,filterNone,false);
      var curNode;
      while(curNode=iterator.nextNode()){
        comments.push(curNode);
      }
      return comments;
    },

    getTaggedComment:function(tagName){
      let comments=this.getAllComments();
      let returnedComment=null;
      comments.forEach((each)=>{
        let commentString="<!--"+each.textContent.toString()+"-->";
        let matches=commentString.match(/\/\*(.+)\*\//);
        if(matches!==null){
          let firstMatch=matches[0];
          let commentID=firstMatch.substring(2,firstMatch.length-2);
          if(commentID===tagName){
            returnedData=commentString;
          }
        }
      });
      return returnedComment;
    },

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


    // 3d helpers
    setFogColor:function(r,g,b){
      if(scene.fog){
        let color=this.rgbToHex(r,g,b);
        scene.fog=new $.Fog(color,globals.fogNear,globals.fogFar);
      }
    },
    newLight:function(color,strength){
      let light   = new $.PointLight(color,strength);
      let sphere  = this.sphere(new $.MeshBasicMaterial({color:color}));
      sphere.scale.set(10,10,10);
      light.add(sphere);
      if(globals.collisionVis){
        sphere.visible=true;
      }else{
        sphere.visible=false;
      }
      return light;
    },
    // WIP
    drawRelationshipLine:function(a,b){
      let posA=getWorldPosition(a);
      let posB=getWorldPosition(b);
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
        transform.getWorldPosition(object).x,
        transform.getWorldPosition(object).y,
        transform.getWorldPosition(object).z,
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
    diskDistanceCull:function(object){},

    box:(subdivisions)=>{
      let s=subdivisions;
      let mesh=new $.Mesh(new $.BoxGeometry(1,1,1,s,s,s));
      mesh.collisionList=[];
      mesh.slopeList=[];
      return mesh;
    },
    plane:(subdivisions)=>{
      let s=subdivisions;
      let mesh=new $.Mesh(new $.PlaneGeometry(1,1,s,s));
      mesh.collisionList=[];
      mesh.slopeList=[];
      return mesh;
    },
    sphere:()=>{
      let mesh=new $.Mesh(new $.SphereGeometry(1,32,32));
      mesh.collisionList=[];
      mesh.slopeList=[];
      return mesh;
    },

    //
    //
    // new stuff

    getThisCodeLine:function(){
      let errStack=(new Error).stack.toString();
      let lines=errStack.split("\n");
      let lastLine=lines[lines.length-1].match(/:\d(.+)/)[0];
      let lineNumber=lastLine.replace(":","").replace(/:(.+)/,"");
      let characterNumber=lastLine.replace(/:(.+):/,"");
      return [lineNumber,characterNumber];
    },
    analyzeObject:function(object){
      let props=Object.getOwnPropertyNames(Object.getPrototypeOf(object)),result={};
      for(let i=0;i<props.length;i++){
        result[props[i]]=window.navigator[props[i]];
      }
      return result;
    },


    // get parent directory of top html doc
    getMainWindowParentDirectory:function(){
      let path=window.location.href;
      let fileName=path.replace(/(.+)\//,"");
      return path.replace(fileName,"");
    },

    //get file name where code is executed
    getCurrentFileName:function(){
      let errStack=(new Error).stack.toString();
      let lines=errStack.split("\n");
      let lastLine=lines[lines.length-1];
      let lineNumber=lastLine.match(/:\d(.+)/)[0];
      let filePath=lastLine.replace(/(.+)at /,"").replace(lineNumber,"");
      filePath="/"+filePath.replace(window.root,"");
      return filePath;
    },


    getOS:function(){
      var userAgent=window.navigator.userAgent,
          platform=window.navigator.platform,
          macosPlatforms=["Macintosh","MacIntel","MacPPC","Mac68K"],
          windowsPlatforms=["Win32","Win64","Windows","WinCE"],
          iosPlatforms=["iPhone","iPad","iPod"],
          os=null;
      if(macosPlatforms.indexOf(platform)!==-1){
        os="Mac OS";
      }else if(iosPlatforms.indexOf(platform)!==-1){
        os="iOS";
      }else if(windowsPlatforms.indexOf(platform)!==-1){
        os="Windows";
      }else if(/Android/.test(userAgent)){
        os="Android";
      }else if(!os&&/Linux/.test(platform)){
        os="Linux";
      }
      return os;
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