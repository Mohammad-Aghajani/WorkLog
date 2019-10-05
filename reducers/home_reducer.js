import moment from 'jalali-moment';
import { calcIncome } from '../src/CalcIncome';

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
    CLEAR_SHOW_RECORDS, // check it , maybe waste
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
  } from '../actions/types';

const INITIAL_STATE = {
  selectedJob: '',
  jobs: [],
  jobsRecord: [],
  jobsRecordForView: [],
  infoForShow: [],
  jobName: '',
  jobWage: '',
  jobAsFactor: '',
  jobNsFactor: '',
  edittingJobName: '',
  edittingJobWage: '',
  edittingJobAsFactor: '',
  edittingJobNsFactor: '',
  spentMoney: '',
  recordNote: '',
  appStartedStatus: false,
};

export const HomeReducer = (state = INITIAL_STATE, action) => {
  let records = [];
  let recordsForShow = [];

  switch (action.type) {
    case SELECT_JOB:
      return { ...state, selectedJob: action.payload };
    case ADD_RECORD:
      addRecord(state.jobsRecord, action.payload.name, action.payload.info, records);
      return {
        ...state,
        jobsRecord: records,
        jobsRecordForView: records,
      };
    case CLEAR_RECORD:
      clearJobRecords(state.jobsRecord, action.payload, records);
      return { ...state, jobsRecord: records, jobsRecordForView: records };
    // case CLEAR_SHOW_RECORDS:
    //   return { ...state, infoForShow: [], };
    case CHANGE_NAME:
      return { ...state, jobName: action.payload };
    case EDITTING_NAME:
      return { ...state, edittingJobName: action.payload };
    case EDITTING_WAGE:
      return { ...state, edittingJobWage: action.payload };
    case EDITTING_AS_FACTOR:
      return { ...state, edittingJobAsFactor: action.payload };
    case EDITTING_NS_FACTOR:
      return { ...state, edittingJobNsFactor: action.payload };
    case CHANGE_WAGE:
      return { ...state, jobWage: action.payload };
    case CHANGE_NOTE:
      console.log(action.payload);
      return { ...state, recordNote: action.payload };
    case CHANGE_AS_FACTOR:
      return { ...state, jobAsFactor: action.payload };
    case CHANGE_NS_FACTOR:
      return { ...state, jobNsFactor: action.payload };
    case ADD_JOB:
      if (findExistingJob(state.jobs, action.payload.name)) {
        alert('job has already exists.');
        return { ...state };
      } else if (action.payload.name === '' || action.payload.hourlyWage === '') {
        alert('fields must fill');
      } else {
        return {
          ...state,
          jobs: [...state.jobs, action.payload],
          infoForShow: [...state.jobs, action.payload],
          jobsRecord: [...state.jobsRecord, { name: action.payload.name, data: [] }],
          jobsRecordForView: [...state.jobsRecord, { name: action.payload.name, data: [] }]
        }; 
      }
    case ADD_NOTE:
      addNoteToRecord(
        state.jobsRecord,
        action.payload.note,
        action.payload.name,
        action.payload.key,
        records
      );
      addNoteToRecord(
        state.jobsRecordForView,
        action.payload.note,
        action.payload.name,
        action.payload.key,
        recordsForShow
      );
      return { ...state, jobsRecord: records, jobsRecordForView: recordsForShow };
    case FILTER_BY_YEAR_MONTH:
      // console.log("data before removing, state.jobs", JSON.stringify(state.jobs));
      // console.log("data before removing, state.infoForShow", JSON.stringify(state.infoForShow));
      const backupStateJobsRecords = JSON.parse(JSON.stringify(state.jobsRecord));
      getYearMonthRecords(
        state.jobsRecord,
        action.payload.name,
        action.payload.year,
        action.payload.month,
        records
      );
      // console.log('data after removing, state.jobs', JSON.stringify(backupStateJobs));
      // console.log('data after removing, state.infoForShow', JSON.stringify(state.infoForShow));
      return { ...state, jobsRecordForView: records, jobsRecord: backupStateJobsRecords };
    case SORT_RECORDS:
     sortRecords(state.jobsRecordForView, state.jobs, action.payload.name, action.payload.type, records);
     return { ...state, jobsRecordForView: records };
    case CHANGE_STATUS_PAID:
      changeStatus(state.jobsRecord, action.payload.name, action.payload.key, 'paid', records);
      changeStatus(
        state.jobsRecordForView,
        action.payload.name,
        action.payload.key,
        'paid',
        recordsForShow
      );
      return { ...state, jobsRecord: records, jobsRecordForView: recordsForShow };
    case CHANGE_STATUS_UNPAID:
      changeStatus(state.jobsRecord, action.payload.name, action.payload.key, 'unpaid', records);
      changeStatus(
        state.jobsRecordForView,
        action.payload.name,
        action.payload.key,
        'unpaid',
        recordsForShow
      );
      return { ...state, jobsRecord: records, jobsRecordForView: recordsForShow };
    case SHOW_ALL_RECORDS:
      getAllRecords(state.jobsRecord, records);
      return { ...state, jobsRecordForView: records };
    case DELETE_THIS_RECORD:
      deleteThisRecord(state.jobsRecord, action.payload.name, action.payload.key, records);
      deleteThisRecord(state.jobsRecordForView, action.payload.name, action.payload.key, recordsForShow);
      return { ...state, jobsRecord: records, jobsRecordForView: recordsForShow };
    case EDIT_THIS_RECORD:
      editThisRecord(state.jobsRecord, action.payload.info,
                     action.payload.name, action.payload.key, records);
      editThisRecord(state.jobsRecordForView, action.payload.info,
                     action.payload.name, action.payload.key, recordsForShow);
      return { ...state, jobsRecord: records, jobsRecordForView: recordsForShow };
    case DELETE_JOB:
        deleteJob(state.jobs, state.jobsRecordForView, action.payload, records, recordsForShow);
        return { ...state, jobs: records, jobsRecordForView: recordsForShow, jobsRecord: recordsForShow };
    case EDIT_THIS_JOB:
      console.log('log nowwwww', action.payload.info.name);
      if (findExistingJob(state.jobs, action.payload.info.name)) {
        alert('job has already exists.');
        return { ...state };
      } else {
        editJob(state.jobs, state.jobsRecordForView,
                action.payload.info, action.payload.name, records, recordsForShow);
        return {
          ...state,
          jobs: records,
          jobsRecordForView: recordsForShow,
          jobsRecord: recordsForShow,
          selectedJob: action.payload.info.name
        };
      }
    case CHANGE_SPENT_MONEY:
      return { ...state, spentMoney: action.payload };
    case APP_STARTED:
      return { ...state, appStartedStatus: action.payload };
    default:
      return state;
  }
};

