import React from "react";

const Slidingeffect = () => {
  // Create an array for the 4 items (per row)
  const items = Array.from({ length: 4 }, (_, i) => i + 1);
  const animationDuration = "30s";

  const firstRowTexts = [
    "LawMitra: Simplify law, get expert help.",
    "Legal questions? LawMitra answers fast.",
    "Simplify law, stress-free.",
    "Your legal guide, simplified."
  ];

  const secondRowTexts = [
    "Connect with lawyers directly on LawMitra.",
    "Find cases, summaries, and legal help.",
    "Get expert advice anytime with LawMitra.",
    "Find answers, fast and simple."
  ];

  const thirdRowTexts = [
    "Discover, learn, and connect instantly.",
    "Analyze cases and simplify the law.",
    "Case analysis made quick.",
    "Expert advice, one click away."
  ];

  return (
    <div className="bg-[#F4F4F4] mt-30 mb-30">
      {/* Custom keyframes and hover styles inserted in the component */}
      <style>{`
        @keyframes scrollLeft {
          to { left: -440px; }  /* Block width is 440px so it moves fully off-screen */
        }
        @keyframes scrollRight {
          to { right: -440px; }
        }
        /* Pause animation for all child items when hovering on a row */
        .wrapper:hover .anim-item {
          animation-play-state: paused;
        }
        /* Underline text inside an item when hovered */
        .anim-item:hover span {
          text-decoration: underline;
        }
      `}</style>

      {/* Left scrolling row */}
      <div
        className="wrapper mt-6 w-full max-w-screen-2xl mx-auto h-[100px] relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
        }}
      >
        {items.map((item, index) => {
          // Calculate the delay for each item
          const delay = -(30 / 4) * (4 - item);
          return (
            <div
              key={`left-${item}`}
              className="anim-item w-[480px] h-[100px] bg-white rounded-md absolute flex items-center justify-center"
              style={{
                animationName: "scrollLeft",
                animationDuration: animationDuration,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDelay: `${delay}s`,
                // Start fully off to the right; you can adjust this as needed.
                left: "100%",
              }}
            >
              <span className="text-black text-2xl">{firstRowTexts[index]}</span>
            </div>
          );
        })}
      </div>

      {/* Right scrolling row */}
      <div
        className="wrapper mt-6 w-full max-w-screen-2xl mx-auto h-[100px] relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
        }}
      >
        {items.map((item, index) => {
          const delay = -(30 / 4) * (4 - item);
          return (
            <div
              key={`right-${item}`}
              className="anim-item w-[480px] h-[100px] bg-white rounded-md absolute flex items-center justify-center"
              style={{
                animationName: "scrollRight",
                animationDuration: animationDuration,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDelay: `${delay}s`,
                // Start fully off to the left; adjust as needed.
                right: "100%",
              }}
            >
              <span className="text-black text-2xl">{secondRowTexts[index]}</span>
            </div>
          );
        })}
      </div>

      {/* Another Left scrolling row */}
      <div
        className="wrapper mt-6 w-full max-w-screen-2xl mx-auto h-[100px] relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0))",
        }}
      >
        {items.map((item, index) => {
          const delay = -(30 / 4) * (4 - item);
          return (
            <div
              key={`left2-${item}`}
              className="anim-item w-[480px] h-[100px] bg-white rounded-md absolute flex items-center justify-center"
              style={{
                animationName: "scrollLeft",
                animationDuration: animationDuration,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationDelay: `${delay}s`,
                left: "100%",
              }}
            >
              <span className="text-black text-2xl">{thirdRowTexts[index]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Slidingeffect;
