// a library for compressing long data URIs and any long strings in general
// used for further compressing already minified code, JSON, etc

String._=function(a,b){
  return this.replaceAll(a,b);
}

var xzip={

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
    let stringToReturn=()=>"xzip.unzip_hex(\""+workingString+"\""+endString;
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
    let stringToReturn=()=>"xzip.unzip_dec(\""+workingString+"\""+endString;
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
    inputString=inputString.replaceAll("\"","\\\"");
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
};
