"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { Outfit } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  InstagramLogo,
  MapPin,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react";
import DriftWall from "@/components/DriftWall";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

/* ==========================================================================
   DATOS EDITABLES DEL CLIENTE
   ========================================================================== */

const PHONE_DISPLAY = "(786) 412-3607";
const PHONE_TEL = "tel:+17864123607";
const WHATSAPP = `https://wa.me/17864123607?text=${encodeURIComponent(
  "Hola, quiero reservar una cita en Omi Tattoo Studio."
)}`;
const INSTAGRAM = "https://www.instagram.com/omitattoo_";
const INSTAGRAM_HANDLE = "@omitattoo_";
const MAPS_URL =
  "https://www.google.co.uk/maps/place/Omi+Tattoo+Studio/@25.8785974,-80.3253635,15z/data=!3m1!4b1!4m6!3m5!1s0x88d9bba143d43207:0x73be48a374a4bb2f!8m2!3d25.8785785!4d-80.3150637";
const ADDRESS_LINES = ["6083 W 16th Ave", "Hialeah, FL 33012"];
const COORDS = { lat: 25.8785785, lng: -80.3150637 };
const MAP_EMBED = `https://www.google.com/maps?q=${COORDS.lat},${COORDS.lng}&z=16&output=embed`;

// HORARIOS: dato antiguo, confirmar con el cliente antes de publicar.
const HOURS = [
  { days: "Lunes a viernes", time: "9:00 AM - 10:00 PM" },
  { days: "Sábado", time: "9:30 AM - 6:00 PM" },
  { days: "Domingo", time: "9:30 AM - 5:00 PM" },
];

// FOTOS: cuando subas las fotos reales del Instagram del cliente a
// /public/tattoos (01.webp ... 24.webp), cambia esto a true.
// Mientras sea false se usan fotos de picsum como placeholder.
const USE_LOCAL_PHOTOS = true;
const photo = (n: number, w = 600, h = 800) =>
  USE_LOCAL_PHOTOS
    ? `/tattoos/${String(n).padStart(2, "0")}.webp`
    : `https://picsum.photos/seed/omi-tattoo-${n}/${w}/${h}`;

// ESTILOS: placeholders NO confirmados. Reemplazar nombres y descripciones
// por los estilos reales del estudio. Deben ser exactamente 5 (el bento
// esta calculado para 5 celdas).
const STYLES = [
  { n: "01", name: "Fine line", desc: "Trazo fino y detalle delicado.", img: photo(3, 1000, 1200) },
  { n: "02", name: "Blackwork", desc: "Negro sólido, contraste y formas contundentes.", img: photo(7, 900, 700) },
  { n: "03", name: "Realismo", desc: "Retratos y escenas con volumen.", img: photo(11, 700, 700) },
  { n: "04", name: "Color", desc: "Paletas vivas sobre diseño propio.", img: photo(15, 900, 700) },
  { n: "05", name: "Custom", desc: "Tu idea, diseñada desde cero.", img: photo(19, 700, 700) },
];

// Spans del bento (12 col x 2 filas). Suman 24 unidades: sin huecos.
const BENTO = [
  "col-span-12 md:col-span-5 md:row-span-2",
  "col-span-12 md:col-span-4",
  "col-span-12 md:col-span-3",
  "col-span-12 md:col-span-4",
  "col-span-12 md:col-span-3",
];

// PROCESO: copy corto, confirmar con el cliente.
const STEPS = [
  { n: "01", title: "Consulta", text: "Cuéntanos tu idea, la zona y el tamaño que tienes en mente. Escríbenos por WhatsApp o pasa por el estudio." },
  { n: "02", title: "Diseño", text: "Con tu referencia se prepara un diseño propio, pensado para tu piel." },
  { n: "03", title: "Sesión", text: "El día de tu cita se trabaja la pieza con calma, en el estudio." },
  { n: "04", title: "Cuidado", text: "Al terminar recibes indicaciones para cuidar el tatuaje mientras cicatriza." },
];

