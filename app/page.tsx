import { getArticles } from '@/lib/data';
import { ArticleCard } from '@/components/ui/Card';
import { Carousel } from '@/components/ui/Carousel';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  const articles = getArticles();
  const featuredArticles = articles.slice(0, 3);
  const recentArticles = articles.slice(0, 6);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Carousel */}
        {articles.length > 0 && <Carousel articles={featuredArticles} />}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column - Articles */}
            <div className="lg:col-span-2">
              {/* Section Title */}
              <div className="border-b-2 border-gray-900 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 pb-4 uppercase tracking-wide">
                  Berita Terbaru
                </h2>
              </div>

              {articles.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      title={article.title}
                      excerpt={article.excerpt}
                      author={article.author}
                      date={article.publishedAt}
                      imageUrl={article.imageUrl}
                      tags={article.tags}
                      slug={article.slug}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar articles={articles} title="Artikel Populer" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