const addRecord = (data, name, info, dataToShow) => {
  data.forEach(job => {
    console.log(name);
    if (job.name === name) {
      let tempObj = { data: job.data || [] };
      tempObj = {
        name: job.name,
        data: [...tempObj.data, info]
      };
      dataToShow.push(tempObj);
    } else {
      dataToShow.push(job);
    }
  });
};

const clearJobRecords = (data, name, dataToShow) => {
  // console.log(name);
  data.forEach(job => {
    if (job.name === name) {
      const tempObj = { ...job, data: [] };
      dataToShow.push(tempObj);
    } else {
      dataToShow.push(job);
    }
  });
};

const addNoteToRecord = (data, note, name, key, dataToShow) => {
  data.forEach(job => {
    if (job.name === name) {
      job.data.forEach(record => {
        if (record.key === key) { 
          record.note = note;
        }
      });
    }
    dataToShow.push(job);
  });
};

const getYearMonthRecords = (data, name, year, month, dataToShow) => {
  // console.log("data before removing", data);
  data.forEach(job => {
    if (job.name === name) {
      // job.records.forEach(record => {
      //   if (record.date.split('/')[0] !== year || record.date.split('/')[1] !== month) {
      //     job.records.splice(
      //       job.records.indexOf(record),
      //       1
      //     );
      //   }
      // });
      for (let i = job.data.length - 1; i >= 0; i -= 1) {
        const temp = moment.unix(job.data[i].start).format('jYYYY/jM/jD');
        if (temp.split('/')[0] !== year || temp.split('/')[1] !== month) {
          job.data.splice(i, 1);
        }
      }
    }
    dataToShow.push(job);
  });
  // console.log("data after removing", data);
};

