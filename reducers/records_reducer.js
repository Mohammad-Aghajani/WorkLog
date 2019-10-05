import {
    START_RECORD
  } from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case START_RECORD:
      return [];
    default:
      return state;
  }
}
