'use client'
import { usePDF } from 'react-to-pdf';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function PDFViewer() {
  const pathname = usePathname();
  const [pdfUrl, setPdfUrl] = useState('');
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        let pdfName = pathname.split('/').pop(); // Extract the PDF filename from the pathname
        
        const response = await fetch(`http://localhost:5000/api/pdfs/${pdfName}`, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${pdfName}"`,
          },
          //here if link contain uploads word just remove
        });
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        const pdfData = await response.blob();
        const url = URL.createObjectURL(pdfData);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF:', error);
        // Optionally handle the error, e.g., display an error message to the user
      }
    };

    fetchPdf();
    // Cleanup function to revoke the object URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pathname]);

  return (
    <div>
      {pdfUrl && (
        <div ref={targetRef} className='flex flex-col items-center'>
          <button onClick={() => toPDF()}>Download PDF</button>
          <embed src={pdfUrl} type="application/pdf" className='w-full md:w-[50%] h-[100vh]' /> 
        </div>
      )}
    </div>
  );
}

export default PDFViewer;