// ESTUDIO: textos y fotos editables.
const STUDIO_COPY =
  "Cada pieza se diseña a partir de tu idea, para que encaje con tu cuerpo y no con un catálogo.";
const HYGIENE_LINE =
  "La higiene y la seguridad son parte de cada sesión."; // Sustituir por los protocolos reales del estudio.
const COLLAGE = [photo(21, 800, 1200), photo(22, 800, 1200), photo(23, 800, 1200)];

// GALERIA DEL HERO (DriftWall): 24 items. Los titulos son placeholders.
const TATTOO_TITLES = [
  "Fine line · Antebrazo", "Blackwork · Espalda", "Realismo · Brazo", "Color · Pierna",
  "Fine line · Costillas", "Blackwork · Hombro", "Realismo · Pantorrilla", "Color · Antebrazo",
  "Fine line · Muñeca", "Blackwork · Pecho", "Realismo · Muslo", "Color · Hombro",
  "Fine line · Tobillo", "Blackwork · Brazo", "Realismo · Espalda", "Color · Costado",
  "Fine line · Clavícula", "Blackwork · Pierna", "Realismo · Antebrazo", "Color · Espalda",
  "Fine line · Mano", "Blackwork · Antebrazo", "Realismo · Hombro", "Color · Muslo",
];
const TATTOOS = TATTOO_TITLES.map((title, i) => ({
  image: photo(i + 1),
  title,
  href: INSTAGRAM,
}));

const TICKER = ["Diseños personalizados", "Con cita", "Hialeah, FL"];
const TICKER_GROUP = Array.from({ length: 4 }).flatMap(() => TICKER);

/* ==========================================================================
   CONFIG RESPONSIVE DE DRIFTWALL (objetos constantes: no reinician el wall)
   ========================================================================== */

const WALL_DESKTOP = { columns: 6, tileWidth: 220, tileHeight: 300, gap: 16, radius: 10, tilt: 14, turn: -12, perspective: 1100, depth: 140, speed: 38, parallax: 0.7, lift: 72 };
const WALL_TABLET = { columns: 4, tileWidth: 180, tileHeight: 250, gap: 14, radius: 9, tilt: 12, turn: -10, perspective: 1000, depth: 120, speed: 32, parallax: 0.5, lift: 56 };
const WALL_MOBILE = { columns: 3, tileWidth: 140, tileHeight: 200, gap: 10, radius: 8, tilt: 8, turn: -6, perspective: 900, depth: 100, speed: 28, parallax: 0, lift: 36 };

type WallCfg = typeof WALL_DESKTOP;

function useWallConfig() {
  const [cfg, setCfg] = useState<WallCfg | null>(null); // null en SSR
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setCfg(w >= 1024 ? WALL_DESKTOP : w >= 640 ? WALL_TABLET : WALL_MOBILE);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return cfg;
}

/* ==========================================================================
   COMPONENTES PEQUENOS
   ========================================================================== */

const Pill = ({ src }: { src: string }) => (
  <span
    aria-hidden="true"
    className="mx-[0.12em] inline-block h-[0.72em] w-[1.5em] rounded-full border border-[#EDE8DF]/20 bg-cover bg-center align-middle"
    style={{ backgroundImage: `url(${src})` }}
  />
);

/* ==========================================================================
   PAGINA
   ========================================================================== */

export default function Page() {
  const rootRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const magnetWrapRef = useRef<HTMLSpanElement>(null);
  const magnetBtnRef = useRef<HTMLAnchorElement>(null);

  const cfg = useWallConfig();
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!rootRef.current) return;
    let cleanupMagnet: (() => void) | undefined;

    const ctx = gsap.context(() => {
      if (reduced) return; // sin pin, scrub ni animaciones de entrada

      // HERO: revelado del wordmark por letra
      gsap.from("[data-letter]", { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.12, delay: 0.15 });
      gsap.from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.12, delay: 0.7 });

      // TICKER: scrub ligado al scroll de toda la pagina
      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          xPercent: -50,
          ease: "none",
          scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
      }

      ScrollTrigger.config({ ignoreMobileResize: true }); // evita refresh al mostrar/ocultar la barra del navegador

