'use client';
import React, { useState } from 'react';
import { FaPaperPlane, FaUserCircle, FaTrashAlt } from 'react-icons/fa';
import Modal from './Modal'; // Import your Modal component

interface Comment {
  _id: string;
  user: {
    username: string;
    profilePicture: string;
  };
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  mangaTitle: string;
  comments: Comment[];
  isSignedIn: boolean;
  onCommentAdded: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ mangaTitle, comments, isSignedIn, onCommentAdded, onCommentDeleted }) => {
  const [commentText, setCommentText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/mangas/${mangaTitle}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token ?? '',
        },
        body: JSON.stringify({ text: commentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      const newComment = await response.json(); // Assuming response returns the new comment
      onCommentAdded(newComment);
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      // Show the modal for confirmation
      setShowModal(true);
      setCommentIdToDelete(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setShowModal(false);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/mangas/${mangaTitle}/comments/${commentIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token ?? '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      onCommentDeleted(commentIdToDelete);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setCommentIdToDelete('');
  };

  const username = localStorage.getItem('username'); // Get username from localStorage

  return (
    <div className="mt-8 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70">
      <h2 className="text-xl font-semibold text-gray-200 my-8">Comments</h2>
      {isSignedIn && (
        <div className="mt-4 flex items-center space-x-4 rounded-lg border-b border-gray-600">
          <textarea
            className="w-full relative p-2 rounded-t-lg bg-gray-950 text-white placeholder-gray-400"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <FaPaperPlane
            className="text-white absolute right-12 cursor-pointer hover:text-blue-700 transition duration-200"
            size={24}
            onClick={handleCommentSubmit}
          />
        </div>
      )}
      <ul className="space-y-4 bg-gray-950 p-2 rounded-b-lg">
        {comments.slice().reverse().map((comment) => (
          <li key={comment._id} className="flex items-start space-x-4 p-4 bg-gray-950 rounded-2xl">
            {comment.user.profilePicture ? (
              <img
                src={`http://localhost:5000/${comment.user.profilePicture}`}
                alt={comment.user.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaUserCircle className="text-gray-500 w-10 h-10" />
            )}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <p className="text-gray-300">
                  <h2 className="text-white font-bold">{comment.user.username}</h2> {comment.text}
                </p>
                <div className='md:flex flex-col justify-center items-center gap-2'>
                  <p className="text-gray-500 text-xs md:text-sm py-1">{new Date(comment.createdAt).toLocaleString()}</p>
                  {isSignedIn && username === comment.user.username && (
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer hover:text-red-700 transition duration-200"
                      size={16}
                      onClick={() => handleCommentDelete(comment._id)}
                    />
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for confirmation */}
      <Modal
        isOpen={showModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this comment?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default CommentSection;
