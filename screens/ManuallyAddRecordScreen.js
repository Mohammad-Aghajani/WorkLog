import React, { Component, } from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Picker, } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Input, Header } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import moment from 'jalali-moment';
// import { DpDatePickerModule } from 'ng2-jalali-date-picker';
import PersianCalendarPicker from 'react-native-persian-calendar-picker';
import * as actions from '../actions';
import { calcDuration } from '../src/CalcIncome';
import Icon from 'react-native-vector-icons/FontAwesome5';

class ManuallyAddRecordScreen extends Component {
  static navigationOptions = {
    title: 'Add manually',
  }

  
  constructor(props) {
    super(props);
    this.state = {
      startDateTimePickerVisible: false,
      endDateTimePickerVisible: false,
      startTime: null,
      endTime: null,
      selectedStartDate: null,
      modalVisible: false,
      key: '',
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {  
    this.setState({
      date: moment(date.format()).locale('fa').format('YYYY/M/D')
    });
    console.log(this.state.date);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  showStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: true });

  showEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: true });

  hideStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: false });

  hideEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: false });

  handleStartDatePicked = (date) => {
    this.setState({
      startTime: moment(date).locale('fa').format('HH:mm'),
      key: moment(date).locale('fa').format('HH:mm:ss')
    });
    console.log(this.state.startTime);
    this.hideStartDateTimePicker();
  };

  handleEndDatePicked = (date) => {
    this.setState({
      endTime: moment(date).locale('fa').format('HH:mm')
    });
    console.log(this.state.endTime);
    this.hideEndDateTimePicker();
  };

  renderJobs() {
    // if (Object.keys(this.props.jobs).length === 0 && this.props.jobs.constructor === Object) {
    if (this.props.jobs.length !== 0) {
      return (
        <Picker
          // selectedValue={this.state.selectedJob}
          selectedValue={this.props.selectedjob === '' ?
            // this.setState({ selectedJob: this.props.jobs[0].name }) :
            this.props.selectJob(this.props.jobs[0].name) :
            this.props.selectedjob
          }
          style={{ height: 50, width: 120 }}
          onValueChange={(itemValue) => {
            this.props.selectJob(itemValue);
            // this.setState({ selectedJob: itemValue });
          }}
        >
          {
            this.props.jobs.map(data => {
              // console.log(this.state.selectedJob);
              return (
                <Picker.Item label={data.name} value={data.name} key={data.name} />
              );
            })
          }
        </Picker>
      );
    }
  }

  render() {
    console.log(this.props.selectedjob);
    return (
      <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
        <Header
          leftComponent={this.renderJobs()}
          outerContainerStyles={{
            backgroundColor: "rgba(92, 99,216, 1)",
            margin: 5,
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5 
          }}
          innerContainerStyles={{ justifyContent: 'space-around',  }}
        /> 
        <Modal
          animationType="slide"
          transparent={false}
          backdropOpacity={0.50}
          backdropColor={'red'}
          visible={this.state.modalVisible}
          style={{ backgroundColor: '#ffffff' }}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <PersianCalendarPicker
                onDateChange={this.onDateChange}
              />
              <View>
                <Text>SELECTED DATE:{ this.state.date }</Text>
              </View> 
              <Button
                title="OK"
                large
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                buttonStyle={{
                  margin: 10,
                  backgroundColor: "rgba(92, 99,216, 1)",
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 5
                }}
              />
            </View>
          </View>
        </Modal>

        <DateTimePicker
          mode='time'
          isVisible={this.state.startDateTimePickerVisible}
          onConfirm={this.handleStartDatePicked}
          onCancel={this.hideStartDateTimePicker}
        />

        <DateTimePicker
          mode='time'
          isVisible={this.state.endDateTimePickerVisible}
          onConfirm={this.handleEndDatePicked}
          onCancel={this.hideEndDateTimePicker}
        />

        <Input
          label='Date'
          placeholder='Click on the calendar icon'
          leftIcon={
            <Icon
              style={{ backgroundColor: '#fff', color: '#000' }}
              name='calendar-plus'
              size={24}
              onPress={() => this.setModalVisible(true)}
            />
          }
          containerStyle={{ margin: 15, }}
          value={this.state.date}
        />

        <Input
          label='Start Time'
          placeholder='Click on the clock icon'
          leftIcon={
            <Icon
              name='clock'
              size={24}
              style={{ backgroundColor: '#fff', color: '#000' }}
              onPress={() => this.showStartDateTimePicker()}
            />
          }
          containerStyle={{ margin: 15, }}
          value={this.state.startTime}
        />

        <Input
          label='End Time'
          placeholder='Click on the clock icon'
          leftIcon={
            <Icon
              name='clock'
              size={24}
              style={{ backgroundColor: '#fff', color: '#000' }}
              onPress={() => this.showEndDateTimePicker()}
            />
          }
          containerStyle={{ margin: 15, }}
          value={this.state.endTime}
        />

        <Button
          title="Submit"
          large
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          onPress={() => {
            if (this.props.selectedjob !== '') {
              const hStart = parseInt(this.state.startTime.split(':')[0], 10);
              const hEnd = parseInt(this.state.endTime.split(':')[0], 10);
              
              let newStart;
              let newEnd;
              if (hEnd < hStart) {
                const nextday = moment(
                  `${this.state.date} ${this.state.startTime}`, 'jYYYY/jM/jD HH:mm'
                  ).add(1, 'day').format('jYYYY/jM/jD');
                newStart = moment(
                  `${this.state.date} ${this.state.startTime}`, 'jYYYY/jM/jD HH:mm'
                ).locale('fa').unix();
                newEnd = moment(
                  `${nextday} ${this.state.endTime}`, 'jYYYY/jM/jD HH:mm'
                ).locale('fa').unix();
                // console.log(moment.unix(newEnd).format('jYYYY/jM/jD HH:mm'));
              } else {
                newStart = moment(
                  `${this.state.date} ${this.state.startTime}`, 'jYYYY/jM/jD HH:mm'
                ).locale('fa').unix();
                newEnd = moment(
                  `${this.state.date} ${this.state.endTime}`, 'jYYYY/jM/jD HH:mm'
                ).locale('fa').unix();
              }
              this.props.addRecord({
                start: newStart,
                end: newEnd,
                status: 'unpaid',
                key: `${this.state.date}-${this.state.key}`,
                note: '',
                type: 'record',
              }, this.props.selectedjob);
            }
            this.props.navigation.navigate('Records');
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
  },
});

const mapStateToProps = state => {
  return {
    jobRecords: state.records.jobsRecord,
    jobs: state.records.jobs,
    selectedjob: state.records.selectedJob,
  };
};

export default connect(mapStateToProps, actions)(ManuallyAddRecordScreen);
