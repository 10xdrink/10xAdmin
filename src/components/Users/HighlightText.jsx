// src/components/Users/HighlightText.jsx

import React from 'react';

/**
 * Highlights the search term within the text.
 * @param {Object} props
 * @param {string} props.text - The text to search within.
 * @param {string} props.searchTerm - The term to highlight.
 * @returns {JSX.Element|string} - JSX with highlighted search term or plain text.
 */
const HighlightText = ({ text, searchTerm }) => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

/**
 * Escapes RegExp special characters in a string.
 * @param {string} string - The string to escape.
 * @returns {string} - Escaped string.
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
};

export default HighlightText;
