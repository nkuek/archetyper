import React, { FC, useContext } from 'react';
import WordOption from './WordOption';
import { IProps } from './types';
import { WordListContext } from 'providers';

const QuoteOptions: FC<IProps> = ({ showOptions, setShowOptions }) => {
  const { setQuoteParams } = useContext(WordListContext);

  return (
    <WordOption
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      optionKey="quotes"
    >
      <div></div>
    </WordOption>
  );
};

export default QuoteOptions;
