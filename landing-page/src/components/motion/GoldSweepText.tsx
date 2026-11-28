'use client';

import React from 'react';

interface GoldSweepTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GoldSweepText: React.FC<GoldSweepTextProps> = ({ children, className = '' }) => (
  <span className={`italic gold-foil-sweep ${className}`}>{children}</span>
);