// PROCESO: seccion pinned con scrub
if (processRef.current) {
  const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
  gsap.set(steps, { autoAlpha: 0, y: 60 });
  gsap.set(steps[0], { autoAlpha: 1, y: 0 });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: processRef.current,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  tl.fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 1, duration: 3.5 }, 0);
  for (let i = 1; i < steps.length; i++) {
    const t = i - 0.5;
    // primero sale el anterior, luego entra el siguiente (nunca coexisten)
    tl.to(steps[i - 1], { autoAlpha: 0, y: -60, duration: 0.25 }, t);
    tl.fromTo(
      steps[i],
      { autoAlpha: 0, y: 60 },
      { autoAlpha: 1, y: 0, duration: 0.25, immediateRender: false },
      t + 0.25
    );
  }
}

      // REVEALS de titulares
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { y: 48, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });

      // ESTUDIO: parallax en las fotos + scale in / fade out del collage
      if (collageRef.current) {
        const box = collageRef.current;
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true } });
        });
        gsap.fromTo(box, { scale: 0.85 }, { scale: 1, ease: "none", scrollTrigger: { trigger: box, start: "top 95%", end: "top 45%", scrub: true } });
        gsap.to(box, { opacity: 0.25, ease: "none", scrollTrigger: { trigger: box, start: "bottom 35%", end: "bottom top", scrub: true } });
      }

      // CTA: boton magnetico (solo dispositivos con hover)
      const wrap = magnetWrapRef.current;
      const btn = magnetBtnRef.current;
      if (wrap && btn && window.matchMedia("(hover: hover)").matches) {
        const xTo = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
        const onMove = (e: MouseEvent) => {
          const r = wrap.getBoundingClientRect(); // el wrapper no se transforma
          xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const onLeave = () => { xTo(0); yTo(0); };
        wrap.addEventListener("mousemove", onMove);
        wrap.addEventListener("mouseleave", onLeave);
        cleanupMagnet = () => {
          wrap.removeEventListener("mousemove", onMove);
          wrap.removeEventListener("mouseleave", onLeave);
        };
      }
    }, rootRef);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      cleanupMagnet?.();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <main
      ref={rootRef}
      className={`${outfit.className} w-full max-w-full overflow-x-clip bg-[#0A0A0A] text-[#EDE8DF]`}
    >
      <style>{`
        .omi-grain{position:fixed;inset:0;z-index:60;pointer-events:none;opacity:.09;mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");}
        @keyframes omi-scroll{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        .omi-scroll-line{animation:omi-scroll 2.2s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){.omi-scroll-line{animation:none}}
      `}</style>
      <div className="omi-grain" aria-hidden="true" />

      {/* NAVBAR */}
      {/* <header className="fixed inset-x-0 top-0 z-40 border-b border-[#EDE8DF]/10 bg-[#0A0A0A]/30 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 md:px-12">
          <a href="#inicio" className="text-xl font-extrabold tracking-[0.25em]">OMI</a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-[#EDE8DF]/40 px-5 py-2 text-sm font-medium uppercase tracking-widest transition-colors duration-300 hover:bg-[#EDE8DF] hover:text-[#0A0A0A]"
          >
            Reservar
          </a>
        </nav>
      </header> */}

      {/* 1. HERO */}
      <section id="inicio" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        {/* Galeria: el padre tiene altura explicita (100svh) */}
        <div className="absolute inset-0">
          {cfg && (
            <DriftWall
              items={TATTOOS}
              {...cfg}
              direction="up"
              variance={0.5}
              fade={0.7}
              dim={0.5}
              grayscale={true}
              overlayColor="#0A0A0A"
              pauseOnHover={true}
            />
          )}
        </div>

        {/* Capas superiores: TODAS pointer-events-none para no romper el hover */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.78)_0%,rgba(10,10,10,0.4)_45%,rgba(10,10,10,0.92)_100%)]" />

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 pb-20 text-center">
          <h1 aria-label="OMI" className="text-[clamp(6rem,28vw,26rem)] font-extrabold leading-[0.85] tracking-tighter">
            <span className="flex overflow-hidden py-[0.03em]">
              {"OMI".split("").map((l, i) => (
                <span key={i} data-letter className="inline-block">{l}</span>
              ))}
            </span>
          </h1>
          <p data-hero-fade className="mt-4 text-xs uppercase tracking-[0.4em] text-[#EDE8DF]/80 sm:text-sm">
            Tattoo Studio · Hialeah, FL
          </p>
          <p data-hero-fade className="mt-6 max-w-xl text-lg font-light text-[#EDE8DF]/85 md:text-xl">
            Diseños propios, hechos para tu piel.
          </p>
          {/* Solo los CTAs reciben puntero */}
          <div data-hero-fade className="pointer-events-auto mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C1121F] px-8 py-4 text-sm font-medium uppercase tracking-widest text-[#EDE8DF] transition-transform duration-300 hover:scale-105"
            >
              <WhatsappLogo size={20} weight="light" />
              Reservar cita
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#EDE8DF]/50 bg-[#0A0A0A]/50 px-8 py-4 text-sm font-medium uppercase tracking-widest text-[#EDE8DF] backdrop-blur-sm transition-colors duration-300 hover:bg-[#EDE8DF] hover:text-[#0A0A0A]"
            >
              <InstagramLogo size={20} weight="light" />
              Ver Instagram
            </a>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="pointer-events-none absolute bottom-16 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#EDE8DF]/60 md:flex">
          <span className="omi-scroll-line block h-10 w-px bg-[#EDE8DF]/60" />
          <ArrowDown size={14} weight="light" />
        </div>

        {/* Ticker */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-12 items-center overflow-hidden border-t border-[#EDE8DF]/15 bg-[#0A0A0A]/70 backdrop-blur-sm">
          <div ref={tickerRef} className="flex w-max items-center will-change-transform">
            {[0, 1].map((g) => (
              <div key={g} className="flex shrink-0 items-center" aria-hidden={g === 1}>
                {TICKER_GROUP.map((t, i) => (
                  <span key={i} className="whitespace-nowrap px-6 text-xs uppercase tracking-[0.35em] text-[#EDE8DF]/80">
                    {t}
                    <span className="ml-12 text-[#C1121F]">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ESTILOS */}
      <section id="estilos" className="px-6 py-32 md:px-12 md:py-48">
        <div className="mx-auto max-w-[1600px]">
          <h2 data-reveal className="max-w-6xl text-[clamp(2.5rem,6.2vw,6rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
            Cada estilo cuenta <Pill src={photo(31, 400, 300)} /> una historia <Pill src={photo(32, 400, 300)} /> distinta en tu piel
          </h2>

          <div className="mt-16 grid auto-rows-[280px] grid-cols-12 grid-flow-dense gap-3 md:mt-24 md:auto-rows-[340px]">
            {STYLES.map((s, i) => (
              <article key={s.n} className={`group relative overflow-hidden border border-[#EDE8DF]/10 ${BENTO[i]}`}>
                <img
                  src={s.img}
                  alt={`Tatuaje estilo ${s.name}`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <span className="text-lg font-medium tabular-nums text-[#C1121F]">{s.n}</span>
                  <h3 className="mt-1 text-3xl font-bold uppercase tracking-tight md:text-4xl">{s.name}</h3>
                  <p className="mt-2 max-w-sm text-sm font-light text-[#EDE8DF]/75">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROCESO (pinned) */}
      {reduced ? (
        <section id="proceso" className="border-y border-[#EDE8DF]/10 px-6 py-32 md:px-12">
          <div className="mx-auto max-w-[1600px] divide-y divide-[#EDE8DF]/10">
            {STEPS.map((s) => (
              <div key={s.n} className="grid grid-cols-12 items-center gap-6 py-12">
                <span className="col-span-4 text-7xl font-extrabold text-[#C1121F] md:col-span-3 md:text-9xl">{s.n}</span>
                <div className="col-span-8 md:col-span-9">
                  <h3 className="text-3xl font-extrabold uppercase md:text-6xl">{s.title}</h3>
                  <p className="mt-3 max-w-xl text-lg font-light text-[#EDE8DF]/70">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
) : (
  <section ref={processRef} id="proceso" className="relative h-[100svh] w-full overflow-hidden border-y border-[#EDE8DF]/10">
    {STEPS.map((s) => (
      <div
        key={s.n}
        data-step
        className="absolute inset-0 mx-auto grid max-w-[1600px] grid-cols-12 content-center items-center gap-x-6 gap-y-4 px-6 md:px-12"
      >
        <span className="col-span-12 text-[clamp(7rem,24vw,24rem)] font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_#C1121F] md:col-span-5">
          {s.n}
        </span>
        <div className="col-span-12 md:col-span-7">
          <h3 className="text-[clamp(2.5rem,6vw,6rem)] font-extrabold uppercase leading-none tracking-tight">{s.title}</h3>
          <p className="mt-4 max-w-xl text-base font-light text-[#EDE8DF]/70 md:mt-6 md:text-xl">{s.text}</p>
        </div>
      </div>
    ))}
    <div className="absolute inset-x-6 bottom-12 h-px bg-[#EDE8DF]/15 md:inset-x-12">
      <div data-bar className="h-full origin-left bg-[#C1121F]" />
    </div>
  </section>
)}

      {/* 4. ESTUDIO / FIRMA */}
      <section id="estudio" className="px-6 py-32 md:px-12 md:py-48">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-y-16 lg:gap-x-12">
          <div className="col-span-12 flex flex-col justify-between lg:col-span-6">
            <h2 data-reveal className="text-[clamp(2.5rem,5.5vw,5.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
              Diseño propio, <Pill src={photo(33, 400, 300)} /> hecho para <Pill src={photo(34, 400, 300)} /> tu piel
            </h2>
            <div className="mt-12 max-w-md border-t border-[#EDE8DF]/15 pt-6">
              <p className="text-lg font-light text-[#EDE8DF]/80">{STUDIO_COPY}</p>
              <p className="mt-4 text-sm font-light text-[#EDE8DF]/60">{HYGIENE_LINE}</p>
            </div>
          </div>

          {/* Acordeon horizontal con parallax */}
          <div ref={collageRef} className="col-span-12 flex h-[60svh] gap-3 lg:col-span-6 lg:h-[75svh]">
            {COLLAGE.map((src, i) => (
              <div
                key={src}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`relative cursor-pointer overflow-hidden border border-[#EDE8DF]/10 transition-[flex-grow] duration-700 ease-out ${
                  active === i ? "flex-[3]" : "flex-1"
                }`}
              >
                <img
                  data-parallax
                  src={src}
                  alt="Trabajo del estudio"
                  loading="lazy"
                  className={`absolute left-0 top-[-10%] h-[120%] w-full object-cover transition-[filter] duration-700 ${
                    active === i ? "grayscale-0" : "grayscale"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. UBICACION Y HORARIOS */}
      <section id="ubicacion" className="border-t border-[#EDE8DF]/10 px-6 py-32 md:px-12 md:py-48">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-y-16 lg:gap-x-16">
          <div className="col-span-12 lg:col-span-5">
            <h2 data-reveal className="text-[clamp(2.5rem,5vw,5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
              Ven al estudio en <Pill src={photo(35, 400, 300)} /> Hialeah
            </h2>

            <address className="mt-12 flex gap-4 not-italic">
              <MapPin size={24} weight="light" className="mt-1 shrink-0 text-[#C1121F]" />
              <span className="text-xl font-light">
                {ADDRESS_LINES.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </span>
            </address>

            <dl className="mt-10 max-w-md">
              {HOURS.map((h) => (
                <div key={h.days} className="flex justify-between gap-6 border-b border-[#EDE8DF]/10 py-3">
                  <dt className="font-light text-[#EDE8DF]/70">{h.days}</dt>
                  <dd className="font-medium">{h.time}</dd>
                </div>
              ))}
            </dl>

            <a href={PHONE_TEL} className="mt-10 inline-flex items-center gap-3 text-2xl font-light transition-colors hover:text-[#C1121F]">
              <Phone size={24} weight="light" />
              {PHONE_DISPLAY}
            </a>

            <div className="mt-10">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full bg-[#C1121F] px-8 py-4 text-sm font-medium uppercase tracking-widest text-[#EDE8DF] transition-transform duration-300 hover:scale-105"
              >
                Cómo llegar
                <ArrowUpRight size={18} weight="light" />
              </a>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="relative h-[50svh] overflow-hidden border border-[#EDE8DF]/15 bg-[#0A0A0A] lg:h-[70svh]">
              <iframe
                title="Mapa de Omi Tattoo Studio"
                src={MAP_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
                style={{ filter: "grayscale(1) invert(0.92) contrast(0.9)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="relative px-6 py-32 text-center md:px-12 md:py-48">
        <h2 data-reveal className="mx-auto max-w-6xl text-[clamp(3rem,8vw,8rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
          Tu próxima pieza <Pill src={photo(36, 400, 300)} /> empieza aquí
        </h2>
        <div className="mt-16 flex flex-col items-center gap-8">
          <span ref={magnetWrapRef} className="inline-block p-10">
            <a
              ref={magnetBtnRef}
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-3 rounded-full bg-[#C1121F] px-12 py-7 text-lg font-medium uppercase tracking-widest text-[#EDE8DF]"
            >
              <WhatsappLogo size={26} weight="light" />
              Reservar por WhatsApp
            </a>
          </span>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 border-b border-[#EDE8DF]/40 pb-1 text-lg font-light transition-colors hover:border-[#C1121F] hover:text-[#C1121F]"
          >
            <InstagramLogo size={22} weight="light" />
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-[#EDE8DF]/10 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-y-10 md:gap-x-8">
          <div className="col-span-12 md:col-span-4">
            <span className="text-5xl font-extrabold tracking-tighter md:text-7xl">OMI</span>
            <p className="mt-2 text-xs uppercase tracking-[0.35em] text-[#EDE8DF]/60">Tattoo Studio</p>
          </div>
          <div className="col-span-12 space-y-2 font-light text-[#EDE8DF]/80 md:col-span-3">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer noopener" className="block hover:text-[#C1121F]">{INSTAGRAM_HANDLE}</a>
            <a href={PHONE_TEL} className="block hover:text-[#C1121F]">{PHONE_DISPLAY}</a>
          </div>
          <div className="col-span-12 space-y-1 font-light text-[#EDE8DF]/80 md:col-span-3">
            {ADDRESS_LINES.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <div className="col-span-12 space-y-1 text-sm font-light text-[#EDE8DF]/60 md:col-span-2">
            {HOURS.map((h) => (
              <p key={h.days}>{h.days}: {h.time}</p>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-[1600px] border-t border-[#EDE8DF]/10 pt-6 text-sm font-light text-[#EDE8DF]/50">
          © {new Date().getFullYear()} Omi Tattoo Studio
        </p>
      </footer>
    </main>
  );
}