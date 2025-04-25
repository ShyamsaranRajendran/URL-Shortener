import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2, Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useURL } from '../contexts/URLContext';
import CopyButton from '../components/CopyButton';

interface ShortenFormData {
  url: string;
  customSlug: string;
  expiresAt: string;
}

const ShortenPage = () => {
  const { addUrl } = useURL();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [shortenedURL, setShortenedURL] = useState<string | null>(null);
  const [showExpiration, setShowExpiration] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ShortenFormData>();

  const onSubmit = async (data: ShortenFormData) => {
    try {
      setIsLoading(true);
      const newUrl = await addUrl(
        data.url, 
        data.customSlug || undefined, 
        data.expiresAt || undefined
      );
      
      setShortenedURL(newUrl.shortUrl);
      toast.success('URL shortened successfully!');
      // Don't reset the form to allow the user to see their inputs
    } catch (error) {
      toast.error('Failed to shorten URL. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAnother = () => {
    setShortenedURL(null);
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card shadow-sm"
      >
        <div className="flex items-center mb-6">
          <div className="h-10 w-10 rounded-md bg-primary/10 text-primary mr-4 flex items-center justify-center">
            <Link2 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Create New Link</h1>
            <p className="text-gray-600 text-sm">
              Shorten your URL and track its performance
            </p>
          </div>
        </div>

        {!shortenedURL ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="url" className="label">
                Original URL
              </label>
              <input
                id="url"
                type="url"
                className={`input-field ${errors.url ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                placeholder="https://example.com/your-long-url"
                {...register('url', { 
                  required: 'URL is required',
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Please enter a valid URL'
                  }
                })}
              />
              {errors.url && (
                <p className="mt-1 text-sm text-error">{errors.url.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="customSlug" className="label">
                Custom Back-half (optional)
              </label>
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                  sho.rt/
                </span>
                <input
                  id="customSlug"
                  type="text"
                  className={`flex-1 input-field rounded-l-none ${errors.customSlug ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                  placeholder="my-custom-url"
                  {...register('customSlug', {
                    pattern: {
                      value: /^[a-zA-Z0-9-_]+$/,
                      message: 'Only letters, numbers, hyphens, and underscores are allowed'
                    },
                    maxLength: {
                      value: 20,
                      message: 'Custom slug must be 20 characters or less'
                    }
                  })}
                />
              </div>
              {errors.customSlug && (
                <p className="mt-1 text-sm text-error">{errors.customSlug.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to generate a random back-half
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="expiresAt" className="label mb-0">
                  Set Expiration Date (optional)
                </label>
                <button
                  type="button"
                  className="text-sm text-primary"
                  onClick={() => setShowExpiration(!showExpiration)}
                >
                  {showExpiration ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showExpiration && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="expiresAt"
                    type="date"
                    className={`input-field pl-10 ${errors.expiresAt ? 'border-error focus:border-error focus:ring-error/20' : ''}`}
                    {...register('expiresAt', {
                      validate: value => {
                        if (!value) return true;
                        const date = new Date(value);
                        const today = new Date();
                        return date > today || 'Expiration date must be in the future';
                      }
                    })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.expiresAt && (
                    <p className="mt-1 text-sm text-error">{errors.expiresAt.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                className={`btn btn-primary w-full sm:w-auto flex items-center justify-center ${
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
                  <>
                    <Zap size={18} className="mr-2" />
                    Shorten URL
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-center py-4">
              <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center">
                <CheckCircle2 size={24} />
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">URL Shortened Successfully!</h2>
              <p className="text-gray-600">
                Your shortened URL is ready to use and share.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-500 mb-1">Your shortened URL:</p>
              <div className="flex items-center justify-between">
                <p className="text-primary font-medium break-all">{shortenedURL}</p>
                <CopyButton textToCopy={shortenedURL} />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={createAnother}
                className="btn btn-outline"
              >
                Create Another Link
              </button>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShortenPage;