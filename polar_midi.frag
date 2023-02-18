#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

/* --- MidiGyver --- */
uniform float k1;
uniform float k2;
uniform float k3;
uniform float k4;
uniform float k5;
uniform float k6;
uniform float k7;
uniform float k8;


/* --- Math fuctions --- */
#define PI 3.1415926538

float min2plus(float n) { return (n*2.)-1.; }

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

mat2 rotate(float angle) {
    return mat2( cos(angle), -sin(angle),
                 sin(angle), cos(angle));
}

vec2 polar(vec2 uv) {
    //float pl_angle = atan(uv.x, uv.y); // get angle with atan from uv
    //float pl_dist = length(uv)*2. ; // get length from uv 
    return vec2(atan(uv.x, uv.y), length(uv)*2.);
}

/* --- Shapes fuctions --- */

float lines(float uvX_or_uvY, float scroll_speed, float num_of_lines, float line_weight) { // by: darch.dk (2023)
    uvX_or_uvY += mod(u_time * scroll_speed, 1.);
    return step(fract( uvX_or_uvY * num_of_lines), line_weight);
}

float sdCircle( vec2 p, float r ) { return length(p) - r;}

float superCircle(vec2 pos, float radius, float angle) {
    // By: darch.dk (2023)
    // Based on: https://www.shadertoy.com/view/ll23DW and True squircle (http://en.m.wikipedia.org/wiki/Squircle)
    // (x-a)^4 + (y-b)^4 = r^4
    
    float min_size = 0.1; // 0.5 > star // 1.0 > square // 2.0 >> circle
    float power = min_size + 4. * angle;
    float dist = pow(abs(pos.x),power) + pow(abs(pos.y),power); 
    return step(dist, pow(radius,power));
}


/* --- Color functions --- */

vec3 brightness(vec3 col, float value) {
    // https://timseverien.com/posts/2020-06-19-colour-correction-with-webgl/
    return col + value;
}

vec3 contrast(vec3 col, float value) {
    // https://timseverien.com/posts/2020-06-19-colour-correction-with-webgl/
    return 0.5 + value * (col - 0.5);
}

 vec3 saturation(vec3 col, float value) {
    return mix(vec3(col.r + col.g + col.b)/3., col, value);
}

vec3 hueShift(vec3 col, float hue) {
    hue *= 6.28; // Multiply with TAU (6.28) when using a an normalized uniform to get radians
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return vec3(col * cosAngle + cross(k, col) * sin(hue) + k * dot(k, col) * (1.0 - cosAngle));
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec2 uv = (gl_FragCoord.xy -0.5*u_resolution.xy)/u_resolution.y;
    vec3 col = vec3(0.25);
    float t = u_time* 0.25;
    //uv *= rotate(t);

    /* Red */
    //uv.y = uv.x*cos(uv.x*u_time)-uv.y*2.;  
    col.r = superCircle(uv,  k1, k2);

    /* Green */
    //uv.y *= sin(uv.x*u_time)-uv.y*2.;
    //uv.y *= fract(sin(uv.x)*10000000.0);
    //uv.y *= rand(uv.xx);
    col.g = superCircle(uv,  k2, k1);

    /* Blue */    
    
    uv.y += fract(sin(uv.x)*10000000.0);
    uv *= rotate(t);
    col.b = superCircle(uv,  k3, k4);
  
    /* Polar */
    vec2 pl = polar(st-0.5)*rotate(t*2.);
    pl *= rotate(u_time*0.15);
    //pl += sin(t);
    //col.rg += fract(pl.yx);

    col = brightness(col, k5);
    col = contrast(col, k6);
    col = hueShift(col, k7);
    col = saturation(col, k8);

    gl_FragColor = vec4(col,1.0);
}