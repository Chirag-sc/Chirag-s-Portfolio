export const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution, uPointer, uCenter;
uniform float uScale, uPresence, uInspection, uStarLens;
uniform float uTime, uScroll, uTravel, uReduced, uLensing, uTilt, uSpeed, uExposure, uDensity, uBloom, uMobile, uQuality;

float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
float fbm(vec2 p) { return noise(p)*.56 + noise(p*2.03+15.3)*.28 + noise(p*4.09+7.8)*.16; }

// A stable population: tiny distant points, an intermediate layer, and rare
// foreground lights. No temporal hash or twinkle; movement is parallax only.
vec3 starLayer(vec2 p, float layer, float calm) {
  float grid=mix(108.,17.,layer*.5);
  vec2 uv=p*grid+layer*82.71;
  vec2 cell=floor(uv), local=fract(uv);
  float seed=hash(cell+layer*7.0);
  vec2 location=(cell+.5)/grid;
  float population=smoothstep(.25,.70,noise(location*.9+31.));
  float cluster=pow(smoothstep(.48,.85,noise(location*3.1-19.)),3.0);
  float voids=1.0-smoothstep(.53,.76,noise(location*.64+64.));
  float chance=(.002+population*.028+cluster*.042)*voids*uDensity;
  chance*=mix(1.,.45,layer*.5);
  float present=step(1.0-chance,seed);
  vec2 center=vec2(hash(cell+32.1),hash(cell-17.1))*.62+.19;
  float d=length(local-center);
  float variation=hash(cell+53.8);
  float radius=mix(.026,.079,pow(variation,3.0));
  float footprint=length(fwidth(uv))*.45;
  float width=max(radius,footprint);
  float energy=radius*radius/(width*width);
  float core=exp(-d*d/(width*width))*energy;
  float bright=mix(.12,1.4,pow(variation,4.0))*mix(.48,1.3,layer*.5);
  float halo=exp(-d*d/(width*width*7.0))*energy*.025*layer;
  vec3 tint=mix(vec3(.61,.77,1.),vec3(1.,.83,.59),hash(cell+98.));
  tint=mix(tint,vec3(.91,.94,.95),.35);
  return tint*(core+halo)*present*bright*mix(1.,.62,calm);
}

