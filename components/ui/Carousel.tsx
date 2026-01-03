'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Article } from '@/lib/types';

interface CarouselProps {
  articles: Article[];
}

export function Carousel({ articles }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? articles.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === articles.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (!isAutoPlaying || articles.length <= 1) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, articles.length]);

  if (!articles.length) return null;

  const currentArticle = articles[currentIndex];

  return (
    <div 
      className="relative h-[500px] overflow-hidden bg-gray-900"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      {articles.map((article, index) => (
        <div
          key={article.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          {article.imageUrl && (
            <div className="absolute inset-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-full">
              <div className="max-w-2xl text-white">
                <div className="flex items-center space-x-2 mb-4">
                  {article.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-semibold border border-white/50 rounded uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-5xl font-bold mb-4 leading-tight">
                  {article.title}
                </h2>
                
                <p className="text-xl text-gray-200 mb-6 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center space-x-6 text-sm mb-8">
                  <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span>•</span>
                  <span>{article.author}</span>
                </div>

                <Link
                  href={`/artikel/${article.slug}`}
                  className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6 text-white" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {articles.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {articles.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
