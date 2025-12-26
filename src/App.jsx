import React, { useState, useRef } from 'react';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import Card from './components/Card';
import { Download, ChevronLeft, ChevronRight, Layers, FileDown, FileSpreadsheet } from 'lucide-react';

function App() {
  const [singleNumber, setSingleNumber] = useState('100001');
  const [rangeStart, setRangeStart] = useState('100001');
  const [rangeEnd, setRangeEnd] = useState('100010');
  const [mode, setMode] = useState('single'); // 'single' or 'bulk'
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const cardRef = useRef(null);

  // Single Download
  const handleDownload = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toJpeg(cardRef.current, { quality: 1.0, backgroundColor: 'white', pixelRatio: 4 });
      const link = document.createElement('a');
      link.download = `tarjeta-${singleNumber}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image', err);
    }
  };

  // Bulk Excel Generation
  const handleExcelDownload = () => {
    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);

    if (isNaN(start) || isNaN(end) || end < start) {
      alert("Rango inválido");
      return;
    }

    const total = end - start + 1;
    const data = [];

    for (let i = 0; i < total; i++) {
      const currentNum = (start + i).toString();
      data.push({
        "Número de Tarjeta": currentNum,
        "Contenido QR": currentNum,
        "Estado": "Generado"
      });
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tarjetas");
    XLSX.writeFile(wb, `listado-tarjetas-${start}-${end}.xlsx`);
  };

  // Bulk PDF Generation
  const handleBulkDownload = async () => {
    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);

    if (isNaN(start) || isNaN(end) || end < start) {
      alert("Rango inválido");
      return;
    }

    const total = end - start + 1;
    if (total > 500 && !confirm(`Estás a punto de generar ${total} tarjetas. Esto puede tardar unos minutos. ¿Continuar?`)) {
      return;
    }

    setIsGenerating(true);
    setProgress({ current: 0, total });

    // A4 Landscape: 297mm x 210mm
    // Card approx size: we will fit as many as possible or 1 per page for simplicity first.
    // Let's do 1 card per page centered for maximum quality/compatibility, user can print multiple per sheet in printer settings
    // OR: we try to fit 2.
    // For now: 1 card per page (landscape A5/A6 style) ensuring high quality.

    // Actually, user wants "listo para imprimir". A standard A4 usually fits 2-4 depending on card size.
    // Our card is 600px width.

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

    try {
      for (let i = 0; i < total; i++) {
        const currentNum = (start + i).toString();
        setSingleNumber(currentNum); // Update visual state

        // Wait for React to render
        await new Promise(resolve => setTimeout(resolve, 50));

        if (cardRef.current) {
          const dataUrl = await toJpeg(cardRef.current, { quality: 0.95, backgroundColor: 'white', pixelRatio: 3 });

          // Layout Configuration
          // Page Width: 210mm
          // Request: "Centered". Retaining sufficient margin for binding (3cm each side).

          const margin = 5;
          const imgWidth = pageWidth - (margin * 2); // 210 - 60 = 150mm
          // Card Aspect Ratio: 21cm / 10cm = 2.1
          const imgHeight = (10 / 21) * imgWidth; // Aspect ratio based on actual dimensions

          // 3 Cards per page logic
          const itemsPerPage = 3;
          const positionOnPage = i % itemsPerPage;

          // Add new page if it's the start of a new group (and not the very first one)
          if (i > 0 && positionOnPage === 0) {
            doc.addPage();
          }

          // Horizontal Position: Centered
          const x = margin;

          // Vertical Positioning:
          // 3 items of ~65mm height = ~195mm total used.
          // Page Height 297mm. 
          // Vertical space remaining = 297 - 195 = 102mm.
          // Top margin = (PageHeight - (TotalItemsHeight + Gaps)) / 2

          const gap = 10; // 10mm gap between cards
          const totalContentHeight = (imgHeight * itemsPerPage) + (gap * (itemsPerPage - 1));

          const startY = (pageHeight - totalContentHeight) / 2;
          const y = startY + (positionOnPage * (imgHeight + gap));

          doc.addImage(dataUrl, 'JPEG', x, y, imgWidth, imgHeight);

          // Optional: Draw cut lines between cards if desired, but user asked to remove lines on stubs, 
          // so we keep it clean.
        }
        setProgress({ current: i + 1, total });
      }

      doc.save(`tarjetas-${start}-${end}.pdf`);

    } catch (e) {
      console.error("Error bulk generating", e);
      alert("Hubo un error generando el PDF.");
    } finally {
      setIsGenerating(false);
      setSingleNumber((start).toString()); // Reset to start
    }
  };

  const handleNext = () => setSingleNumber(prev => (parseInt(prev) + 1).toString());
  const handlePrev = () => setSingleNumber(prev => (parseInt(prev) - 1).toString());

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingBottom: 50 }}>
      {/* Header & Mode Switch */}
      <h1 style={{ color: '#333', textAlign: 'center' }}>Generador de tarjetas Plot Center</h1>

      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <button
          onClick={() => setMode('single')}
          style={{ ...tabStyle, background: mode === 'single' ? '#3b82f6' : '#fff', color: mode === 'single' ? '#fff' : '#333' }}>
          Individual
        </button>
        <button
          onClick={() => setMode('bulk')}
          style={{ ...tabStyle, background: mode === 'bulk' ? '#3b82f6' : '#fff', color: mode === 'bulk' ? '#fff' : '#333' }}>
          Masivo (Rango)
        </button>
      </div>

      {/* Controls Area */}
      <div className="controls" style={controlBoxStyle}>

        {mode === 'single' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <button onClick={handlePrev} style={btnStyle} title="Anterior"><ChevronLeft size={20} /></button>
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={labelStyle}>Número</span>
                <input
                  type="text"
                  value={singleNumber}
                  onChange={(e) => setSingleNumber(e.target.value)}
                  style={inputStyle}
                />
              </label>
              <button onClick={handleNext} style={btnStyle} title="Siguiente"><ChevronRight size={20} /></button>
            </div>

            <div style={separatorStyle}></div>

            <button onClick={handleDownload} style={actionBtnStyle}>
              <Download size={18} /> Descargar JPG
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
              <label style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={labelStyle}>Desde</span>
                <input
                  type="number"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  style={inputStyle}
                />
              </label>
              <span style={{ fontWeight: 'bold', paddingTop: 15 }}>-</span>
              <label style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={labelStyle}>Hasta</span>
                <input
                  type="number"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  style={inputStyle}
                />
              </label>
            </div>

            <div style={separatorStyle}></div>

            <button
              onClick={handleBulkDownload}
              disabled={isGenerating}
              style={{ ...actionBtnStyle, background: isGenerating ? '#9ca3af' : '#2563eb' }}>
              {isGenerating ? `Generando ${progress.current}/${progress.total}...` : <><Layers size={18} /> Generar PDF</>}
            </button>

            <button
              onClick={handleExcelDownload}
              disabled={isGenerating}
              style={{ ...actionBtnStyle, background: '#16a34a' }}>
              <FileSpreadsheet size={18} /> Excel
            </button>
          </>
        )}
      </div>

      {/* Preview Area - Always visible but controlled by state during bulk gen */}
      <div style={{
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        borderRadius: 2,
        overflow: 'hidden',
        opacity: isGenerating ? 0.7 : 1,
        pointerEvents: isGenerating ? 'none' : 'all'
      }}>
        <div ref={cardRef}>
          <Card number={singleNumber} />
        </div>
      </div>

      {!isGenerating && (
        <p style={{ color: '#888', marginTop: 10, fontSize: '0.9rem', maxWidth: 500, textAlign: 'center' }}>
          {mode === 'single'
            ? "Edita el número y descarga la imagen para imprimir."
            : "Define el rango y genera el PDF o descarga el listado en Excel."}
        </p>
      )}
    </div>
  );
}

const tabStyle = {
  padding: '8px 16px',
  borderRadius: 20,
  border: '1px solid #ddd',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9rem'
};

const controlBoxStyle = {
  background: 'white',
  padding: '20px 30px',
  borderRadius: 12,
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  display: 'flex',
  gap: 15,
  alignItems: 'center',
  flexWrap: 'wrap',
  justifyContent: 'center'
};

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

const labelStyle = {
  fontSize: '0.8rem',
  color: '#666',
  marginBottom: 2
};

const separatorStyle = {
  width: 1,
  height: 40,
  background: '#eee',
  margin: '0 10px'
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
  fontWeight: 500,
  minWidth: 160,
  justifyContent: 'center'
};

export default App;
