'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  resultCount: number;
}

export default function SearchBar({ onSearch, resultCount }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Blog yazılarında ara..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
      <div className="mt-2 text-sm text-gray-400">
        {resultCount > 0 ? `${resultCount} sonuç bulundu` : 'Tüm yazılar gösteriliyor'}
      </div>
    </div>
  );
}
