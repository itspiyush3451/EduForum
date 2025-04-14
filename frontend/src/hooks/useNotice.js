// src/hooks/useNotice.js
import { useContext } from 'react';
import NoticeContext from '../context/NoticeContext';

const useNotice = () => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error('useNotice must be used within a NoticeProvider');
  }
  return context;
};

export default useNotice;
