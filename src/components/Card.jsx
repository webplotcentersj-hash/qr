import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './Card.css';

const Card = ({ number = "100001", qrValue }) => {
    return (
        <div className="card-wrapper" id="card-capture">
            <div className="card-class-strip" style={{ position: 'absolute', left: 20, top: 40, width: 20, height: 2, background: '#ccc' }}></div>
            {/* Decorative staple marks simulation could go here */}

            <div className="card-header">
                {/* Logo removed */}
            </div>

            <div className="card-body">
                <div className="fields-container">
                    <div className="field-row">
                        <span className="field-label">Fecha:</span>
                        <div className="field-line"></div>
                    </div>

                    <div className="field-row field-split">
                        <div style={{ display: 'flex', width: '60%' }}>
                            <span className="field-label">Pozo:</span>
                            <div className="field-line"></div>
                        </div>
                        <div style={{ display: 'flex', width: '40%' }}>
                            <span className="field-label" style={{ minWidth: 'auto', marginLeft: 5 }}>Tipo:</span>
                            <div className="field-line"></div>
                        </div>
                    </div>

                    <div className="field-row">
                        <span className="field-label">Coord:</span>
                        <div className="field-line"></div>
                    </div>

                    <div className="field-row field-split">
                        <div style={{ display: 'flex', width: '50%' }}>
                            <span className="field-label">Desde:</span>
                            <div className="field-line"></div>
                        </div>
                        <div style={{ display: 'flex', width: '50%' }}>
                            <span className="field-label" style={{ minWidth: 'auto', marginLeft: 5 }}>Hasta:</span>
                            <div className="field-line"></div>
                        </div>
                    </div>

                    <div className="comments-section">
                        <span className="comments-label">Comentarios:</span>
                        <div className="comment-line"></div>
                        <div className="comment-line"></div>
                        <div className="comment-line"></div>
                    </div>
                </div>

                <div className="card-right-panel">
                    <div className="card-number">
                        N°: {number}
                    </div>
                    <div className="qr-container">
                        <QRCodeCanvas value={qrValue || number} size={90} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
