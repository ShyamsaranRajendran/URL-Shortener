import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Trash2, ExternalLink } from 'lucide-react';
import { useURL, URLData } from '../contexts/URLContext';
import CopyButton from './CopyButton';
import { toast } from 'react-toastify';

const URLTable: React.FC = () => {
  const { urls, deleteUrl } = useURL();
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      deleteUrl(id);
      toast.success('Link deleted successfully');
    }
  };

  const toggleSelectAll = () => {
    if (selectedUrls.length === urls.length) {
      setSelectedUrls([]);
    } else {
      setSelectedUrls(urls.map(url => url.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedUrls.includes(id)) {
      setSelectedUrls(selectedUrls.filter(urlId => urlId !== id));
    } else {
      setSelectedUrls([...selectedUrls, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedUrls.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedUrls.length} links?`)) {
      selectedUrls.forEach(id => deleteUrl(id));
      setSelectedUrls([]);
      toast.success(`${selectedUrls.length} links deleted successfully`);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (urls.length === 0) {
    return (
      <div className="text-center py-16 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
        <ExternalLink className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No links created yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first shortened link.</p>
        <div className="mt-6">
          <Link to="/shorten" className="btn btn-primary">
            Create your first link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {selectedUrls.length > 0 && (
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            {selectedUrls.length} {selectedUrls.length === 1 ? 'item' : 'items'} selected
          </p>
          <button 
            onClick={handleBulkDelete}
            className="text-sm text-error hover:text-error-dark flex items-center"
          >
            <Trash2 size={16} className="mr-1" />
            Delete selected
          </button>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                  checked={selectedUrls.length === urls.length && urls.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short URL
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Original URL
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {urls.map((url: URLData) => (
              <tr key={url.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                    checked={selectedUrls.includes(url.id)}
                    onChange={() => toggleSelect(url.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <a 
                      href={url.shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium mr-2"
                    >
                      {url.shortUrl.replace('https://', '')}
                    </a>
                    <CopyButton textToCopy={url.shortUrl} />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <a 
                    href={url.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 hover:underline" 
                    title={url.originalUrl}
                  >
                    {truncateUrl(url.originalUrl)}
                  </a>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                  {url.clicks}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                  {url.createdAt}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                  {url.expiresAt || '—'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link 
                      to={`/analytics/${url.id}`} 
                      className="text-gray-500 hover:text-primary p-1 rounded-full hover:bg-gray-100"
                      title="View Analytics"
                    >
                      <BarChart2 size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(url.id)} 
                      className="text-gray-500 hover:text-error p-1 rounded-full hover:bg-gray-100"
                      title="Delete Link"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default URLTable;