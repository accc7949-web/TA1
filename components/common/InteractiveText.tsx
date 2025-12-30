import React from 'react';

interface InteractiveTextProps {
  text: string;
  showDetail: (word: string) => void;
  variant?: 'on-light' | 'on-dark';
}

const InteractiveText: React.FC<InteractiveTextProps> = ({ text, showDetail, variant = 'on-light' }) => {
  const handleClick = (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    // Remove punctuation from the end of the word before looking it up
    const cleanText = word.replace(/[.,!?;:"']$/, '');
    if (cleanText) {
      showDetail(cleanText);
    }
  };

  // Split the text by spaces, but keep the spaces so we can render them.
  const elements = text.split(/(\s+)/);

  const styleClasses = variant === 'on-dark'
    ? 'text-sky-100 hover:text-white hover:underline disabled:text-sky-100 disabled:no-underline'
    : 'hover:text-sky-600 hover:underline disabled:no-underline';


  return (
    <>
      {elements.map((element, index) => {
        // If the element is just whitespace, render it as plain text.
        if (/^\s+$/.test(element)) {
          return <React.Fragment key={index}>{element}</React.Fragment>;
        }
        
        // Disable the button if the element is not a valid word (e.g., just punctuation).
        const isDisabled = !/^[a-zA-Z]+(-[a-zA-Z]+)*$/.test(element.replace(/[.,!?;:"']$/, ''));

        return (
          <button
            key={index}
            onClick={(e) => handleClick(e, element)}
            className={`transition-colors disabled:cursor-default ${styleClasses}`}
            disabled={isDisabled}
          >
            {element}
          </button>
        );
      })}
    </>
  );
};

export default InteractiveText;
