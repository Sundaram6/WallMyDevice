export const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

export const FRAG = `
precision highp float;
uniform vec2 uResolution;
uniform float uPhase;
uniform float uSeed;
uniform vec3 uColor0;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
uniform int uColorCount;
uniform float uBlobCount;
uniform float uDistortion;
uniform float uSwirl;
uniform float uContrast;
uniform float uSaturation;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 getColor(int i) {
  if (i == 0) return uColor0;
  if (i == 1) return uColor1;
  if (i == 2) return uColor2;
  if (i == 3) return uColor3;
  if (i == 4) return uColor4;
  return uColor5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;
  float t = uPhase * 0.1 + uSeed;
  float n = 0.0;
  float amp = 1.0;
  vec2 flow = vec2(0.0);
  for (int i = 0; i < 4; i++) {
    n += noise(p * uBlobCount + t) * amp;
    flow += vec2(noise(p * uBlobCount + 7.3 + t), noise(p * uBlobCount - 3.1 - t)) * amp;
    p += flow * uSwirl * 0.1;
    p *= 1.0 + uDistortion * 0.2;
    amp *= 0.5;
  }
  n = clamp(n * 0.6 + 0.5, 0.0, 1.0);
  n = pow(n, 1.0 / max(0.0001, uContrast));
  vec3 col = uColor0;
  float numColors = max(2.0, float(uColorCount));
  for (int i = 1; i < 6; i++) {
    if (float(i) < numColors) {
      float f = smoothstep(float(i - 1) / (numColors - 1.0) - 0.1, float(i) / (numColors - 1.0) + 0.1, n);
      col = mix(col, getColor(i), f);
    }
  }
  float gray = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(gray), col, uSaturation);
  gl_FragColor = vec4(col, 1.0);
}
`;
