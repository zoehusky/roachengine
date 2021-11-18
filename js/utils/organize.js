// a library containing functions used for preparing, packing, unpacking, stuff etc
// note - keep data in virtualDirectory ALWAYS UNCOMPRESSED STRINGS


// use this to condense long JSON BufferGeometry files by
// rounding the vertex coords
// note - returns a plaintext dataURL
function jsonRounder(jsonString){
  let object=JSON.parse(jsonString);
  let roundValue=(n)=>Math.round(n*1e5)/1e5;
  let roundedPositions=[];
  let roundedNormals=[];
  let roundedUVs=[];
  object.data.attributes.position.array.forEach((each)=>{
    roundedPositions.push(roundValue(each));
  });
  object.data.attributes.normal.array.forEach((each)=>{
    roundedNormals.push(roundValue(each));
  });
  if("uv" in object.data.attributes){
    object.data.attributes.uv.array.forEach((each)=>{
      roundedUVs.push(roundValue(each));
    });
  }
  object.data.attributes.position.array=roundedPositions;
  object.data.attributes.normal.array=roundedNormals;
  if("uv" in object.data.attributes){
    object.data.attributes.uv.array=roundedUVs;
  }
  delete object.data.boundingSphere;
  // create and return a new JSON string as a data url
  return "data:,"+JSON.stringify(object);
}




function diskDirectoryToVirtualDirectory(filepathsList){
  let root={};
  filepathsList.forEach((each)=>{
    // create structure
    let path=each.split("/");
    let current=root;
    while(path.length>0){
      if(!current[path[0]]){
        current[path[0]]={};
      }
      current=current[path[0]];
      path.shift();
    }
  });
  filepathsList.forEach((each)=>{
    let path=each.split("/");
    // if file
    let end=path[path.length-1];
    if(end.match(/\.(.+)/)){
      let file=end;
      // if js file
      if(file.match(".js")){
        let tempScript=document.createElement("script");
        tempScript.src=each;
        // get data from buffer as string
        let data=URIBuffer;
        // turn filepath into object path
        eval("root."+each.replaceAll("/",".").replaceAll(".js","=data"));
      }
    }
  });
  return root;
}


