'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import logo from '../../../public/Designer__53_-photoaidcom-cropped-removebg-preview (2).png';

const UploadManga: React.FC = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Action');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [step, setStep] = useState(1);
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
      setGenre('Action');
      setChapterNumber(1);
      setTags('');
      setStatus('ongoing');
      setCoverImage(null);
      setPdf(null);
      setStep(1);
    } catch (error) {
      console.error('Error uploading manga:', error);
      toast.error('Error uploading manga');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="flex flex-col">
              <label htmlFor="title" className="text-lg mb-1 text-gray-200">Title</label>
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
              <label htmlFor="description" className="text-lg mb-1 text-gray-200">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="py-2 px-4 rounded-md bg-gray-700 border-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="flex flex-col">
              <label htmlFor="genre" className="text-lg mb-1 text-gray-200">Genre</label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="py-2 px-4 rounded-md bg-gray-700 border-gray-700 focus:border-white focus:ring focus:ring-gray-500 focus:ring-opacity-50"
                required
              >
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Horror">Horror</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Slice of Life">Slice of Life</option>
                <option value="Thriller">Thriller</option>
              </select>
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
          </>
        );
      case 3:
        return (
          <>
            <div className="flex flex-col">
              <label htmlFor="tags" className="text-lg mb-1 text-gray-200">Tags</label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="py-2 px-4 rounded-md bg-gray-700 border-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="status" className="text-lg mb-1 text-gray-200">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="py-2 px-4 rounded-md bg-gray-700 border-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className='flex flex-col md:flex-row justify-between'>
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
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto md:px-4 md:py-8 text-gray-200">
      <div className="flex flex-wrap justify-center items-start">
        <div className="w-full md:w-2/3 lg:w-1/2 md:p-4 py-4">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-500">
            <h1 className="md:text-3xl text-xl font-bold mb-4 text-center text-gray-200">Upload Manga</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStep()}
              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={nextStep}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Upload
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadManga;
