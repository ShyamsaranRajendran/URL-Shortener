import React, { createContext, useContext, useEffect, useState } from 'react';

interface Url {
  originalUrl: string;
  shortUrl: string;
  short_code: string;
  customAlias?: string;
  expiresAt?: string;
  clicks: number;
  createdAt: string;
}

interface AddUrlParams {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
}

interface URLContextType {
  urls: Url[];
  addUrl: (data: AddUrlParams) => Promise<Url>;
  fetchUrls: () => Promise<void>;
}

const URLContext = createContext<URLContextType | undefined>(undefined);

export const URLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urls, setUrls] = useState<Url[]>([]);

  // Fetch user's URLs from backend
  const fetchUrls = async () => {
    try {
      const res = await fetch('http://localhost:3000/url/list12', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch URLs');
      const data = await res.json();
      setUrls(data.urls || []);
    } catch (err) {
      console.error(err);
      setUrls([]);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const addUrl = async (data: AddUrlParams) => {
    const res = await fetch('http://localhost:3000/url/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error || 'Failed to shorten URL');
    }

    const result = await res.json();
    const shortUrl = `${window.location.origin}/url/${result.short_code}`;

    const newUrl = { ...result, shortUrl };
    setUrls(prev => [newUrl, ...prev]); // add to list immediately

    return newUrl;
  };

  return (
    <URLContext.Provider value={{ urls, addUrl, fetchUrls }}>
      {children}
    </URLContext.Provider>
  );
};

export const useURL = (): URLContextType => {
  const context = useContext(URLContext);
  if (!context) {
    throw new Error('useURL must be used within a URLProvider');
  }
  return context;
};
