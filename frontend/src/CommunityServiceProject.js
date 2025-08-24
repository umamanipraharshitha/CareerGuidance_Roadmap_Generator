import React, { useState } from "react";
import CommunityHero from "./components/HeroSection";
import StatsCardsSection from "./components/StatsCardsSection";
import FeaturesSection from "./components/FeaturesSection"; // ← final
import PlacesVisited from "./components/places";
import GeminiChat from "./components/GeminiChat";
import AboutUs from "./components/AboutUs";

const initialWeeks = [
  {
    week: 1,
    desc: "This is the description for Week 1 of the community project.",
    report: "/images/w1.pdf",
    images: ["/images/w1.jpg","/images/w12.jpg","/images/w13.jpg","/images/w14.jpg","/images/w15.jpg","/images/w16.jpg"],
    video: "/images/w1.mp4",
  },
  {
    week: 2,
    desc: "This is the description for Week 2 of the community project.",
    report: "/images/w2.pdf",
    images: ["/images/w2.jpg","/images/w22.jpg","/images/w23.jpg","/images/w24.jpg","/images/w24.jpg","/images/w25.jpg","/images/w26.jpg"],
  },
  {
    week: 3,
    desc: "This is the description for Week 3 of the community project.",
    report: "/images/w3.pdf",
    images: ["/images/w4.jpg","/images/w42.jpg","/images/w43.jpg","/images/w44.jpg"],
  },
  {
    week: 4,
    desc: "This is the description for Week 4 of the community project.",
    report: "/images/w4.pdf",
    images: ["/images/w3.jpg","/images/w32.jpg","/images/w33.jpg","/images/w34.jpg","/images/w35.jpg","/images/w36.jpg"],
  },
];

export default function CommunityServiceProject() {
  const [weeks] = useState(initialWeeks);
  const [selectedWeek, setSelectedWeek] = useState(null);

  return (
    <div style={{ background: "#fff" }}>
      <CommunityHero onLogin={() => {}} />
      <StatsCardsSection />
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <AboutUs />
        <FeaturesSection
          weeks={weeks}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
        <PlacesVisited />
        <GeminiChat />
      </div>
    </div>
  );
}
