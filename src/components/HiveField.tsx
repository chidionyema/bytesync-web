"use client";
import { useEffect, useRef } from "react";

// The one hard idea: a living field. A WebGL2 fragment shader draws a swarm of
// agents converging on the pointer, with brightness driven by how much real work
// landed recently (the `energy` prop, from the live feed). No library; the whole
// renderer is this file. Under reduced motion, or without WebGL2, the field is a
// still gradient and the page is unchanged.

const VERT = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uT; uniform vec2 uMouse; uniform float uEnergy;
out vec4 o;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return v; }
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 m=(uMouse-.5*uRes)/uRes.y;
  float t=uT*.06;
  // flow field bends toward the pointer: the crew converging on the founder's intent
  vec2 toM=m-uv; float dm=length(toM);
  vec2 q=uv+.35*toM/(dm+.6);
  float n=fbm(q*2.2+vec2(t,-t*.7));
  float n2=fbm(q*4.5-vec2(t*1.3,t*.4)+n);
  // filaments: thin bright lines where the field is near a level set
  float d=abs(fract(n2*7.)-.5);
  float lines=smoothstep(.045,.0,d);             // thin filaments on the level set
  float glow=exp(-dm*2.6)*(.25+.75*uEnergy);     // pointer halo, brighter when the crew is busy
  vec3 ink=vec3(.055,.06,.075);
  vec3 acc=vec3(.55,.95,.80);   // phosphor
  vec3 acc2=vec3(.62,.45,.95);  // violet
  vec3 col=ink + acc*lines*(.08+.30*n)*(.5+.9*glow) + acc2*glow*.16 + acc*glow*.05;
  float vig=smoothstep(1.2,.3,length(uv));
  col=mix(ink,col,vig);
  o=vec4(col,1.);
}`;

export function HiveField({ energy = 0.3 }: { energy?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const energyRef = useRef(energy);
  useEffect(() => { energyRef.current = energy; }, [energy]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    // A software renderer (SwiftShader, llvmpipe, headless audits) would burn the main thread
    // for a decoration. The still gradient is the right answer there.
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|llvmpipe|software|mesa offscreen/i.test(renderer)) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
    } catch {
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uT = gl.getUniformLocation(prog, "uT");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uEnergy = gl.getUniformLocation(prog, "uEnergy");

    let w = 0, h = 0;
    // Render at 0.6x CSS pixels: the field is soft by nature and the fill cost falls 3x.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.6;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(r.width * dpr));
      h = Math.max(1, Math.floor(r.height * dpr));
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0, running = true, started = false, energy = energyRef.current, last = 0;
    const t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running && started) raf = requestAnimationFrame(frame); });
    io.observe(canvas);
    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return; // 30 fps is plenty for a slow field
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      energy += (energyRef.current - energy) * 0.02;
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform2f(uMouse, mouse.x * w, mouse.y * h);
      gl.uniform1f(uEnergy, energy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    // Start after the page is idle so first paint and hydration are never contended.
    const hasIdle = "requestIdleCallback" in window;
    const start = () => { started = true; if (running) raf = requestAnimationFrame(frame); };
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 400);
    return () => {
      if (hasIdle) window.cancelIdleCallback(idle); else clearTimeout(idle);
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ background: "radial-gradient(60% 50% at 50% 40%, oklch(30% 0.06 300 / .6), transparent 70%), var(--bg)" }}
    />
  );
}
