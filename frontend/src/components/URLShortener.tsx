import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useURL } from '../contexts/URLContext';
import CopyButton from './CopyButton';

interface ShortenerFormData {
  url: string;
  customAlias?: string;
  expiresAt?: string;
}

const URLShortener = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShortenerFormData>();
  const { addUrl } = useURL();
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  const onSubmit = async (data: ShortenerFormData) => {
    try {
      setIsLoading(true);
      const newUrl = await addUrl({
        originalUrl: data.url,
        customAlias: data.customAlias,
        expiresAt: data.expiresAt,
      });
      if (newUrl?.shortUrl) {
        setShortenedUrl(newUrl.shortUrl);
        toast.success('URL shortened successfully!');
        reset();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to shorten URL. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto card shadow-custom animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center">
          <Link2 className="mr-2 text-primary" size={24} />
          Shorten your link
        </h2>
        <p className="text-gray-600 mt-2">
          Paste your long URL to create a shorter, more manageable link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-3">
          <input
            type="url"
            placeholder="Enter your long URL here"
            className={`input-field ${errors.url ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
            {...register('url', {
              required: 'URL is required',
              pattern: {
                value: /^https?:\/\/\S+$/,
                message: 'Please enter a valid URL',
              },
            })}
            disabled={isLoading}
          />
          {errors.url && <p className="mt-1 text-sm text-error">{errors.url.message}</p>}

          <input
            type="text"
            placeholder="Custom alias (optional)"
            className="input-field"
            {...register('customAlias')}
            disabled={isLoading}
          />

          <input
            type="datetime-local"
            className="input-field"
            {...register('expiresAt')}
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`btn btn-primary ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Shortening...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </div>
      </form>

      {shortenedUrl && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Your shortened URL:</p>
              <p className="text-primary font-medium break-all">{shortenedUrl}</p>
            </div>
            <CopyButton textToCopy={shortenedUrl} />
          </div>
        </div>
      )}
    </div>
  );
};

export default URLShortener;
