import { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

export interface URLData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  slug: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  userId: string;
}

interface URLContextType {
  urls: URLData[];
  addUrl: (originalUrl: string, customSlug?: string, expiresAt?: string) => Promise<URLData>;
  getUrlById: (id: string) => URLData | undefined;
  incrementClicks: (id: string) => void;
  deleteUrl: (id: string) => void;
}

const URLContext = createContext<URLContextType | undefined>(undefined);

export function useURL() {
  const context = useContext(URLContext);
  if (context === undefined) {
    throw new Error('useURL must be used within an URLProvider');
  }
  return context;
}

// Mock data
const mockUrls: URLData[] = [
  {
    id: '1',
    originalUrl: 'https://www.example.com/very/long/path/to/some/resource/that/is/important',
    shortUrl: 'https://sho.rt/abc123',
    slug: 'abc123',
    clicks: 42,
    createdAt: format(new Date('2025-01-15'), 'yyyy-MM-dd'),
    userId: '1'
  },
  {
    id: '2',
    originalUrl: 'https://www.anotherexample.com/blog/top-10-reasons-to-use-url-shorteners',
    shortUrl: 'https://sho.rt/def456',
    slug: 'def456',
    clicks: 28,
    createdAt: format(new Date('2025-02-10'), 'yyyy-MM-dd'),
    userId: '1'
  },
  {
    id: '3',
    originalUrl: 'https://www.docs.example.com/api/reference/v2/newest-features',
    shortUrl: 'https://sho.rt/ghi789',
    slug: 'ghi789',
    clicks: 105,
    createdAt: format(new Date('2025-03-05'), 'yyyy-MM-dd'),
    expiresAt: format(new Date('2025-06-05'), 'yyyy-MM-dd'),
    userId: '1'
  }
];

export function URLProvider({ children }: { children: ReactNode }) {
  const [urls, setUrls] = useState<URLData[]>(mockUrls);

  const generateRandomSlug = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const addUrl = async (originalUrl: string, customSlug?: string, expiresAt?: string): Promise<URLData> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const slug = customSlug || generateRandomSlug();
    const shortUrl = `https://sho.rt/${slug}`;
    
    const newUrl: URLData = {
      id: Date.now().toString(),
      originalUrl,
      shortUrl,
      slug,
      clicks: 0,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      expiresAt: expiresAt ? format(new Date(expiresAt), 'yyyy-MM-dd') : undefined,
      userId: '1' // In a real app, this would be the current user's ID
    };
    
    setUrls(prevUrls => [newUrl, ...prevUrls]);
    return newUrl;
  };

  const getUrlById = (id: string): URLData | undefined => {
    return urls.find(url => url.id === id);
  };

  const incrementClicks = (id: string): void => {
    setUrls(prevUrls => 
      prevUrls.map(url => 
        url.id === id ? { ...url, clicks: url.clicks + 1 } : url
      )
    );
  };

  const deleteUrl = (id: string): void => {
    setUrls(prevUrls => prevUrls.filter(url => url.id !== id));
  };

  const value = {
    urls,
    addUrl,
    getUrlById,
    incrementClicks,
    deleteUrl
  };

  return <URLContext.Provider value={value}>{children}</URLContext.Provider>;
}