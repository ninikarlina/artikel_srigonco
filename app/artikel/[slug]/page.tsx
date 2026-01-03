import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getArticles } from '@/lib/data';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeftIcon, CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const allArticles = getArticles();

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                {article.imageUrl && (
                  <div className="w-full h-96 overflow-hidden border-b-2 border-gray-200">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium border border-blue-600 text-blue-600 rounded-md uppercase"
                      >
                        <TagIcon className="h-4 w-4" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {article.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex items-center space-x-6 pb-6 mb-6 border-b-2 border-gray-200 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-5 w-5" />
                      <span className="font-medium">{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-5 w-5" />
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Content with Typography */}
                  <div className="prose prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-gray-900
                    prose-h1:text-3xl prose-h1:border-b-2 prose-h1:border-gray-200 prose-h1:pb-4 prose-h1:mb-6
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-blue-600 prose-a:font-medium hover:prose-a:text-blue-700
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                    prose-li:text-gray-700 prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic
                    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                  ">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar 
                articles={allArticles} 
                title="Artikel Terkait"
                currentArticleId={article.id}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
