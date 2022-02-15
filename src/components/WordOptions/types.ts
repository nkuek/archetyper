import { TReactSetState } from 'providers/general/types';

export interface IOptions {
  words: boolean;
  quotes: boolean;
  timed: boolean;
}

export interface IProps {
  showOptions: IOptions;
  setShowOptions: TReactSetState<IOptions>;
}
