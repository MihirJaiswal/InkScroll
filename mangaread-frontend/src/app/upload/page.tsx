'use client'
import React, { useState } from 'react';


const UploadManga: React.FC<{ authToken: any }> = ({ authToken }) => {
  console.log(authToken)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('ongoing');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genre', genre);
    formData.append('chapterNumber', String(chapterNumber));
    formData.append('tags', tags);
    formData.append('status', status);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
    if (pdf) {
      formData.append('pdf', pdf);
    }

    try {
      console.log('Auth Token:', authToken);
      const response = await fetch('http://localhost:5000/api/mangas', {
        method: 'POST',
        headers: {
          'x-auth-token': `'${authToken}'`,  
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload manga');
      }

      const data = await response.json();
      console.log('Manga uploaded successfully:', data);
      // Optionally, reset form fields here
    } catch (error) {
      console.error('Error uploading manga:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">Upload Manga</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-lg mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="py-2 px-4 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="text-lg mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="py-2 px-4 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="genre" className="text-lg mb-1">Genre</label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="py-2 px-4 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="chapterNumber" className="text-lg mb-1">Chapter Number</label>
          <input
            type="number"
            id="chapterNumber"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(Number(e.target.value))}
            className="py-2 px-4 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="tags" className="text-lg mb-1">Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="py-2 px-4 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="status" className="text-lg mb-1">Status</label>
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

        <div className="flex flex-col">
          <label htmlFor="coverImage" className="text-lg mb-1">Cover Image</label>
          <input
            type="file"
            id="coverImage"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="pdf" className="text-lg mb-1">PDF</label>
          <input
            type="file"
            id="pdf"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files ? e.target.files[0] : null)}
            required
          />
        </div>

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
  );
};

export default UploadManga;
