import { ReactNode } from 'react';
import Link from 'next/link';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  const hoverClass = hoverable ? 'hover:border-blue-600 hover:shadow-lg transition-all duration-300' : '';
  
  return (
    <div className={`border-2 border-gray-200 rounded-lg p-6 bg-white ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}

interface ArticleCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  imageUrl?: string | null;
  tags: string[];
  slug: string;
}

export function ArticleCard({ title, excerpt, author, date, imageUrl, tags, slug }: ArticleCardProps) {
  return (
    <Link href={`/artikel/${slug}`}>
      <article className="group bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-600 hover:shadow-xl transition-all duration-300 h-full flex flex-col md:flex-row">
        {imageUrl && (
          <div className="md:w-1/3 h-48 md:h-56 overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-gray-200 shrink-0 relative">
            <img 
              src={imageUrl} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="px-2 py-1 text-xs font-semibold border border-blue-600 text-blue-600 rounded uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-2 flex-1">{excerpt}</p>
          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
            <span className="font-medium">{author}</span>
            <span>{new Date(date).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
