// a library containing functions used for preparing, packing, unpacking, stuff etc
// note - keep data in virtualDirectory ALWAYS UNCOMPRESSED STRINGS

var organize={
  // disseminate virtual directory into JString files, zip and download
  virtualDirectoryToDiskDirectory:function(rootObject,compressMode){
    // create folder structure
    let paths=[];
    let nA=Object.keys(rootObject);
    let vA=Object.values(rootObject);
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
  },
  // opposite of above
  // amalgamate files from disk into single object using a URIBuffer to load data
  // note - this only works with JS files that set a URIBuffer to a value.
  diskDirectoryToVirtualDirectory:function(filepaths){
    let root={};
    filepaths.forEach((each)=>{
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
    filepaths.forEach((each)=>{
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
};
