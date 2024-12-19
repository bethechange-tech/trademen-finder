'use client';
import React from 'react';
import { LineWave } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LineWave height='150' width='150' color='blue' ariaLabel='loading' />
    </div>
  );
};

export default Loader;
