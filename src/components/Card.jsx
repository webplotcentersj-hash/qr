import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './Card.css';
import logo from '../assets/logo.png';

const Card = ({ number = "100001", qrValue }) => {
    return (
        <div className="card-wrapper" id="card-capture">

            {/* Main Card Section */}
            <div className="main-card-section">

                {/* Header: Logo & Number (Left) | QR (Right) */}
                <div className="card-header">
                    <div className="header-left">
                        <img src={logo} alt="McEwen Copper" className="card-logo" />
                        <div className="card-number-large">N°: {number}</div>
                    </div>
                    <div className="header-right">
                        <QRCodeCanvas value={qrValue || number} size={80} />
                    </div>
                </div>

                <div className="card-body">
                    <div className="fields-container">

                        {/* 1. Fecha */}
                        <div className="field-row">
                            <span className="field-label">Fecha:</span>
                            <div className="field-line-date" style={{ width: '30px' }}></div>
                            <span style={{ margin: '0 5px' }}>/</span>
                            <div className="field-line-date" style={{ width: '30px' }}></div>
                            <span style={{ margin: '0 5px' }}>/</span>
                            <div className="field-line-date" style={{ width: '40px' }}></div>
                        </div>

                        {/* 2. Pozo / Tipo */}
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

                        {/* 3. Desde / Hasta (Moved up before Coord) */}
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

                        {/* 4. Coord (Moved down after Desd/Hasta) */}
                        <div className="field-row">
                            <span className="field-label">Coord:</span>
                            <div className="field-line"></div>
                        </div>

                        {/* 5. Comentarios */}
                        <div className="comments-section">
                            <span className="comments-label">Comentarios:</span>
                            <div className="comment-line"></div>
                            <div className="comment-line"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Triplicate Stubs Section */}
            <div className="stubs-section">
                {[1, 2, 3].map((stub) => (
                    <div key={stub} className="stub">
                        <div className="stub-content">
                            <QRCodeCanvas value={qrValue || number} size={50} />
                            <span className="stub-number" style={{ color: '#333' }}>N°: {number}</span>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Card;
