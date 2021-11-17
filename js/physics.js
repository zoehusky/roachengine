// collision and gravity

var phys={


  defineCollisionVoxel:function(mesh,characterMesh){

    // get position of character
    let charpos=getWorldPosition(characterMesh);
    let chx=charpos.x;
    let chy=charpos.y;
    let chz=charpos.z;

    // get position of voxel
    let posx=mesh.position.x;
    let posy=mesh.position.y;
    let posz=mesh.position.z;

    // get scale of voxel
    let scalx=mesh.scale.x;
    let scaly=mesh.scale.y;
    let scalz=mesh.scale.z;

    // get zone
    let zonexmin=posx-(scalx/2)-20;
    let zonexmax=posx+(scalx/2)+20;
    let zoneymin=posy-(scaly/2)-150;
    let zoneymax=posy+(scaly/2);
    let zonezmin=posz-(scalz/2)-20;
    let zonezmax=posz+(scalz/2)+20;
    
    // define the collision "side"
    let whichside="";

    // if character is inside the bounds...
    if(
      (chx>zonexmin)&&(chx<zonexmax)&&
      (chy>zoneymin)&&(chy<zoneymax)&&
      (chz>zonezmin)&&(chz<zonezmax)
    ){
      // get the distances from each side
      let distfromleft    = Math.abs(chx-zonexmin);
      let distfromright   = Math.abs(zonexmax-chx);
      let distfromback    = Math.abs(chz-zonezmin);
      let distfromfront   = Math.abs(zonezmax-chz);
      let distfrombottom  = Math.abs(chy-zoneymin);
      let distfromtop     = Math.abs(zoneymax-chy);
      // get the side with the smallest distance
      let smallestdist=Math.min(
        distfromleft,
        distfromright,
        distfromback,
        distfromfront,
        distfrombottom,
        distfromtop
      );
      if     (smallestdist===distfromleft)    { whichside="LEFT";   }
      else if(smallestdist===distfromright)   { whichside="RIGHT";  }
      else if(smallestdist===distfromback)    { whichside="BACK";   }
      else if(smallestdist===distfromfront)   { whichside="FRONT";  }
      else if(smallestdist===distfrombottom)  { whichside="BOTTOM"; }
      else if(smallestdist===distfromtop)     { whichside="TOP";    }
      else                                    { whichside="";       }
      // translate back in opposite direction
      if     (whichside==="LEFT")   { characterMesh.position.x-=Math.abs(distfromleft);    }
      else if(whichside==="RIGHT")  { characterMesh.position.x+=Math.abs(distfromright);   }
      else if(whichside==="BACK")   { characterMesh.position.z-=Math.abs(distfromback);    }
      else if(whichside==="FRONT")  { characterMesh.position.z+=Math.abs(distfromfront);   }
      else if(whichside==="BOTTOM") { characterMesh.position.y-=Math.abs(distfrombottom);  }
      else if(whichside==="TOP")    { characterMesh.position.y+=Math.abs(distfromtop);     }
    }
  },


  defineSlopeVoxel:function(mesh,characterMesh){
    // get position of character
    let charpos=getWorldPosition(characterMesh);
    let chx=charpos.x;
    let chy=charpos.y;
    let chz=charpos.z;

    // get position of voxel
    let posx=mesh.position.x;
    let posy=mesh.position.y;
    let posz=mesh.position.z;

    // get scale of voxel
    let scalx=mesh.scale.x;
    let scaly=mesh.scale.y;
    let scalz=mesh.scale.z;

    // get zone
    let zonexmin=posx-(scalx/2);
    let zonexmax=posx+(scalx/2);
    let zoneymin=posy-(scaly/2);
    let zoneymax=posy+(scaly/2);
    let zonezmin=posz-(scalz/2);
    let zonezmax=posz+(scalz/2);

    // if character is inside the bounds...
    if(
      (chx>zonexmin)&&(chx<zonexmax)&&
      (chz>zonezmin)&&(chz<zonezmax)
    ){
      if((chy>zoneymin)&&(chy<zoneymax)){
        // if it is less than max height, push upward by gravity factor
        // until it is the correct height
        characterMesh.position.y+=worldGravityFactor;
      }else if((chy>zoneymax)&&(chy<zoneymax+worldGravityFactor)){
        // if it is greater than the max height but less than gravity factor,
        // snap to max height
        characterMesh.position.y=zoneymax;
      }
    }
  },


  createCollisionArea:function(
    fromx,tox,
    fromy,toy,
    fromz,toz,
  ){
    let width   = tox-fromx;
    let height  = toy-fromy;
    let depth   = toz-fromz;
    let posX    = fromx+(width/2);
    let posY    = fromy+(height/2);
    let posZ    = fromz+(depth/2);
    let geom    = new $.BoxGeometry(1,1,1,3,3,3);
    let mat     = newWireframeMaterial(colors.yellow);
    let mesh=new $.Mesh(geom,mat);
    mesh.position.set(posX,posY,posZ);
    mesh.scale.set(width,height,depth);
    scene.add(mesh);
    collisionList.push(mesh);
    return mesh;
  },


  createSlopeArea:function(
    fromx,tox,
    fromy,toy,
    fromz,toz,
  ){
    let width   = tox-fromx;
    let height  = toy-fromy;
    let depth   = toz-fromz;
    let posX    = fromx+(width/2);
    let posY    = fromy+(height/2);
    let posZ    = fromz+(depth/2);
    let geom    = new $.BoxGeometry(1,1,1,2,2,2);
    let mat     = newWireframeMaterial(colors.blue);
    let mesh=new $.Mesh(geom,mat);
    mesh.position.set(posX,posY,posZ);
    mesh.scale.set(width,height,depth);
    scene.add(mesh);
    slopeList.push(mesh);
    return mesh;
  },


  applyGravity:function(characterMesh){
    characterMesh.position.y-=worldGravityFactor;
  },


};
