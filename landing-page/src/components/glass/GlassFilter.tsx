'use client';

import React from 'react';

export const GlassFilter: React.FC = () => (
  <svg
    aria-hidden="true"
    width="0"
    height="0"
    className="fixed pointer-events-none opacity-0"
  >
    <defs>
      <filter id="aurum-edge-refraction" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.018 0.022"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      <filter id="aurum-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82"
          numOctaves="2"
          stitchTiles="stitch"
        />
      </filter>
    </defs>
  </svg>
);
