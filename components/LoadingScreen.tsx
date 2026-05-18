"use client";
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500); 
    return () => clearInterval(interval); 
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#111111', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 100 100" 
        style={{
          animation: 'spin 1.5s linear infinite',
          marginBottom: '20px'
        }}
      >
        <rect width="100" height="100" rx="20" fill="black" />
        <path d="M50 25V75M25 50H75" stroke="white" stroke-width="12" stroke-linecap="round"/>
      </svg>

      <div style={{
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'sans-serif'
      }}>
        Vie +{dots}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}