'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UploadChapter: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState<number | ''>('');
  const [subTitle, setSubTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdf, setPdf] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) router.push('/login');
    else setAuthToken(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('chapterNumber', String(chapterNumber));
    formData.append('subTitle', subTitle);
    formData.append('description', description);
    if (pdf) formData.append('pdf', pdf);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      const response = await fetch('http://localhost:5000/api/mangas/add-chapter', {
        method: 'POST',
        headers: { 'x-auth-token': authToken ?? "" },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload chapter');

      const data = await response.json();
      console.log('Chapter uploaded successfully:', data);
      toast.success('Chapter uploaded successfully');
      setTitle('');
      setChapterNumber('');
      setSubTitle('');
      setDescription('');
      setPdf(null);
      setCoverImage(null);
    } catch (error) {
      console.error('Error uploading chapter:', error);
      toast.error('Error uploading chapter');
    }
  };

  return (
    <div className="container mx-auto px-4  text-gray-200">
      <div className="flex flex-wrap justify-center items-start">
        <div className="w-full md:w-2/3 lg:w-1/2 p-4">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-500">
            <h1 className="md:text-3xl text-xl font-bold mb-4 text-center text-gray-200">Upload Chapter</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col">
                <label htmlFor="title" className="text-lg mb-1 text-gray-200">Manga Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="py-2 px-4 rounded-md bg-gray-700 border-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="chapterNumber" className="text-lg mb-1 text-gray-200">Chapter Number</label>
                <input
                  type="number"
                  id="chapterNumber"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(Number(e.target.value))}
                  className="py-2 px-4 rounded-md bg-gray-700 border-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="subTitle" className="text-lg mb-1 text-gray-200">Subtitle</label>
                <input
                  type="text"
                  id="subTitle"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  className="py-2 px-4 rounded-md bg-gray-700 border-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label htmlFor="description" className="text-lg mb-1 text-gray-200">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="py-2 px-4 rounded-md bg-gray-700 border-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="pdf" className="text-lg mb-1 text-gray-200">PDF</label>
                <input
                  type="file"
                  id="pdf"
                  accept="application/pdf"
                  onChange={(e) => setPdf(e.target.files ? e.target.files[0] : null)}
                  required
                  className="text-gray-400"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="coverImage" className="text-lg mb-1 text-gray-200">Cover Image</label>
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
                  required
                  className="text-gray-400"
                />
              </div>
              <div className="flex justify-center md:col-span-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 w-full mt-8 rounded-lg hover:bg-blue-600"
                >
                  Upload Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadChapter;
