import { WordListContext } from 'providers';
import { useCallback, useContext, useMemo, useState } from 'react';

interface IQuote {
  content: string;
  author: string;
}

const useQuote = () => {
  const { setWordList, setWordCount } = useContext(WordListContext);
  const [loading, setLoading] = useState(false);

  const getQuote = useCallback(() => {
    setLoading(true);
    fetch('https://api.quotable.io/random?minLength=40')
      .then((response) => response.json())
      .then((quote: IQuote) => {
        setWordList(quote.content.split(' '));
        setLoading(false);
      });
  }, [setWordList, setWordCount]);

  return useMemo(
    () => ({
      loading,
      getQuote,
    }),
    [loading, getQuote]
  );
};

export default useQuote;