// disseminate virtual directory into JS String files, zip and download
Object.prototype.virtualDirectoryToDiskDirectory=function(compressMode){
  // create folder structure
  let paths=[];
  let nA=Object.keys(this);
  let vA=Object.values(this);
  vA.forEach((eachA,A)=>{if(typeof eachA==="object"){
    paths.push(nA[A]);
    let nB=Object.keys(eachA);
    let vB=Object.values(eachA);
    vB.forEach((eachB,B)=>{if(typeof eachB==="object"){
      paths.push(nA[A]+"/"+nB[B]);
      let nC=Object.keys(eachB);
      let vC=Object.values(eachB);
      vC.forEach((eachC,C)=>{if(typeof eachC==="object"){
        paths.push(nA[A]+"/"+nB[B]+"/"+nC[C]);
        let nD=Object.keys(eachC);
        let vD=Object.values(eachC);
        vD.forEach((eachD,D)=>{if(typeof eachD==="object"){
          paths.push(nA[A]+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]);
          let nE=Object.keys(eachD);
          let vE=Object.values(eachD);
          vE.forEach((eachE,E)=>{if(typeof eachE==="object"){
            paths.push(nA[A]+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+"/"+nE[E]);
            let nF=Object.keys(eachE);
            let vF=Object.values(eachE);
            vF.forEach((eachF,F)=>{if(typeof eachF==="object"){
              paths.push(nA[A]+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+"/"+nE[E]+"/"+nF[F]);
              let nG=Object.keys(eachF);
              let vG=Object.values(eachF);
              vG.forEach((eachG,G)=>{if(typeof eachG==="object"){
                paths.push(nA[A]+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+"/"+nE[E]+"/"+nF[F]+"/"+nG[G]);
                let nH=Object.keys(eachG);
                let vH=Object.values(eachG);
                vH.forEach((eachH,H)=>{if(typeof eachH==="object"){
                  paths.push(nA[A]+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+"/"+nE[E]+"/"+nF[F]+"/"+nG[G]+"/"+nH[H]);
                }else if(typeof eachH==="string"){
                  paths.push(String(nA[A])+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+"/"+nE[E]+"/"+nF[F]+"/"+nG[G]+"/"+nH[H]+".js >> "+vH[H]);
                }});
              }else if(typeof eachG==="string"){
                paths.push(String(nA[A])+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+"/"+nE[E]+"/"+nF[F]+"/"+nG[G]+".js >> "+vG[G]);
              }});
            }else if(typeof eachF==="string"){
              paths.push(String(nA[A])+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+"/"+nE[E]+"/"+nF[F]+".js >> "+vF[F]);
            }});
          }else if(typeof eachE==="string"){
            paths.push(String(nA[A])+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+"/"+nE[E]+".js >> "+vE[E]);
          }});
        }else if(typeof eachD==="string"){
          paths.push(String(nA[A])+"/"+nB[B]+"/"+nC[C]+"/"+nD[D]+".js >> "+vD[D]);
        }});
      }else if(typeof eachC==="string"){
        paths.push(String(nA[A])+"/"+nB[B]+"/"+nC[C]+".js >> "+vC[C]);
      }});
    }else if(typeof eachB==="string"){
      paths.push(String(nA[A])+"/"+nB[B]+".js >> "+vB[B]);
    }});
  }else if(typeof eachA==="string"){
    paths.push(String(nA[A])+".js >> "+vA[A]);
  }});
  // split paths into paths that end in folders and files
  let folders=[];
  let files=[];
  paths.forEach((each)=>{
    if(each.match(".js >> ")){
      files.push(each);
    }else{
      folders.push(each);
    }
  });
  // start zippin'
  let zip=new JStringZip();
  // create folders
  folders.forEach((each)=>{
    zip.folder(each);
  });
  files.forEach((each)=>{
    let pair=each.split(" >> ");
    let filePathAndName=pair[0];
    let fileData="URIBuffer=\""+pair[1]
      .replaceAll("\n","")
      .replaceAll("\\","\\\\")
      .replaceAll("\"","\\\"")+"\";";
    if(compressMode){
      let data=xzip.zip(pair[1]
        .replaceAll("\n","")
        .replaceAll("\\","\\\\")
        .replaceAll("\"","\\\""));
      if(!data.startsWith("data:")){
        fileData="URIBuffer="+data+";";
      }else{
        fileData="URIBuffer=\""+data+"\";";
      }
    }
    console.log(fileData);
    zip.file(filePathAndName,fileData);
  });
  // after iteration, generate zip and download
  zip.generateAsync({type:"blob"}).then(function(content){
    let r=new FileReader();
    r.readAsDataURL(content);
    r.onload=e=>{
      let output=e.target.result;
      let tempA=document.createElement("a");
      tempA.href=output;
      tempA.download="";
      tempA.click();
      tempA.remove();
    }
  });
};


