import { TReactSetState } from 'providers/general/types';

export interface IOptions {
  words: boolean;
  quotes: boolean;
  timed: boolean;
}

export interface IProps {
  showOptions: boolean;
  setShowOptions: TReactSetState<boolean>;
}

export interface IOptionProps {
  setNeedReset: TReactSetState<boolean>;
}
