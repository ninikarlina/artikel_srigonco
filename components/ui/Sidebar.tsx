import Link from 'next/link';
import { Article } from '@/lib/types';
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface SidebarProps {
  articles: Article[];
  title?: string;
  currentArticleId?: string;
}

export function Sidebar({ articles, title = "Artikel Terkait", currentArticleId }: SidebarProps) {
  const filteredArticles = articles
    .filter(article => article.id !== currentArticleId)
    .slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* Title */}
      <div className="border-b-2 border-gray-200 pb-3">
        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
          {title}
        </h3>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/artikel/${article.slug}`}
            className="block group"
          >
            <article className="border-l-4 border-gray-200 pl-4 hover:border-blue-600 transition-colors">
              {/* Category Badge */}
              {article.tags[0] && (
                <span className="inline-block px-2 py-0.5 text-xs font-semibold text-blue-600 border border-blue-600 rounded mb-2 uppercase">
                  {article.tags[0]}
                </span>
              )}

              {/* Title */}
              <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                {article.title}
              </h4>

              {/* Meta */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center space-x-1">
                  <UserIcon className="h-3 w-3" />
                  <span>{article.author}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Categories Section */}
      <div className="border-2 border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-4 uppercase">
          Kategori
        </h4>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(articles.flatMap(a => a.tags))).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-sm font-medium border-2 border-gray-200 text-gray-700 rounded hover:border-blue-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
