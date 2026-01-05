import { FiSearch } from 'react-icons/fi';

interface PageHeaderProps {
  title: string;
  highlightedTitle?: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function PageHeader({
  title,
  highlightedTitle,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  gradientFrom = "from-primary-600",
  gradientTo = "to-accent-500"
}: PageHeaderProps) {
  return (
    <div className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight mb-6">
          {title}{' '}
          {highlightedTitle && (
            <span className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
              {highlightedTitle}
            </span>
          )}
        </h1>
        
        <p className="mt-4 max-w-2xl mx-auto text-xl text-neutral-600 mb-10">
          {description}
        </p>

        {/* Modern Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
          <div className={`absolute -inset-1 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 blur`}></div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-6 w-6 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 shadow-lg text-lg transition-all"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchValue && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <span className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}