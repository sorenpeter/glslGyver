#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

varying vec3 v_normal;
varying vec2 v_texcoord;

uniform sampler2D midi1;

float midiCC(int cc) {
    float offset = float(cc);
    offset = 3. * 127. + offset;
    float x = mod(offset,32.);
    float y = offset / 32.;
    return texture2D(midi1,vec2(x,y)/32.).w;
}

mat2 rotate(float angle) {
    return mat2( cos(angle), -sin(angle),
                 sin(angle), cos(angle));
}

float lines(float uvX_or_uvY, float scroll_speed, float num_of_lines, float line_weight) { // by: darch.dk (2023)
    uvX_or_uvY += mod(time * scroll_speed, 1.);
    return step(fract( uvX_or_uvY * num_of_lines), line_weight);
}


void main(void)
{
    //vec2 uv = -1. + 2. * v_texcoord;
    vec2 uv = (0.5 - v_texcoord.xy ) * resolution / resolution.yy;
    vec3 col = vec3(0.0);
    
    vec3 colA = vec3( 0.1, 0.5, 0.5 );
    vec3 colB = vec3( 0.9, 0.3, 0.1 );
    uv *= rotate(time*-0.25);        
    
    vec2 uv2 = 2.0 * fract(uv / (0.05+midiCC(4)+spectrum.z) ) - 1.;
    
    float pl_angle = atan(uv.x, uv.y); // get angle with atan from uv
    float pl_dist = length(uv)*2. ; // get length from uv 
    vec2 pl = vec2(pl_angle,pl_dist);
    pl *= rotate(time*0.15);
    col.rg = fract(pl.xy);
    
    uv = 2. * fract(uv / (midiCC(4) +.5) ) - 1.;
    float d = length(uv);
    d *= pl.x/pl.y ;
    float edgeA = midiCC(1);
    float edgeB = edgeA + midiCC(2);
    float pct = smoothstep(edgeA, edgeB, d);
    //col += mix(colA +spectrum.x, colB +spectrum.y, pct);
    col.b = 1. - pct ;


        
    gl_FragColor = vec4(col,1.0);
}