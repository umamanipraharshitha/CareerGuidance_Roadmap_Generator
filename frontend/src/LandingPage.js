import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CommunityServiceProject from "./CommunityServiceProject";
import ServicePages from "./ServicePages";
import ContactMe from "./contactme";

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000); // 4s intro
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

        .intro-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background: #0a9396;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeOut 1s ease forwards;
          animation-delay: 3s;
        }

        .signature-anim {
          font-family: "Great Vibes", cursive;
          font-size: 6rem;
          color: white;
          border-right: 3px solid white;
          width: 0;
          white-space: nowrap;
          overflow: hidden;
          animation: typing 2.5s steps(10, end) forwards, blink 0.8s infinite;
        }

        @keyframes typing {
          from { width: 0; }
          to { width: 6ch; }
        }

        @keyframes blink {
          50% { border-color: transparent; }
        }

        @keyframes fadeOut {
          to { opacity: 0; visibility: hidden; }
        }

        .site-content {
          animation: fadeIn 1s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {showIntro ? (
        <div className="intro-container">
          <h1 className="signature-anim">CSP</h1>
        </div>
      ) : (
        <div className="site-content">
          <Router>
            <Routes>
              <Route path="/" element={<CommunityServiceProject />} />
              <Route path="/about" element={<CommunityServiceProject />} />
              <Route path="/services" element={<ServicePages />} />
              <Route path="/contact" element={<ContactMe />} />
            </Routes>
          </Router>
        </div>
      )}
    </>
  );
}
