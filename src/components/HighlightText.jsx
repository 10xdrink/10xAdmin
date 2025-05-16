// src/components/HighlightText.jsx

import React from 'react';

/**
 * HighlightText component to highlight search query matches in text
 * @param {Object} props - Component props
 * @param {String} props.text - The text to display
 * @param {String} props.highlight - The text to highlight
 * @returns {JSX.Element}
 */
const HighlightText = ({ text, highlight }) => {
  if (!highlight) return <span>{text}</span>;

  // Escape special characters in highlight for regex
  const escapedHighlight = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

  const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default HighlightText;
