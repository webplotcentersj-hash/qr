import React, { useState, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import Card from './components/Card';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [number, setNumber] = useState('100001');
  const cardRef = useRef(null);

  const handleDownload = async () => {
    if (cardRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toJpeg(cardRef.current, { quality: 1.0, backgroundColor: 'white', pixelRatio: 4 });
      const link = document.createElement('a');
      link.download = `tarjeta-${number}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image', err);
    }
  };

  const handleNext = () => {
    setNumber(prev => (parseInt(prev) + 1).toString());
  };

  const handlePrev = () => {
    setNumber(prev => (parseInt(prev) - 1).toString());
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
      <h1 style={{ color: '#333' }}>Generador de tarjetas Plot Center</h1>

      <div className="controls" style={{
        background: 'white',
        padding: '20px 30px',
        borderRadius: 12,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: 15,
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <button onClick={handlePrev} style={btnStyle} title="Anterior"><ChevronLeft size={20} /></button>
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: 2 }}>Número</span>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              style={inputStyle}
            />
          </label>
          <button onClick={handleNext} style={btnStyle} title="Siguiente"><ChevronRight size={20} /></button>
        </div>

        <div style={{ width: 1, height: 40, background: '#eee', margin: '0 10px' }}></div>

        <button onClick={handleDownload} style={actionBtnStyle}>
          <Download size={18} /> Descargar JPG
        </button>
      </div>

      <div style={{
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        borderRadius: 2,
        overflow: 'hidden' // Clean edges for preview
      }}>
        <div ref={cardRef}>
          <Card number={number} />
        </div>
      </div>

      <p style={{ color: '#888', marginTop: 20, fontSize: '0.9rem' }}>
        Edita el número y descarga la imagen para imprimir.
      </p>
    </div>
  );
}

const btnStyle = {
  padding: '8px',
  background: '#f4f4f5',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const inputStyle = {
  padding: '8px 12px',
  fontSize: '1.1rem',
  border: '1px solid #ddd',
  borderRadius: 6,
  width: '100px',
  textAlign: 'center',
  fontWeight: 'bold'
};

const actionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 20px',
  background: '#0ea5e9',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 500
};

export default App;
