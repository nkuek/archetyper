import { WordListContext } from 'providers';
import { useCallback, useContext, useMemo } from 'react';

interface IQuote {
  content: string;
  author: string;
}

const paramsMap = {
  short: '?maxLength=100',
  medium: '?minLength=140&maxLength=180',
  long: '?minLength=200',
  all: '',
};

const useQuote = () => {
  const {
    setWordList,
    setWordCount,
    setLoading,
    author,
    setAuthor,
    quoteParams,
    setErrorMessage,
  } = useContext(WordListContext);

  const getQuote = useCallback(() => {
    setLoading(true);
    fetch(`https://api.quotable.io/random${paramsMap[quoteParams]}`)
      .then((response) => response.json())
      .then((quote: IQuote) => {
        const quoteContent = quote.content.split(' ');
        setAuthor(quote.author);
        setWordList(quoteContent);
        setWordCount(quoteContent.length);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      })
      .catch((error) => {
        if (error.message.includes('Failed to fetch')) {
          setLoading(false);
          setErrorMessage(
            'there was a problem loading this quote. please ensure you have a stable network connection.'
          );
        } else {
          setErrorMessage(
            'something went wrong. try refreshing the page and ensure you have a stable network connection.'
          );
        }
      });
  }, [
    setWordList,
    setWordCount,
    setLoading,
    setAuthor,
    quoteParams,
    setErrorMessage,
  ]);
  return useMemo(
    () => ({
      getQuote,
      author,
    }),
    [getQuote, author]
  );
};

export default useQuote;
