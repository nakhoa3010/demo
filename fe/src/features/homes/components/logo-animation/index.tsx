'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const animation = {
  initial: {
    rotate: 0,
    scale: 0.95,
    opacity: 0.7,
  },
  animate: {
    rotate: 360,
    scale: 1,
    opacity: 1,
  },
};

export default function LogoAnimation() {
  return (
    <motion.div
      variants={animation}
      initial={'initial'}
      animate={'animate'}
      transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
      className="absolute top-1/2 right-0.5 my-auto -translate-y-1/2 lg:right-0"
    >
      <div className="relative flex-1 rounded-full">
        <Image
          src="/logo.svg"
          alt="logo"
          width={458}
          height={458}
          className="relative z-10 size-[200px] lg:size-[458px]"
          priority
        />
        <div
          id="div-blur"
          className="absolute top-0 z-0 h-full w-full rounded-full bg-neutral-700 blur-3xl"
        />
      </div>
    </motion.div>
  );
}
