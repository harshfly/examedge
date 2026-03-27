'use client';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <>
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />
      <motion.div 
        className="fixed -top-[200px] -right-[100px] w-[600px] h-[600px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%)',
          filter: 'blur(80px)'
        }}
        animate={{ transform: ['translate(0,0) scale(1)', 'translate(40px,30px) scale(1.1)'] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.div 
        className="fixed -bottom-[150px] -left-[100px] w-[500px] h-[500px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.08), transparent 70%)',
          filter: 'blur(80px)'
        }}
        animate={{ transform: ['translate(0,0) scale(1)', 'translate(-30px,-20px) scale(1.08)'] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
    </>
  );
}
