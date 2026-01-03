export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 border-4 border-blue-600 rounded-full">
          <span className="text-4xl font-bold text-blue-600">404</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h1>
        <p className="text-gray-600 mb-8">Maaf, artikel yang Anda cari tidak dapat ditemukan.</p>
        <a 
          href="/"
          className="inline-flex px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
