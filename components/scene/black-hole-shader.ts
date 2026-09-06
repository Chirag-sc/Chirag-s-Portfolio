export const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime, uScroll, uLensing, uTilt, uSpeed, uExposure, uDensity, uBloom, uMobile, uQuality;

float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);
}
float fbm(vec2 p) { return noise(p)*.56 + noise(p*2.03+15.3)*.28 + noise(p*4.09+7.8)*.16; }
vec3 stars(vec2 p, float density) {
  vec3 col=vec3(0.0);
  for(int i=0;i<3;i++) {
    float fi=float(i), grid=36.0+fi*42.0;
    vec2 uv=p*grid+fi*82.71;
    vec2 cell=floor(uv), local=fract(uv);
    float seed=hash(cell+fi*7.0);
    vec2 center=vec2(hash(cell+32.1),hash(cell-17.1))*.6+.2;
    float d=length(local-center);
    float width=.028+seed*.018;
    float star=exp(-d*d/(width*width));
    float visible=step(1.0-density*.034,seed);
    vec3 tint=mix(vec3(.55,.67,.78),vec3(1.0,.88,.72),hash(cell+98.));
    col += tint*star*visible*(.35+fi*.23);
  }
  return col;
}
float diskTexture(float r, float a) {
  float phase=a-uTime*uSpeed/pow(max(r,.3),1.1);
  vec2 coord=vec2(cos(phase),sin(phase))*r*5.0;
  float turbulence=fbm(coord+vec2(r*14.,0.));
  float filaments=sin(r*165.+turbulence*7.0+sin(a*9.+uTime*.09)*.6)*.5+.5;
  return (.36+.64*turbulence)*(.64+.36*filaments);
}
vec3 diskColor(float radius) {
  return mix(vec3(1.0,.90,.70),vec3(.64,.255,.065),smoothstep(.55,1.8,radius));
}
void main() {
  vec2 uv=vUv;
  float aspect=uResolution.x/uResolution.y;
  float progression=clamp(uScroll,0.0,1.0);
  vec2 center=mix(vec2(.76,.51),vec2(.61,.765),uMobile);
  center+=vec2(.035,.04)*progression;
  float scale=mix(3.0,4.4,uMobile);
  vec2 p=(uv-center)*vec2(aspect,1.0)*scale;
  float r=length(p), Rs=.505;
  float aa=scale/uResolution.y*1.3;
  float bend=uLensing*.36/(dot(p,p)+.12)*(1.0-smoothstep(.7,3.7,r));
  vec2 source=p*(1.0-bend*(1.0-progression));
  vec2 sky=source+vec2(3.27,8.63);
  float cloud=pow(fbm(sky*.68),3.0);
  vec3 color=vec3(.008,.013,.019)+vec3(.015,.027,.040)*cloud;
  color+=stars(sky,uDensity);
  if(uQuality>.5) color+=stars(sky*1.78+36.,uDensity*.27)*.3;
  float shadow=smoothstep(Rs-aa,Rs+aa,r);
  vec3 environment=color;
  color*=shadow;
  // Rotate the accretion plane on screen while keeping the shadow circular.
  float rot=-.145; mat2 rotation=mat2(cos(rot),-sin(rot),sin(rot),cos(rot));
  vec2 dp=rotation*p;
  float squash=max(cos(uTilt),.11);
  vec2 plane=vec2(dp.x,dp.y/squash);
  float dr=length(plane), da=atan(plane.y,plane.x);
  float band=smoothstep(.56,.64,dr)*(1.0-smoothstep(1.25,2.1,dr));
  float intensity=pow(.70/max(dr,.60),1.9)*band;
  float asymmetry=1.0+.36*(-dp.x/max(dr,.1));
  vec3 disk=diskColor(dr)*diskTexture(dr,da)*intensity*asymmetry*2.7;
  // Rear disk is occluded. The near side passes across the lower silhouette.
  float front=1.0-smoothstep(-.015,.015,dp.y);
  disk*=max(shadow,front);
  // Analytic secondary images suggest rays passing above and below the shadow.
  float topR=length(vec2(dp.x,dp.y/.97));
  float topRadius=.586;
  float topBand=exp(-pow((topR-topRadius)/.047,2.0))*smoothstep(-.025,.045,dp.y);
  float arcAngle=atan(dp.y,dp.x);
  float arcNoise=diskTexture(topR*1.6,arcAngle);
  float filament=.70+.30*sin(topR*320.+fbm(dp*9.)*5.);
  vec3 arc=vec3(1.0,.69,.35)*topBand*arcNoise*filament*2.0;
  float lowR=length(vec2(dp.x,dp.y/.93));
  float lowBand=exp(-pow((lowR-.543)/.016,2.0))*(1.0-smoothstep(-.045,.0,dp.y));
  arc+=vec3(1.0,.75,.46)*lowBand*.52;
  arc*=shadow*uLensing*(1.0-.3*dp.x);
  float ring=exp(-pow((r-.514)/max(.0035,aa*.62),2.0));
  vec3 photon=vec3(1.0,.88,.67)*ring*(.7+.3*cos(arcAngle+1.));
  float halo=exp(-pow((r-.59)/.21,2.0))*shadow;
  vec3 glow=vec3(.48,.20,.065)*halo*uBloom;
  float diskGlow=exp(-abs(dp.y)*18.)*exp(-abs(dp.x)*.85)*shadow;
  glow+=vec3(.55,.28,.10)*diskGlow*uBloom;
  color+=disk+arc+photon+glow;
  color=mix(color,environment,smoothstep(.12,.93,progression));
  // Leave a quiet area for the independent, high contrast DOM text.
  float leftMask=mix(.40,1.0,smoothstep(.27,.63,uv.x));
  float mobileMask=mix(.35,1.0,smoothstep(.42,.67,uv.y));
  color*=mix(leftMask,mobileMask,uMobile);
  color=vec3(1.0)-exp(-color*uExposure);
  color=pow(color,vec3(.82));
  gl_FragColor=vec4(color,1.0);
}
`;
