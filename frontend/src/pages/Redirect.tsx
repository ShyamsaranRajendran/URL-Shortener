import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Redirect = () => {
  const { code } = useParams();

  useEffect(() => {
    if (code) {
      // Redirect directly to the backend endpoint
      window.location.href = `http://localhost:3000/url/${code}`;
    }
  }, [code]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-600">Redirecting to your link...</p>
    </div>
  );
};

export default Redirect;
