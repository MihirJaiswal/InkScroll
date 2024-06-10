'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function PDFViewer() {
  const pathname = usePathname();
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        let pdfName = pathname.split('/').pop();
        const response = await fetch(`http://localhost:5000/api/pdfs/${pdfName}`, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${pdfName}"`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const pdfData = await response.blob();
        const url = URL.createObjectURL(pdfData);
        setPdfUrl(url);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        setLoading(false);
      }
    };

    fetchPdf();
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pathname]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {loading ? (
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg">
          {pdfUrl && (
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-[100vw] h-screen"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default PDFViewer;