const sortRecords = (data, jobs, name, type, dataToShow) => {
  // const temp;
  data.forEach(job => {
    if (job.name === name) {
      switch (type) {
        case 'Duration':
          job.data.sort(
            (a, b) => {
              if (a.type === 'purchased') {
                if (b.type === 'purchased') {
                  return (1);
                } else {
                  return (1);
                }
              } else {
                if (b.type === 'purchased') {
                  return (-1);
                } else {
                  return (b.end - b.start) > (a.end - a.start);
                }
              }
            }
          );
          //  console.log(job);
          break;
        case 'Paid':
          job.data.sort(
            (a, b) => { 
              if (a.status === 'paid') {
                if (b.status === 'paid') {
                  return 0;
                } else {
                  return -1;
                }
              } else {
                if (b.status === 'paid') {
                  return 1;
                } else {
                  return 0;
                }
              }
             }
          );
          // console.log(job);
          break;
        case 'Unpaid':
          job.data.sort(
            (a, b) => { 
              if (a.status === 'unpaid') {
                if (b.status === 'unpaid') {
                  return 0;
                } else {
                  return -1;
                }
              } else {
                if (b.status === 'unpaid') {
                  return 1;
                } else {
                  return 0;
                }
              }
             }
          );
          // console.log(job);
          break;
        case 'Payroll':
          job.data.sort(
            (a, b) => {
              if (a.type === 'purchased') {
                if (b.type === 'purchased') {
                  return (
                    b.spent > a.spent
                  );
                } else {
                  return (
                    calcIncome(
                      jobs.find(obj =>
                        obj.name === name).hourlyWage,
                      jobs.find(obj =>
                        obj.name === name).AfternoonShiftFactor,
                      jobs.find(obj =>
                        obj.name === name).NightShiftFactor,
                      b.start,
                      b.end,
                    ) > a.spent
                  );
                }
              } else {
                if (b.type === 'purchased') {
                  return (
                    b.spent > calcIncome(
                      jobs.find(obj =>
                        obj.name === name).hourlyWage,
                      jobs.find(obj =>
                        obj.name === name).AfternoonShiftFactor,
                      jobs.find(obj =>
                        obj.name === name).NightShiftFactor,
                      a.start,
                      a.end,
                    )
                  );
                } else {
                  return (
                    calcIncome(
                      jobs.find(obj =>
                        obj.name === name).hourlyWage,
                      jobs.find(obj =>
                        obj.name === name).AfternoonShiftFactor,
                      jobs.find(obj =>
                        obj.name === name).NightShiftFactor,
                      b.start,
                      b.end,
                    ) > calcIncome(
                      jobs.find(obj =>
                        obj.name === name).hourlyWage,
                      jobs.find(obj =>
                        obj.name === name).AfternoonShiftFactor,
                      jobs.find(obj =>
                        obj.name === name).NightShiftFactor,
                      a.start,
                      a.end,
                    )
                  );
                }
              }
            }
          );
          // console.log(job);
          break;
        default:
          // case 'Date'
          job.data.sort(
            (a, b) => {
              if (a.type === 'purchased') {
                if (b.type === 'purchased') {
                  return (
                    moment(`${a.date}`, 'jYYYY/jM/jD').locale('fa').unix() > moment(`${b.date}`, 'jYYYY/jM/jD').locale('fa').unix()
                  );
                } else {
                  return (
                    moment(`${a.date}`, 'jYYYY/jM/jD').locale('fa').unix() > b.start
                  );
                }
              } else {
                if (b.type === 'purchased') {
                  return (
                    a.start > moment(`${b.date}`, 'jYYYY/jM/jD').locale('fa').unix()
                  );
                } else {
                  return a.start > b.start;
                }
              }
            }
          );
      }
    }
    dataToShow.push(job);
  });
};

const changeStatus = (data, name, key, status, dataToShow) => {
  data.forEach(job => {
    if (job.name === name) {
      job.data.forEach(record => {
        if (record.key === key) { 
          record.status = status;
        }
      });
    }
    dataToShow.push(job);
  });
};

const getAllRecords = (data, dataToShow) => {
  data.forEach(job => {
    dataToShow.push(job);
  });
};

const deleteThisRecord = (data, name, key, dataToShow) => {
  data.forEach(job => {
    dataToShow.push(job);
    if (job.name === name) {
      dataToShow.slice(-1)[0].data.forEach(record => {
        if (record.key === key) {
          dataToShow.slice(-1)[0].data.splice(
            dataToShow.slice(-1)[0].data.indexOf(record),
            1
          );
        }
      });
    }
  });
};

const editThisRecord = (data, info, name, key, dataToShow) => {
  data.forEach(job => {
    if (job.name === name) {
      job.data.forEach(record => {
        if (record.key === key) {
          if (record.type === 'record') {
            record.start = info.start; 
            record.end = info.end;
          } else {
            record.date = info.date; 
            record.spent = info.spent;
          }
        }
      });
    } 
    dataToShow.push(job);
  });
};

const deleteJob = (data, recordsData, name, dataToShow, dataToShowRecords) => {
  for (let i = data.length - 1; i >= 0; i -= 1) {
    if (data[i].name === name) {
      data.splice(i, 1);
    } else {
      dataToShow.push(data[i]);
    }
  }

  for (let i = recordsData.length - 1; i >= 0; i -= 1) {
    if (recordsData[i].name === name) {
      recordsData.splice(i, 1);
    } else {
      dataToShowRecords.push(data[i]);
    }
  }
  
};

const editJob = (data, recordsData, info, name, dataToShow, dataToShowRecords) => {
  // console.log(data);
  data.forEach(job => {
    console.log('WTF !?', job.name, name);
    if (job.name === name) {
      job.name = info.name;
      job.hourlyWage = info.hourlyWage;
      // job.AfternoonShiftFactor = info.AfternoonShiftFactor;
      // job.NightShiftFactor = info.NightShiftFactor;
    }
    dataToShow.push(job);
  });
  recordsData.forEach(record => {
    if (record.name === name) {
      record.name = info.name;
    }
    dataToShowRecords.push(record);
  });
};

const findExistingJob = (data, name) => {
  let temp = false;
  // console.log('hooooooooooy', data);s
  for (let job of data) {
    console.log('alan in ro bayad check kard', job, name);
    if (job.name === name) {
      console.log('golabi');
      temp = true;
      break;
    } else {
      temp = false;
    }
  }
  return temp;
};

