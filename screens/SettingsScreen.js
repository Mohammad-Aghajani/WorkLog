import React, { Component, } from 'react';
import { View, Picker, PermissionsAndroid } from 'react-native';
import { Button, } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'jalali-moment';
import XLSX from 'xlsx';
// import OpenFile from 'react-native-doc-viewer';
// import { writeFile, DocumentDirectoryPath, writeFileSync, createFile } from 'react-native-fs';
// const DDP = `${DocumentDirectoryPath}/`;
import * as actions from '../actions';
import { calcDuration, calcIncome } from '../src/CalcIncome';

import RNFetchBlob from 'react-native-fetch-blob';
const { readFile, createFile, writeFile, dirs: { DocumentDir, DownloadDir, SDCardDir, DCIMDir } } = RNFetchBlob.fs;
const DDP = `${DownloadDir}/`;
// const input = res => res.map(x => String.fromCharCode(x)).join('');
const output = str => str.split('').map(x => x.charCodeAt(0));

class SettingsScreen extends Component {
  static navigationOptions = {
    title: 'Settings',
  }

  constructor(props) {
		super(props);
		this.importFile = this.importFile.bind(this);
		this.exportFile = this.exportFile.bind(this);
  }
  
  importFile(name) {
    console.log(DocumentDir);
    console.log(DCIMDir);
    console.log(DownloadDir);
    const path = `${DDP}${name}.xlsx`;
    readFile(path, 'base64').then((res) => {
      const wbin = XLSX.read(res, { type: 'base64' });
      const wsname = wbin.SheetNames[0];
      const wsin = wbin.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(wsin, { header: 1 });
      console.log(data);
    }).catch((err) => { alert("importFile Error", "Error " + err.message); });
  }

  exportFile(name) {
    if (name !== '') {
      if (this.props.jobRecords.find(obj =>
        obj.name === this.props.selectedjob).data.length !== 0) {
        const users = [['Job Name', 'Date', 'Start', 'End', 'Duration', 'Wage', 'Income']];
        this.props.jobRecords.forEach((job) => {
          if (job.name === name) {
            job.data.forEach((record) => {
              const Wage = this.props.jobs.find(obj =>
                obj.name === this.props.selectedjob).hourlyWage;
              const AfternoonShiftFactor = this.props.jobs.find(obj =>
                  obj.name === this.props.selectedjob).AfternoonShiftFactor;
              const NightShiftFactor = this.props.jobs.find(obj =>
                  obj.name === this.props.selectedjob).NightShiftFactor;
              const userArray = [
                job.name,
                record.type === 'record' ?
                  moment.unix(record.start).format('jYYYY/jM/jD') : record.date,
                record.type === 'record' ?
                  `${moment.unix(record.start).locale('fa').format('HH:mm')}` : '---',
                record.type === 'record' ?
                  `${moment.unix(record.end).locale('fa').format('HH:mm')}` : '---',
                record.type === 'record' ?
                  calcDuration(record.start, record.end) : '---',
                record.type === 'record' ? 
                  Wage : '---',
                record.type === 'record' ?
                  `${calcIncome(Wage, AfternoonShiftFactor, NightShiftFactor, record.start, record.end)}` :
                  record.spent,
              ];
              users.push(userArray);
            });
          }
        });
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(users);
        XLSX.utils.book_append_sheet(wb, ws, 'All Users');

        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx', bookSST: false });

        const path = `${DDP}${name}.xlsx`;
        writeFile(path, wbout, 'base64').then((res) => {
          // console.log(`exportFile success,Exported to ${path}`);
          alert(`exportFile success,Exported to ${path}`);
        }).catch((err) => { console.log(`${err.message}`); });

        // RNFetchBlob.android.actionViewIntent(path, 'xlsx').then((success) => {
        //   console.log('success: ', success);
        // }).catch((err) => {
        //   console.log('err:', err);
        // });

        // OpenFile.openDoc(
        //   [{
        //     url: path,
        //     fileName: 'sample',
        //     cache: false,
        //     fileType: 'xlsx'
        //   }],
        //   (error, url) => {
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       // this.setState({ animating: false });
        //       console.log(url);
        //     }
        //   });
      } else {
        alert(`No Records to export!`);
      }
    } else {
      alert('No Job Found!');
    }
  }

  render() {
    console.log(this.props.selectedjob);
    return (
      <View>
        <Button
          title="Reset Records"
          large
          icon={{ name: 'delete-forever' }}
          onPress={() => {
            this.props.clearRecords(this.props.selectedjob);
            this.props.navigation.navigate('Records');
          }}
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
        />

        <Button
          title="Show All Records"
          large
          icon={{ name: 'list' }}
          onPress={() => {
            this.props.showAllRecords();
            this.props.navigation.navigate('Records');
          }}
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
        />

        <Button
          title="Add Manually Record"
          large
          icon={{ name: 'add' }}
          colo
          onPress={() => this.props.navigation.navigate('ManuallyAdd')}
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
        />

        <Button
          title="Add Purchased Item"
          large
          icon={{ name: 'add' }}
          onPress={() => this.props.navigation.navigate('AddItem')}
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
        />

        <Button
          title="Export to Excel"
          onPress={() => {
            this.exportFile(this.props.selectedjob);
            this.props.navigation.navigate('Records');
          }}
          large
          icon={{ name: 'add' }}
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
        />

        {/* <Button
          title="Import from Excel"
          onPress={() => {
            this.importFile(this.props.selectedjob);
            // this.props.navigation.navigate('Records');
          }}
          large
          icon={{ name: 'add' }}
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
        /> */}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    jobs: state.records.jobs,
    selectedjob: state.records.selectedJob,
    jobRecords: state.records.jobsRecordForView,
  };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
