import { QRCodeSVG } from 'qrcode.react';

function QRCodeBlock({ value, size = 120 }) {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '12px',
        background: '#fff',
        borderRadius: '14px',
        boxShadow: '0 8px 24px rgba(0,0,0,.35)',
      }}
    >
      <QRCodeSVG value={value} size={size} bgColor="#ffffff" fgColor="#08080a" level="M" />
    </div>
  );
}

export default QRCodeBlock;