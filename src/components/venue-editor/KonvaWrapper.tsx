'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import Konva components to avoid SSR issues
const Stage = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Stage })), {
  ssr: false,
});

const Layer = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Layer })), {
  ssr: false,
});

const Rect = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Rect })), {
  ssr: false,
});

const Circle = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Circle })), {
  ssr: false,
});

const Text = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Text })), {
  ssr: false,
});

const Group = dynamic(() => import('react-konva').then((mod) => ({ default: mod.Group })), {
  ssr: false,
});

// Loading component for SSR
const KonvaLoading = () => (
  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
    <div className="text-charcoal/60 font-elegant">Loading venue editor...</div>
  </div>
);

export {
  Stage,
  Layer,
  Rect,
  Circle,
  Text,
  Group,
  KonvaLoading,
};