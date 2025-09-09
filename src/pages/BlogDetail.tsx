import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, User, Edit, Trash2, ArrowLeft, Loader } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at: string;
}

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/api/blogs/${id}`);
      setBlog(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      await axios.delete(`/api/blogs/${id}`);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete blog');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error || 'Blog not found'}</div>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.id === blog.author_id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all blogs</span>
        </Link>
      </div>

      <article className="card">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{blog.author_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{format(new Date(blog.created_at), 'MMMM dd, yyyy')}</span>
              </div>
              {blog.updated_at !== blog.created_at && (
                <span className="text-sm text-gray-500">
                  (Updated {format(new Date(blog.updated_at), 'MMM dd, yyyy')})
                </span>
              )}
            </div>

            {isAuthor && (
              <div className="flex items-center space-x-2">
                <Link 
                  to={`/edit/${blog.id}`}
                  className="btn-secondary flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-1 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{deleteLoading ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {blog.content}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;