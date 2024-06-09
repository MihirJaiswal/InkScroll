import React from 'react';

interface MangaPDFProps {
  pdfUrl: string;
}

const MangaPDF: React.FC<MangaPDFProps> = ({ pdfUrl }) => {
  return (
    <div>
      <object data={pdfUrl} type="application/pdf" width="100%" height="600px">
        <p>PDF cannot be displayed. Please download it instead.</p>
      </object>
    </div>
  );
};

export default MangaPDF;