// zip files with any extension
Object.prototype.zipAndDownload=function(){
  // run only if jszip is present
  if(document.querySelector("script[src*='jszip']")===null){
    let s=document.createElement("script");
    s.src="js/libs/jszip.js";
    page.appendChild(s);
    s.onload=()=>{
      init();
    };
  }else{
    init();
  }
  let dataURLToZipFile=(zip,name,input,parentDirectory)=>{
    let dataURL=input;
    let mimeType="";
    mimeType=dataURL.match(/data:(.+?),/)[0].replace("data:","").replace(/;(.+)/,"");
    let isBase64=false;
    if(dataURL.match("base64,")!==null){
      isBase64=true;
    }
    let fileExtension=".txt";
    if(mimeType===""||mimeType===null||mimeType===undefined){
      console.log("no mimetype detected, defaulting to plaintext");
      fileExtension=".txt";
    }else{
      if      (mimeType==="text/plain")   { fileExtension=".txt";   }
      else if (mimeType==="image/webp")   { fileExtension=".webp";  }
      else if (mimeType==="audio/mpeg")   { fileExtension=".mp3";   }
      else if (mimeType==="file/mpeg")    { fileExtension=".mpeg";  }
      else if (mimeType==="font/truetype"){ fileExtension=".ttf";   }
      else {console.log("mimetype not recognized, defaulting to plaintext");}
    }
    let fileName=name+fileExtension;
    let fileData=dataURL.replace(/(.+?),/,"");
    zip.file(
      parentDirectory+fileName,
      fileData,
      {base64:isBase64},
    );
  };
  // init function
  let init=()=>{
    let zip=new JSZip();
    // iterate through folder structure (limit of 8 deep)
    for(let i=0;i<Object.keys(topObject).length;i++){
      let name      = Object.keys(topObject)[i];
      let contents  = Object.values(topObject)[i];
      if(typeof contents!=="object"){
        dataURLToZipFile(zip,name,contents,"");
      }else{
        zip.folder(name);
        let _0folder=contents;
        let _0folderName=name+"/";
        for(let i=0;i<Object.keys(_0folder).length;i++){
          let name1      = Object.keys(_0folder)[i];
          let contents1  = Object.values(_0folder)[i];
          if(typeof contents1!=="object"){
            dataURLToZipFile(zip,name1,contents1,_0folderName);
          }else{
            zip.folder(_0folderName+name1);
            let _1folder=contents1;
            let _1folderName=_0folderName+name1+"/";
            for(let i=0;i<Object.keys(_1folder).length;i++){
              let name2      = Object.keys(_1folder)[i];
              let contents2  = Object.values(_1folder)[i];
              if(typeof contents2!=="object"){
                dataURLToZipFile(zip,name2,contents2,_1folderName);
              }else{
                zip.folder(_1folderName+name2);
                let _2folder=contents2;
                let _2folderName=_1folderName+name2+"/";
                for(let i=0;i<Object.keys(_2folder).length;i++){
                  let name3     = Object.keys(_2folder)[i];
                  let contents3 = Object.values(_2folder)[i];
                  if(typeof contents3!=="object"){
                    dataURLToZipFile(zip,name3,contents3,_2folderName);
                  }else{
                    zip.folder(_2folderName+name3);
                    let _3folder=contents3;
                    let _3folderName=_2folderName+name3+"/";
                    for(let i=0;i<Object.keys(_3folder).length;i++){
                      let name4     = Object.keys(_3folder)[i];
                      let contents4 = Object.values(_3folder)[i];
                      if(typeof contents4!=="object"){
                        dataURLToZipFile(zip,name4,contents4,_3folderName);
                      }else{
                        zip.folder(_3folderName+name4);
                        let _4folder=contents4;
                        let _4folderName=_3folderName+name4+"/";
                        for(let i=0;i<Object.keys(_4folder).length;i++){
                          let name5     = Object.keys(_4folder)[i];
                          let contents5 = Object.values(_4folder)[i];
                          if(typeof contents5!=="object"){
                            dataURLToZipFile(zip,name5,contents5,_4folderName);
                          }else{
                            zip.folder(_4folderName+name5);
                            let _5folder=contents5;
                            let _5folderName=_4folderName+name5+"/";
                            for(let i=0;i<Object.keys(_5folder).length;i++){
                              let name6     = Object.keys(_5folder)[i];
                              let contents6 = Object.values(_5folder)[i];
                              if(typeof contents6!=="object"){
                                dataURLToZipFile(zip,name6,contents6,_5folderName);
                              }else{
                                zip.folder(_5folderName+name6);
                                let _6folder=contents6;
                                let _6folderName=_5folderName+name6+"/";
                                for(let i=0;i<Object.keys(_6folder).length;i++){
                                  let name7     = Object.keys(_6folder)[i];
                                  let contents7 = Object.values(_6folder)[i];
                                  if(typeof contents7!=="object"){
                                    dataURLToZipFile(zip,name7,contents7,_6folderName);
                                  }else{
                                    zip.folder(_6folderName+name7);
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // after iteration, generate zip and download
    zip.generateAsync({type:"blob"}).then(function(content){
      let r=new FileReader();
      r.readAsDataURL(content);
      r.onload=e=>{
        let output=e.target.result;
        let tempA=document.createElement("a");
        tempA.href=output;
        tempA.download="";
        tempA.click();
        tempA.remove();
      }
    });
  };
};