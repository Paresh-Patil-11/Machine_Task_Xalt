import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, User, Eye } from 'lucide-react';

interface Blog {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
}

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {blog.title}
          </h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {truncateContent(blog.content)}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{blog.author_name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(blog.created_at), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>
        
        <Link 
          to={`/blog/${blog.id}`}
          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Read more</span>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;