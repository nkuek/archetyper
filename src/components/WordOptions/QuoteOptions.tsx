import React, { FC } from 'react';
import WordOption from './WordOption';
import { IProps } from './types';

const QuoteOptions: FC<IProps> = ({ showOptions, setShowOptions }) => {
  return (
    <WordOption
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      option="quotes"
    >
      <div></div>
    </WordOption>
  );
};

export default QuoteOptions;
