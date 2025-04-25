import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CopyToClipboard text={textToCopy} onCopy={handleCopy}>
      <button
        className={`btn ${
          copied ? 'bg-success hover:bg-success-dark' : 'btn-outline'
        } flex items-center gap-1 transition-all duration-300`}
      >
        {copied ? (
          <>
            <Check size={18} />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy size={18} />
            <span>Copy</span>
          </>
        )}
      </button>
    </CopyToClipboard>
  );
};

export default CopyButton;