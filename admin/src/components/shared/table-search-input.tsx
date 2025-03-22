import React, { useCallback } from 'react';
import { Input } from '../ui/input';
import { useDebounce } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';

export default function TableSearchInput({
  placeholder,
}: {
  placeholder?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get('search') || ''; // Search term for username
  const [searchTerm, setSearchTerm] = React.useState(username);
  
  // Debounce the search input to avoid multiple requests in a short period
  const [debouncedValue] = useDebounce(searchTerm, 1000);
  
  const handleSettingSearchParams = useCallback((newSearchValue: string) => {
    // Update the URL with the new search value
    if (newSearchValue === '' || newSearchValue === undefined || !newSearchValue) {
      searchParams.delete('search');  // Remove 'search' parameter if empty
      setSearchParams(searchParams);
      return;
    }
    setSearchParams({
      ...Object.fromEntries(searchParams), // Keep other query params like pagination
      page: '1', // Always reset to page 1 when search changes
      search: newSearchValue, // Set the search parameter with the new search term
    });
  }, [searchParams, setSearchParams]);

  // Update the search params when debounced value changes
  React.useEffect(() => {
    handleSettingSearchParams(debouncedValue);
  }, [debouncedValue, handleSettingSearchParams]);

  return (
    <Input
      placeholder={placeholder || 'Search by username...'} // Adjust placeholder for username
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)} // Update search term
      className="w-full md:max-w-sm"
    />
  );
}
