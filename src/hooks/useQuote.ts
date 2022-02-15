import { WordListContext } from 'providers';
import { useCallback, useContext, useMemo } from 'react';

interface IQuote {
  content: string;
  author: string;
}

const paramsMap = {
  short: 'minLength=60&maxLength=100',
  medium: 'minLength=140&maxLength=180',
  long: 'minLength=200',
};

const useQuote = () => {
  const {
    setWordList,
    setWordCount,
    setLoading,
    author,
    setAuthor,
    quoteParams,
  } = useContext(WordListContext);

  const getQuote = useCallback(() => {
    setLoading(true);
    fetch(`https://api.quotable.io/random?${paramsMap[quoteParams]}`)
      .then((response) => response.json())
      .then((quote: IQuote) => {
        const quoteContent = quote.content.split(' ');
        setAuthor(quote.author);
        setWordList(quoteContent);
        setWordCount(quoteContent.length);
        setLoading(false);
      });
  }, [setWordList, setWordCount, setLoading, setAuthor, quoteParams]);
  return useMemo(
    () => ({
      getQuote,
      author,
    }),
    [getQuote, author]
  );
};

export default useQuote;
