import React, { useState } from 'react';
import Button from "react-bootstrap/Button";

function Export(props) {
  const { handleParticipants } = props;
  console.log('hp= ' + handleParticipants[0]);

  const [copied, setCopied] = useState(false);
  // const dataToCopy = ['Hello, Zoom!', 'Testing Zoom!'];
  // const dataToCopyString = dataToCopy.join(', ');
  const dataToCopy = handleParticipants;
  const dataToCopyString = dataToCopy.join(', ');

  const copyToClipboardFallback = () => {
    const textarea = document.createElement('textarea');
    textarea.value = dataToCopyString;
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy:', error);
    }

    document.body.removeChild(textarea);
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(dataToCopy);
        setCopied(true);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    } else {
      console.warn("Clipboard API is not available. Using fallback.");
      copyToClipboardFallback();
    }
  };

  return (
    <>
      <p>{dataToCopy}</p>
      <Button 
        onClick={copyToClipboard}
        style={{ width: "300px", height: "38px" }}
      > 
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </Button>
    </>
  );
};

export default Export;
