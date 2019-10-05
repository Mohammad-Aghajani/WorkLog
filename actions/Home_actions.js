import {
    ADD_RECORD,
    CLEAR_RECORD,
    CHANGE_NAME,
    CHANGE_WAGE,
    CHANGE_NOTE,
    CHANGE_AS_FACTOR,
    CHANGE_NS_FACTOR,
    ADD_JOB,
    ADD_NOTE,
    CLEAR_SHOW_RECORDS,
    CHANGE_STATUS_PAID,
    CHANGE_STATUS_UNPAID,
    SHOW_ALL_RECORDS,
    FILTER_BY_YEAR_MONTH,
    SORT_RECORDS,
    DELETE_THIS_RECORD,
    EDIT_THIS_RECORD,
    DELETE_JOB,
    SELECT_JOB,
    EDITTING_NAME,
    EDITTING_WAGE,
    EDITTING_AS_FACTOR,
    EDITTING_NS_FACTOR,
    EDIT_THIS_JOB,
    CHANGE_SPENT_MONEY,
    APP_STARTED,
  } from './types';
  
  
export const addRecord = (info, name) => { 
  return {
    type: ADD_RECORD,
    payload: { info, name }
  };
};

export const clearRecords = (name) => {
  return {
    type: CLEAR_RECORD,
    payload: name
  };
};

export const clearShowRecords = () => {
  return {
    type: CLEAR_SHOW_RECORDS,
  };
};

export const nameChanged = (text) => {
  return {
    type: CHANGE_NAME,
    payload: text
  };
};

export const wageChanged = (text) => {
  return {
    type: CHANGE_WAGE,
    payload: text
  };
};

export const noteChanged = (text) => {
  return {
    type: CHANGE_NOTE,
    payload: text
  };
};

export const asFactorChanged = (text) => {
  return {
    type: CHANGE_AS_FACTOR,
    payload: text
  };
};

export const nsFactorChanged = (text) => {
  return {
    type: CHANGE_NS_FACTOR,
    payload: text
  };
};

export const addJob = (info) => {
  return {
    type: ADD_JOB,
    payload: info
  };
};

export const changeStatusPaid = (key, name) => {
  return {
    type: CHANGE_STATUS_PAID,
    payload: { key, name }
  };
};

export const changeStatusUnpaid = (key, name) => {
  return {
    type: CHANGE_STATUS_UNPAID,
    payload: { key, name }
  };
};

export const showAllRecords = () => {
  return {
    type: SHOW_ALL_RECORDS,
  };
};

export const filterByMonthAndYear = (year, month, name) => {
  return {
    type: FILTER_BY_YEAR_MONTH,
    payload: { year, month, name },
  };
};

export const sortRecords = (type, name) => {
  console.log(type, name);
  return {
    type: SORT_RECORDS,
    payload: { type, name },
  };
};

export const addNote = (note, key, name) => {
  return {
    type: ADD_NOTE,
    payload: { note, key, name },
  };
};

export const deleteThisRecord = (key, name) => {
  return {
    type: DELETE_THIS_RECORD,
    payload: { key, name },
  };
};

export const editThisRecord = (info, key, name) => {
  return {
    type: EDIT_THIS_RECORD,
    payload: { info, key, name },
  };
};

export const editThisJob = (info, name) => {
  return {
    type: EDIT_THIS_JOB,
    payload: { info, name },
  };
};

export const deleteJob = (name) => {
  return {
    type: DELETE_JOB,
    payload: name,
  };
};

export const selectJob = (name) => {
  return {
    type: SELECT_JOB,
    payload: name,
  };
};

export const nameEdited = (text) => {
  return {
    type: EDITTING_NAME,
    payload: text
  };
};

export const wageEdited = (text) => {
  return {
    type: EDITTING_WAGE,
    payload: text
  };
};

export const asFactorEdited = (text) => {
  return {
    type: EDITTING_AS_FACTOR,
    payload: text
  };
};

export const nsFactorEdited = (text) => {
  return {
    type: EDITTING_NS_FACTOR,
    payload: text
  };
};

export const SpentMoneyChanged = (text) => {
  return {
    type: CHANGE_SPENT_MONEY,
    payload: text
  };
};

export const setAppStatus = (status) => {
  return {
    type: APP_STARTED,
    payload: status,
  };
};
