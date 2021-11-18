/* shaders (remember to obfuscate these!!) */
/* GLSL library */
const GL={
  bfv:`
    varying vec2 vUv;
    varying vec3 N;
    varying vec3 I;
    varying vec4 vPosition;
    ${$.ShaderChunk.skinning_pars_vertex}
    void main(){
      ${$.ShaderChunk.beginnormal_vertex}
      ${$.ShaderChunk.skinbase_vertex}
      ${$.ShaderChunk.skinnormal_vertex}
      vec3 transformed=vec3(position);
      ${$.ShaderChunk.skinning_vertex}
      vUv=uv;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(transformed,1.0);
      vPosition=gl_Position;
    }
  `,
  bff:`
    uniform sampler2D texsampler;
    uniform float numcols;
    varying vec2 vUv;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    varying vec4 vPosition;
    void main(){
      vec4 color=texture2D(texsampler,vUv);
      #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
          float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
          float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        color.rgb = mix( color.rgb, fogColor, fogFactor );
      #endif
      color=pow(color,vec4(1.0/2.2));
      color=floor(color*numcols)/numcols;
      color=pow(color,vec4(2.2));
      gl_FragColor=color;
    }
  `,
  blv:`
    uniform float lightIntensity;
    struct PointLight{vec3 color;vec3 position;float distance;};
    uniform PointLight pointLights[NUM_POINT_LIGHTS];
    varying vec4 addedLights;
    varying vec2 vUv;
    varying vec3 vecPos;
    varying vec3 vecNormal;
    varying vec3 N;
    varying vec3 I;
    varying vec4 vPosition;
    ${$.ShaderChunk.skinning_pars_vertex}
    void main(){
      ${$.ShaderChunk.beginnormal_vertex}
      ${$.ShaderChunk.skinbase_vertex}
      ${$.ShaderChunk.skinnormal_vertex}
      vec3 transformed=vec3(position);
      ${$.ShaderChunk.skinning_vertex}
      vUv=uv;
      vecPos=(modelViewMatrix*vec4(transformed,1.0)).xyz;
      vecNormal=normalize(viewMatrix*modelMatrix*vec4(objectNormal,0.0)).xyz;
      addedLights=vec4(0.0,0.0,0.0,1.0);//you can use the last value to make the material transparent...
      for(int l=0;l<NUM_POINT_LIGHTS;l++){
        vec3 lightDirection=normalize(vecPos-pointLights[l].position);
        addedLights.rgb+=clamp(dot(-lightDirection,vecNormal),0.0,1.0)*pointLights[l].color*lightIntensity;
      }
      gl_Position=projectionMatrix*vec4(vecPos,1.0);
      vPosition=gl_Position;
    }
  `,
  blf:`
    varying vec4 addedLights;
    varying vec2 vUv;
    varying vec3 vecPos;
    varying vec3 vecNormal;
    uniform sampler2D texsampler;
    uniform float numcols;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    varying vec4 vPosition;
    void main(){
      vec4 color=texture2D(texsampler,vUv)*addedLights;
      #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
          float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
          float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        color.rgb = mix( color.rgb, fogColor, fogFactor );
      #endif
      color=pow(color,vec4(1.0/2.2));
      color=floor(color*numcols)/numcols;
      color=pow(color,vec4(2.2));
      gl_FragColor=color;
    }
  `,
  cfv:`
    uniform float width;
    uniform float height;
    uniform float pixelSize;
    varying vec2 vUv;
    varying vec3 N;
    varying vec3 I;
    varying vec4 vPosition;
    ${$.ShaderChunk.skinning_pars_vertex}
    void main(){
      ${$.ShaderChunk.beginnormal_vertex}
      ${$.ShaderChunk.skinbase_vertex}
      ${$.ShaderChunk.skinnormal_vertex}
      vec3 transformed=vec3(position);
      ${$.ShaderChunk.skinning_vertex}
      float ps=pixelSize;
      float pw=width/ps;
      float ph=height/ps;
      vec4 snap=projectionMatrix*modelViewMatrix*vec4(transformed,1.0);
      vec4 vertex=snap;
      vertex.xyz=snap.xyz/snap.w;
      vertex.x=floor(pw*vertex.x)/pw;
      vertex.y=floor(ph*vertex.y)/ph;
      vertex.xyz*=snap.w;
      vUv=uv;
      gl_Position=vertex;
      vPosition=gl_Position;
      gl_Position/=abs(gl_Position.w);
    }
  `,
  cff:`
    uniform sampler2D texsampler;
    uniform float numcols;
    varying vec2 vUv;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    varying vec4 vPosition;
    void main(){
      vec4 color=texture2D(texsampler,vUv);
      #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
          float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
          float depth = vPosition.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        color.rgb = mix( color.rgb, fogColor, fogFactor );
      #endif
      color=pow(color,vec4(1.0/2.2));
      color=floor(color*numcols)/numcols;
      color=pow(color,vec4(2.2));
      gl_FragColor=color;
    }
  `,
  clv:`
    uniform float lightIntensity;
    struct PointLight{vec3 color;vec3 position;float distance;};
    uniform PointLight pointLights[NUM_POINT_LIGHTS];
    varying vec4 addedLights;
    uniform float width;
    uniform float height;
    uniform float pixelSize;
    varying vec2 vUv;
    varying vec3 vecPos;
    varying vec3 vecNormal;
    varying vec3 N;
    varying vec3 I;
    varying vec4 vPosition;
    ${$.ShaderChunk.skinning_pars_vertex}
    void main(){
      ${$.ShaderChunk.beginnormal_vertex}
      ${$.ShaderChunk.skinbase_vertex}
      ${$.ShaderChunk.skinnormal_vertex}
      vec3 transformed=vec3(position);
      ${$.ShaderChunk.skinning_vertex}
      float ps=pixelSize;
      float pw=width/ps;
      float ph=height/ps;
      vec4 snap=projectionMatrix*modelViewMatrix*vec4(transformed,1.0);
      vec4 vertex=snap;
      vertex.xyz=snap.xyz/snap.w;
      vertex.x=floor(pw*vertex.x)/pw;
      vertex.y=floor(ph*vertex.y)/ph;
      vertex.xyz*=snap.w;
      vUv=uv;
      vecPos=(modelViewMatrix*vec4(position,1.0)).xyz;
      vecNormal=normalize(viewMatrix*modelMatrix*vec4(objectNormal,0.0)).xyz;
      addedLights=vec4(0.0,0.0,0.0,1.0);//you can use the last value to make the material transparent...
      for(int l=0;l<NUM_POINT_LIGHTS;l++){
        vec3 lightDirection=normalize(vecPos-pointLights[l].position);
        addedLights.rgb+=clamp(dot(-lightDirection,vecNormal),0.0,1.0)*pointLights[l].color * lightIntensity;
      }
      gl_Position=vertex;/*snap to pixel*/
      vPosition=gl_Position;
      gl_Position/=abs(gl_Position.w);
    }
  `,
  clf:`
    varying vec4 addedLights;
    uniform sampler2D texsampler;
    varying vec2 vUv;
    varying vec3 vecPos;
    varying vec3 vecNormal;
    uniform float numcols;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    varying vec4 vPosition;
    void main(){
      vec4 color=texture2D(texsampler,vUv)*addedLights;
      #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
          float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
          float depth = vPosition.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        color.rgb = mix( color.rgb, fogColor, fogFactor );
      #endif
      color=pow(color,vec4(1.0/2.2));
      color=floor(color*numcols)/numcols;
      color=pow(color,vec4(2.2));
      gl_FragColor=color;
    }
  `,
};