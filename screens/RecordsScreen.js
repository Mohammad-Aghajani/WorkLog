import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView,
         Platform, Picker, TextInput, Switch,
         TouchableHighlight 
} from 'react-native';
import { Card, Button, Input, Header } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import PersianCalendarPicker from 'react-native-persian-calendar-picker';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'jalali-moment';
import * as actions from '../actions';
import Panel from '../src/Panel';
import MyView from '../src/MyView';
import { calcDuration, calcIncome } from '../src/CalcIncome';

class RecordsScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Records',
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Settings')}
          title="Settings"
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          icon={{ name: 'settings' }}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      totalIncome: 0,
      sort: '',
      showNote: true,
      modalVisible: false,
      secondaryModalVisible: false,
      modalVisiblePurchased: false,
      secondaryModalVisiblePurchased: false,
      startDateTimePickerVisible: false,
      endDateTimePickerVisible: false,
      startTime: null,
      endTime: null,
      date: '',
      datePurchased: '',
      duration: '',
      key: '',
      newKey: '',
      status: '',
      note: '',
      jobnameEdit: '',
      spent: '',
      selectedStartDate: null,
      month: moment().locale('fa').format('jYYYY/jM/jD').split('/')[1],
      year: moment().locale('fa').format('jYYYY/jM/jD').split('/')[0],
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.onDatePurchasedChange = this.onDatePurchasedChange.bind(this);
    // this.totalIncome;
  }

  onDateChange(date) {  
    this.setState({
      date: moment(date.format()).locale('fa').format('YYYY/M/D')
    });
  }

  onDatePurchasedChange(date) {  
    this.setState({
      datePurchased: moment(date.format()).locale('fa').format('YYYY/M/D')
    });
  }

  showStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: true });

  showEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: true });

  hideStartDateTimePicker = () => this.setState({ startDateTimePickerVisible: false });

  hideEndDateTimePicker = () => this.setState({ endDateTimePickerVisible: false });

  handleStartDatePicked = (date) => {
    this.setState({
      startTime: moment(date).locale('fa').format('HH:mm'),
      newKey: moment(date).locale('fa').format('HH:mm:ss')
    }); 
    this.hideStartDateTimePicker();
  };

  handleEndDatePicked = (date) => {
    this.setState({
      endTime: moment(date).locale('fa').format('HH:mm')
    });
    this.hideEndDateTimePicker();
  };

  onNoteChange(text) {
    this.props.noteChanged(text);
  }

  onChangeSpentMoney(text) {
    this.props.SpentMoneyChanged(text);
  }
  
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setSecondaryModalVisible(visible) {
    this.setState({ secondaryModalVisible: visible });
  }

  setModalVisiblePurchased(visible) {
    this.setState({ modalVisiblePurchased: visible });
  }

  setSecondaryModalVisiblePurchased(visible) {
    this.setState({ secondaryModalVisiblePurchased: visible });
  }

  renderRecords(name) {
    this.totalIncome = 0;
    this.title = '';
    let jobIndex;   

    console.log('jobs:', this.props.jobs);
    console.log('records', this.props.jobRecords);
    //
    // console.log(name);
    if (name !== '') {
      for (const job of this.props.jobRecords) {
        if (job.name === name) {
          jobIndex = this.props.jobRecords.indexOf(job);
        }
      }
      const job = this.props.jobRecords[jobIndex];
      if (jobIndex !== undefined) {
      if (job.data.length !== 0) {
      return (
        job.data.map(data => {
          let income;
          let duration;
          let date;
          let Wage;
          let AfternoonShiftFactor;
          let NightShiftFactor;
          if (data.type === 'record') {
            Wage = this.props.jobs.find(obj =>
              obj.name === this.props.selectedjob).hourlyWage;
            AfternoonShiftFactor = this.props.jobs.find(obj =>
              obj.name === this.props.selectedjob).AfternoonShiftFactor;
            NightShiftFactor = this.props.jobs.find(obj =>
              obj.name === this.props.selectedjob).NightShiftFactor;
            income = calcIncome(
              Wage,
              AfternoonShiftFactor,
              NightShiftFactor,
              data.start,
              data.end,
            );
            duration = calcDuration(
              data.start,
              data.end
            );
            date = moment.unix(data.start).format('jYYYY/jM/jD');
            // console.log('haaaaaaaaaaaaaa', income);
          } else {
            income = parseFloat(data.spent);
            date = data.date;
            duration = 'spent:';
          }
          if (data.status === 'unpaid') {
            this.totalIncome += income;
          }
          this.title = `${name} ${date} ${duration} $${income}`;
          return (
            <Panel
              title={this.title}
              key={data.key}
            >
              <View style={{ height: 250 }}>
                <View style={styles.detailWrapper}>
                  <MyView hide={data.type !== 'record'}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
                      <Text style={styles.italics}>
                        {data.type === 'record' ? `Wage: $${Wage}` : ''}
                      </Text>
                      <Text style={styles.italics}>
                        {
                          data.type === 'record' ?
                          `Start: ${moment.unix(data.start).locale('fa').format('HH:mm')}` :
                          ''
                        }
                      </Text>
                      <Text style={styles.italics}>
                        {
                          data.type === 'record' ?
                          `End: ${moment.unix(data.end).locale('fa').format('HH:mm')}` :
                          ''
                        }
                      </Text>
                    </View>
                  </MyView>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 10 }}>
                    <Icon
                      style={{ backgroundColor: '#fff', color: '#000', margin: 10 }}
                      name='sticky-note'
                      size={24}
                      onPress={() => this.setState({ showNote: !this.state.showNote })}
                    />
                    <MyView hide={this.state.showNote} key={data.key}>
                      <Input
                        value={this.props.recordNote}
                        onChangeText={this.onNoteChange.bind(this)}
                        onBlur={() => {
                          this.props.addNote(this.props.recordNote, data.key, job.name);
                          this.setState({ showNote: true });
                        }}
                        containerStyle={{ margin: 5, width: 300 }}
                      />
                    </MyView>
                    <MyView hide={!this.state.showNote}>
                      <Text style={{ margin: 8, fontSize: 16, fontWeight: 'bold', color: '#000' }}>{data.note}</Text>
                    </MyView>
                  </View>
                  {/* <Text style={styles.italics}>
                    Income: {data.income}
                  </Text> */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <Text style={styles.italics}>Status: {data.status}</Text>
                    <Switch
                      value={data.status === 'paid'} 
                      onValueChange={(value) => {
                        if (value === true) {
                          this.props.changeStatusPaid(data.key, job.name);
                        } else {
                          this.props.changeStatusUnpaid(data.key, job.name);
                        }    
                      }}
                    />
                  </View>
                  <Button
                    title='Delete'
                    icon={{ name: 'delete-forever' }}
                    buttonStyle={{
                      margin: 5,
                      backgroundColor: "rgba(92, 99,216, 1)",
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 5
                    }}
                    onPress={() => {
                      this.props.deleteThisRecord(data.key, job.name);
                    }}
                  />
                  <Button
                    title='Edit'
                    icon={{ name: 'edit' }}
                    buttonStyle={{
                      margin: 5,
                      backgroundColor: "rgba(92, 99,216, 1)",
                      borderColor: "transparent",
                      borderWidth: 0,
                      borderRadius: 5
                    }}
                    onPress={() => {
                      if (data.type === 'record') {
                        this.setModalVisible(true);
                        this.setState({
                          date: moment.unix(data.start).format('jYYYY/jM/jD'),
                          startTime: moment.unix(data.start).locale('fa').format('HH:mm'),
                          endTime: moment.unix(data.end).locale('fa').format('HH:mm'),
                          key: data.key,
                          jobnameEdit: job.name,
                          note: data.note, 
                          status: data.status,
                        });
                      } else {
                        this.setModalVisiblePurchased(true);
                        this.setState({
                          datePurchased: data.date,
                          key: data.key,
                          jobnameEdit: job.name,
                          note: data.note, 
                          status: data.status,
                        });
                      }
                    }}
                  />
                </View>
              </View>
            </Panel>
          );
        })
      );
      }
    }
    }
  }

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
          style={{ width: 100 }}
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

  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        backdropOpacity={0.50}
        visible={this.state.modalVisible}
      >
        <Modal
          animationType="slide"
          transparent={false}
          backdropOpacity={0.50}
          backdropColor={'red'}
          visible={this.state.secondaryModalVisible}
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
                    this.setSecondaryModalVisible(!this.state.secondaryModalVisible);
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
              onPress={() => this.setSecondaryModalVisible(true)}
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
              // this.props.deleteThisRecord(this.state.key, this.state.selectedJob);
              this.props.editThisRecord({
                start: moment(
                  `${this.state.date} ${this.state.startTime}`, 'jYYYY/jM/jD HH:mm'
                ).locale('fa').unix(),
                end: moment(
                  `${this.state.date} ${this.state.endTime}`, 'jYYYY/jM/jD HH:mm'
                ).locale('fa').unix(),
                key: this.state.newKey,
                status: this.state.status,
                note: this.state.note
              }, this.state.key, this.props.selectedjob);
            }
            this.props.sortRecords(this.state.sort, this.props.selectedjob);
            this.setModalVisible(!this.state.modalVisible);
          }}
        />
        <Button
          title="Close"
          large
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          onPress={() => {
            this.setModalVisible(!this.state.modalVisible);
          }}
        />
      </Modal>
    );
  }

  renderModalPurchased() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        backdropOpacity={0.50}
        visible={this.state.modalVisiblePurchased}
      >
        <Modal
          animationType="slide"
          transparent={false}
          backdropOpacity={0.50}
          backdropColor={'red'}
          visible={this.state.secondaryModalVisiblePurchased}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <PersianCalendarPicker
                onDateChange={this.onDatePurchasedChange}
              />
              <View>
                <Text>SELECTED DATE:{ this.state.datePurchased }</Text>
              </View>
                <Button
                  title="OK"
                  large
                  onPress={() => {
                    this.setSecondaryModalVisiblePurchased(!this.state.secondaryModalVisiblePurchased);
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

        <Input
          label='Date'
          placeholder='Click on the calendar icon'
          leftIcon={
            <Icon
              style={{ backgroundColor: '#fff', color: '#000' }}
              name='calendar-plus'
              size={24}
              onPress={() => this.setSecondaryModalVisiblePurchased(true)}
            />
          }
          containerStyle={{ margin: 15, }}
          value={this.state.datePurchased}
        />

        <Input
          label='Cost'
          placeholder='Spent money'
          leftIcon={
            <Icon
              name='money-check'
              size={24}
              style={{ backgroundColor: '#fff', color: '#000' }}
            />
          }
          containerStyle={{ margin: 15, }}
          value={this.props.spentMoney}
          onChangeText={this.onChangeSpentMoney.bind(this)}
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
              // this.props.deleteThisRecord(this.state.key, this.state.selectedJob);
              this.props.editThisRecord({
                date: this.state.datePurchased,
                spent: this.props.spentMoney,
                // key: this.state.newKey,
                status: this.state.status,
                note: this.state.note
              }, this.state.key, this.props.selectedjob);
            }
            this.props.sortRecords(this.state.sort, this.props.selectedjob);
            this.setModalVisiblePurchased(!this.state.modalVisiblePurchased);
          }}
        />
        <Button
          title="Close"
          large
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
          onPress={() => {
            this.setModalVisiblePurchased(!this.state.modalVisiblePurchased);
          }}
        />
      </Modal>
    );
  }

  renderMonths() {
    return (
      <Picker
        selectedValue={this.state.month}
        style={{ width: 100 }}
        onValueChange={(itemValue) => {
          this.props.filterByMonthAndYear(
            this.state.year,
            itemValue,
            this.props.selectedjob,
          );
          this.setState({ month: itemValue });
        }}
      >
        {/* <Picker.Item label="همه" value="all" /> */}
        <Picker.Item label="فروردین" value="1" />
        <Picker.Item label="اردیبهشت" value="2" />
        <Picker.Item label="خرداد" value="3" />
        <Picker.Item label="تیر" value="4" />
        <Picker.Item label="مرداد" value="5" />
        <Picker.Item label="شهریور" value="6" />
        <Picker.Item label="مهر" value="7" />
        <Picker.Item label="آبان" value="8" />
        <Picker.Item label="آذر" value="9" />
        <Picker.Item label="دی" value="10" />
        <Picker.Item label="بهمن" value="11" />
        <Picker.Item label="اسفند" value="12" />
      </Picker>
    );
  }
  
  renderYears() {
    return (
      <Picker
        selectedValue={this.state.year}
        style={{ width: 100 }}
        onValueChange={(itemValue) => {
          this.props.filterByMonthAndYear(
            itemValue,
            this.state.month,
            this.props.selectedjob,
          );
          this.setState({ year: itemValue });
        }}
      >
        <Picker.Item label="۱۳۹۷" value="1397" />
        <Picker.Item label="۱۳۹۸" value="1398" />
        <Picker.Item label="۱۳۹۹" value="1399" />
        <Picker.Item label="۱۴۰۰" value="1400" />
        {/* <Picker.Item label="۲۰۱۸" value="2018" /> */}
      </Picker>
    );
  }

  sortRecords() {
    // console.log(this.state.sort);
    return (
      <Picker
        selectedValue={
          this.state.sort === '' ?
            this.setState({ sort: 'Date' }) :
            this.state.sort
        }
        style={{ width: 100 }}
        onValueChange={(itemValue) => {
          this.setState({ sort: itemValue });
          this.props.sortRecords(itemValue, this.props.selectedjob);
        }}
      >
        <Picker.Item label="Date" value="Date" />
        <Picker.Item label="Duration" value="Duration" />
        <Picker.Item label="Paid" value="Paid" />
        <Picker.Item label="Unpaid" value="Unpaid" />
        <Picker.Item label="Payroll" value="Payroll" />
      </Picker>
    );
  }

  render() {
    console.log(this.props.selectedjob);
    return (
      <View style={{ flex: 1 }}>
        <View >
          <Header
            rightComponent={this.sortRecords()}
            leftComponent={
              <View>
                {this.renderJobs()}
              </View>
            }
            outerContainerStyles={{
              backgroundColor: "rgba(92, 99,216, 1)",
              margin: 5,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5 
            }}
            innerContainerStyles={{ justifyContent: 'space-around',  }}
          />
        </View>
        <ScrollView>
          {
            this.renderRecords(this.props.selectedjob)
          }
          {
            this.renderModal()
          }
          {
            this.renderModalPurchased()
          }
        </ScrollView>
        <View >
          <Header
            rightComponent={
              <Text style={styles.italics}>
                Total Income: {Number((this.totalIncome).toFixed(1))}
                {/* {Number((this.totalIncome).toFixed(1))} */}
              </Text>
            }
            
            // leftComponent={this.renderJobs()}
            centerComponent={this.renderMonths()}
            leftComponent={this.renderYears()}
            outerContainerStyles={{
              backgroundColor: "rgba(92, 99,216, 1)",
              margin: 5,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5 
            }}
            innerContainerStyles={{ justifyContent: 'space-around', }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
    italics: {
      // marginTop: 25,
      // marginBottom: 25,
      fontStyle: 'italic'
    },
    detailWrapper: {
      marginTop: 10,
      marginBottom: 10,
      flexDirection: 'column',
      justifyContent: 'space-around'
    }
});

const mapStateToProps = state => {
  return {
    jobRecords: state.records.jobsRecordForView,
    jobs: state.records.jobs,
    recordNote: state.records.recordNote,
    selectedjob: state.records.selectedJob,
    spentMoney: state.records.spentMoney,
  };
};

export default connect(mapStateToProps, actions)(RecordsScreen);
