import { WordListContext } from 'providers';
import { useCallback, useContext } from 'react';

interface IQuote {
  content: string;
  author: string;
}

const useQuote = () => {
  const { setWordList, setWordCount, setLoading } = useContext(WordListContext);

  return useCallback(() => {
    setLoading(true);
    fetch('https://api.quotable.io/random?minLength=100')
      .then((response) => response.json())
      .then((quote: IQuote) => {
        const quoteContent = quote.content.split(' ');
        setWordList(quoteContent);
        setWordCount(quoteContent.length);
        setLoading(false);
      });
  }, [setWordList, setWordCount]);
};

export default useQuote;
