'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UploadManga: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
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
    formData.append('description', description);
    formData.append('genre', genre);
    formData.append('chapterNumber', String(chapterNumber));
    formData.append('tags', tags);
    formData.append('status', status);
    if (coverImage) formData.append('coverImage', coverImage);
    if (pdf) formData.append('pdf', pdf);

    try {
      const response = await fetch('http://localhost:5000/api/mangas', {
        method: 'POST',
        headers: { 'x-auth-token': authToken ?? "" },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload manga');

      const data = await response.json();
      console.log('Manga uploaded successfully:', data);
      toast.success('Manga uploaded successfully');
      setTitle('');
      setDescription('');
      setGenre('');
      setChapterNumber(1);
      setTags('');
      setStatus('ongoing');
      setCoverImage(null);
      setPdf(null);
    } catch (error) {
      console.error('Error uploading manga:', error);
      toast.error('Error uploading manga');
    }
  };

  return (
    <div className='md:px-44 p-4 border border-white'>
      <div className="container mx-auto px-4 py-8 text-gray-900">
        <h1 className="text-3xl font-bold mb-4 text-center text-white">Upload Manga</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {['title', 'description', 'genre', 'chapterNumber', 'tags'].map((field, index) => (
            <div key={index} className="flex flex-col">
              <label htmlFor={field} className="text-lg mb-1 text-white">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {field !== 'chapterNumber' ? (
                <input
                  type={field === 'description' ? 'textarea' : 'text'}
                  id={field}
                  value={field === 'chapterNumber' ? chapterNumber : eval(field)}
                  onChange={(e) => field === 'chapterNumber' ? setChapterNumber(Number(e.target.value)) : eval(`set${field.charAt(0).toUpperCase() + field.slice(1)}`)(e.target.value)}
                  className="py-2 px-4 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              ) : (
                <input
                  type="number"
                  id={field}
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(Number(e.target.value))}
                  className="py-2 px-4 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  required
                />
              )}
            </div>
          ))}
          <div className="flex flex-col text-black">
            <label htmlFor="status" className="text-lg mb-1 text-white">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-2 px-4 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {['coverImage', 'pdf'].map((field, index) => (
            <div key={index} className="flex flex-col text-white">
              <label htmlFor={field} className="text-lg mb-1 text-white">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="file"
                id={field}
                accept={field === 'coverImage' ? 'image/*' : 'application/pdf'}
                onChange={(e) => field === 'coverImage' ? setCoverImage(e.target.files ? e.target.files[0] : null) : setPdf(e.target.files ? e.target.files[0] : null)}
                required
              />
            </div>
          ))}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Upload Manga
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default UploadManga;