// Non-periodic filaments: anisotropic value noise is warped by large eddies.
// Circular coordinates avoid an atan seam. Each radius advects at its own speed.
float diskTexture(float radius, float angle) {
  float phase=angle-uTime*uSpeed*pow(max(radius,.45),-1.35);
  vec2 orbit=vec2(cos(phase),sin(phase));
  float eddies=fbm(orbit*(2.7+radius*.8)+vec2(radius*3.3,9.2));
  float warp=radius+(eddies-.5)*.115;
  float stream=noise(vec2(warp*43.0+orbit.x*2.7,orbit.y*4.3+radius*.6));
  float braided=noise(vec2(warp*78.0+orbit.y*4.5,orbit.x*6.2-radius*1.3));
  // Fade fine structure below a pixel instead of allowing moire or shimmer.
  braided=mix(braided,.5,smoothstep(.35,1.1,fwidth(radius)*78.0));
  float filament=smoothstep(.27,.83,stream)*.62+smoothstep(.38,.88,braided)*.38;
  float density=.27+.83*fbm(orbit*(4.0+radius*.5)+vec2(radius*6.1,-4.));
  float pockets=pow(smoothstep(.42,.86,noise(orbit*5.4+vec2(radius*4.2,2.))),2.);
  float fine=.5;
  if(uQuality>.5) fine=noise(vec2(warp*126.+orbit.x*3.,orbit.y*8.+radius));
  fine=mix(fine,.5,smoothstep(.25,.8,fwidth(radius)*126.));
  return (.24+.62*filament+.14*fine)*density + pockets*.23;
}
vec3 diskColor(float radius) {
  return mix(vec3(1.0,.90,.70),vec3(.64,.255,.065),smoothstep(.55,1.8,radius));
}
void main() {
  vec2 uv=vUv;
  float aspect=uResolution.x/uResolution.y;
  float progression=clamp(uScroll,0.,1.);
  float calm=smoothstep(.67,1.,progression);
  vec2 heroCenter=mix(vec2(.91,.55),vec2(.58,.79),uMobile);
  vec2 center=uCenter;
  float scale=uScale;
  vec2 p=(uv-center)*vec2(aspect,1.0)*scale;
  float r=length(p), Rs=.505;
  float aa=scale/uResolution.y*1.1;
  float holePresence=uPresence;
  // The lens has a critical radius outside the shadow: source coordinates
  // compress tangentially there, turning real background points into arcs.
  float bend=uLensing*uStarLens*.40/(dot(p,p)+.025)*(1.0-smoothstep(.8,3.1,r));
  vec2 lensOffset=-p*bend/scale*3.0*holePresence;
  vec2 sky=(uv-.5)*vec2(aspect,1.)*3.0+vec2(3.27,8.63);
  vec2 drift=vec2(.055,-.065)*uTravel;
  vec3 stars=vec3(0.);
  for(int i=0;i<3;i++) {
    if(i==1 && uQuality<.5) continue;
    float depth=float(i)*.5;
    vec2 source=sky+lensOffset*(1.0-depth*.12)+drift*(.25+depth)+uPointer*(.18+depth*1.7);
    stars+=starLayer(source,float(i),calm);
  }
  // Two fixed source-plane points close to the opening's optical axis ensure
  // the tangentially stretched images remain legible. They use the same lens
  // mapping as every star, not screen-space arc geometry, and never twinkle.
  vec2 axis=(mix(heroCenter,center,uInspection)-.5)*vec2(aspect,1.)*3.+vec2(3.27,8.63);
  vec2 alignedSource=sky+lensOffset+drift*.4+uPointer*.35;
  vec2 pointA=alignedSource-axis-vec2(.019,.013);
  vec2 pointB=alignedSource-axis-vec2(-.075,.06);
  float pointWidth=max(.004,length(fwidth(alignedSource))*.32);
  float pointEnergy=.000016/(pointWidth*pointWidth);
  stars+=vec3(.57,.72,.86)*(exp(-dot(pointA,pointA)/(pointWidth*pointWidth))*.65+exp(-dot(pointB,pointB)/(pointWidth*pointWidth))*.3)*pointEnergy*mix(1.,1.55,uInspection);
  float cloud=fbm(sky*.72+drift*.2);
  float darkLane=smoothstep(.38,.67,noise(sky*.83+27.));
  float dust=pow(cloud,3.0)*(1.0-darkLane*.9);
  float warmHaze=exp(-dot(p,p)*.14)*holePresence;
  vec3 environment=vec3(.006,.010,.015)+stars;
  environment+=vec3(.015,.021,.029)*dust*mix(1.,.3,calm);
  environment+=vec3(.008,.004,.001)*warmHaze;
  // Carry a faint amber/blue remnant across the later sections; contact settles.
  float remnant=sin(progression*3.14159)*.45*(1.-calm);
  vec3 ambientTint=mix(vec3(.014,.007,.003),vec3(.005,.011,.017),smoothstep(.48,.65,progression));
  environment+=ambientTint*cloud*remnant;
  float shadow=smoothstep(Rs-aa,Rs+aa,r);
  vec3 color=environment*mix(1.0,shadow,holePresence);
  float rot=-.145; mat2 rotation=mat2(cos(rot),-sin(rot),sin(rot),cos(rot));
  vec2 dp=rotation*p;
  float squash=max(cos(uTilt),.11);
  vec2 plane=vec2(dp.x,dp.y/squash);
  float dr=length(plane), da=atan(plane.y,plane.x);
  float band=smoothstep(.56,.64,dr)*(1.0-smoothstep(1.25,2.1,dr));
  float intensity=pow(.70/max(dr,.60),1.9)*band;
  float asymmetry=1.0+.36*(-dp.x/max(dr,.1));
  vec3 disk=diskColor(dr)*diskTexture(dr,da)*intensity*asymmetry*3.0;
  float front=1.0-smoothstep(-.015,.015,dp.y);
  disk*=max(shadow,front);
  float topR=length(vec2(dp.x,dp.y/.97));
  float topBand=exp(-pow((topR-.586)/.047,2.0))*smoothstep(-.025,.045,dp.y);
  float arcAngle=atan(dp.y,dp.x);
  float arcNoise=diskTexture(topR*1.6,arcAngle);
  vec3 arc=diskColor(.78)*topBand*(.28+arcNoise)*1.85;
  float lowR=length(vec2(dp.x,dp.y/.93));
  float lowBand=exp(-pow((lowR-.543)/.016,2.0))*(1.0-smoothstep(-.045,.0,dp.y));
  arc+=vec3(1.0,.75,.46)*lowBand*(.37+arcNoise*.26);
  arc*=shadow*uLensing*(1.0-.3*dp.x);
  float ring=exp(-pow((r-.514)/max(.0035,aa*.62),2.0));
  vec3 photon=vec3(1.0,.88,.67)*ring*(.7+.3*cos(arcAngle+1.));
  float halo=exp(-pow((r-.59)/.21,2.0))*shadow;
  vec3 glow=vec3(.48,.20,.065)*halo*uBloom;
  float diskGlow=exp(-abs(dp.y)*18.)*exp(-abs(dp.x)*.85)*shadow;
  glow+=vec3(.55,.28,.10)*diskGlow*uBloom;
  color+=(disk+arc+photon+glow)*holePresence;
  float leftMask=mix(.40,1.0,smoothstep(.27,.63,uv.x));
  float mobileMask=mix(.35,1.0,smoothstep(.42,.67,uv.y));
  color*=mix(mix(mix(leftMask,mobileMask,uMobile),.76,smoothstep(.05,.43,progression)),.9,uInspection);
  color=vec3(1.0)-exp(-color*uExposure);
  color=pow(color,vec3(.82));
  gl_FragColor=vec4(color,1.0);
}
`;
