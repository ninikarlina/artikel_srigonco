import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center space-x-4">
              <span>{new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Image src="/logo.svg" alt="Logo" width={50} height={50} className="h-8 w-8 md:h-12 md:w-12" />
              <div>
                <h1 className="text-lg md:text-3xl font-bold text-gray-900 tracking-tight">ARTIKEL SRIGONCO</h1>
                <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wider">Portal Berita Desa</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors uppercase tracking-wide"
              >
                Berita
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
