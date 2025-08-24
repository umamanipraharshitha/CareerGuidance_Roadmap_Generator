// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommunityServiceProject from "./CommunityServiceProject";
import ServicePages from "./ServicePages";
import ContactMe from "./contactme";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 4200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        :root{
          --ink:#0A1F33;
          --blue:#1e90ff;
          --blue2:#6fb6ff;
        }

        .intro {
          position: fixed; inset: 0;
          background:#fff;
          display:grid; place-items:center;
          z-index:9999; overflow:hidden;
          animation:introFade 700ms ease forwards;
          animation-delay: 3.5s;
        }

        /* soft vignette + grain for depth (very subtle) */
        .intro::before{
          content:"";
          position:absolute; inset:-20%;
          pointer-events:none;
          background:
            radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.06), transparent 60%) center/100% 100% no-repeat;
          mix-blend-mode:multiply; opacity:.08;
        }
        .intro::after{
          content:"";
          position:absolute; inset:0;
          pointer-events:none;
          background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch"/></filter><rect width="120" height="120" filter="url(%23n)" opacity="0.035"/></svg>');
          background-size:120px 120px;
        }

        .stack{
          position:relative;
          width:min(92vw, 960px);
          height:min(60vh, 520px);
          display:grid; place-items:center;
        }

        /* translucent embossed watermark */
        .wm {
          position:absolute;
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
          font-weight:800;
          letter-spacing:.12em;
          font-size:clamp(72px, 16vw, 240px);
          color:rgba(10,31,51,0.06);
          text-transform:uppercase;
          transform: translateY(-4px);
          opacity:0;
          animation: rise 700ms cubic-bezier(.2,.8,.2,1) forwards 120ms;
          /* emboss illusion */
          text-shadow:
            0.8px 0.8px 0 rgba(255,255,255,0.9),
            -0.8px -0.8px 0 rgba(0,0,0,0.04);
          -webkit-mask-image: linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.5));
          mask-image: linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.5));
        }

        /* shimmering overlay that traverses across watermark */
        .wm-overlay{
          position:absolute;
          font: inherit;
          font-size:inherit;
          letter-spacing:inherit;
          text-transform:uppercase;
          -webkit-text-fill-color: transparent;
          background-clip:text; -webkit-background-clip:text;
          background-image: linear-gradient(100deg,
            rgba(10,31,51,0.2) 0%,
            rgba(10,31,51,0.25) 24%,
            var(--blue) 32%, var(--blue2) 38%,
            rgba(10,31,51,0.25) 46%,
            rgba(10,31,51,0.18) 100%);
          background-size: 260% 100%;
          background-position: -140% 0%;
          opacity:0;
          animation:
            rise 700ms cubic-bezier(.2,.8,.2,1) forwards 220ms,
            sweep 2.6s ease-in-out forwards 520ms;
        }

        /* monogram stroke container (front) */
        .mark {
          position:relative;
          width:min(84vw, 680px);
          height:min(36vh, 260px);
          display:grid; place-items:center;
        }

        /* accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce){
          .wm, .wm-overlay, .sig path { animation: none !important; opacity:1 !important; }
          .intro { animation: none !important; }
        }

        @keyframes sweep {
          0% { background-position: -140% 0%; }
          60% { background-position: 6% 0%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes rise {
          from { transform: translateY(16px) scale(.985); opacity:0; }
          to   { transform: translateY(0) scale(1); opacity:1; }
        }
        @keyframes introFade {
          to { opacity:0; visibility:hidden; }
        }
      `}</style>

      {showIntro ? (
        <div className="intro" role="img" aria-label="CSP signature intro">
          <div className="stack">
            <div className="wm">CSP</div>
            <div className="wm wm-overlay">CSP</div>

            {/* Hand-drawn monogram (single animated stroke) */}
            <div className="mark" aria-hidden="true">
              <svg
                className="sig"
                width="100%" height="100%" viewBox="0 0 900 360"
                fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="ink" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1e90ff"/>
                    <stop offset="60%" stopColor="#6fb6ff"/>
                    <stop offset="100%" stopColor="#1e90ff"/>
                  </linearGradient>
                  <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="b"/>
                    <feMerge>
                      <feMergeNode in="b"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* One continuous path that hints C+S+P */}
                <path
                  d="
                    M60 220
                    C 140 60, 330 60, 380 200
                    C 410 280, 300 300, 250 250
                    C 210 210, 260 160, 330 178
                    C 460 208, 520 260, 600 250
                    C 710 236, 740 156, 700 120
                    C 660 86, 580 116, 580 168
                    C 580 226, 680 260, 820 210"
                  stroke="url(#ink)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#softGlow)"
                  style={{
                    strokeDasharray: 1200,
                    strokeDashoffset: 1200,
                    animation: "draw 2.2s ease forwards 700ms, gleam 2.8s ease-in-out forwards 900ms"
                  }}
                />
                <style>{`
                  @keyframes draw {
                    to { stroke-dashoffset: 0; }
                  }
                  @keyframes gleam {
                    0% { filter: url(#softGlow); opacity: .95; }
                    100% { filter: url(#softGlow); opacity: 1; }
                  }
                `}</style>
              </svg>
            </div>
          </div>
        </div>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<CommunityServiceProject/>} />
            <Route path="/about" element={<CommunityServiceProject/>} />
            <Route path="/services" element={<ServicePages/>} />
            <Route path="/contact" element={<ContactMe/>} />
          </Routes>
        </Router>
      )}
    </>
  );
}
