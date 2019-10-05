import React, { Component, } from 'react';
import { View, Text, StyleSheet, Picker, } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Header, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import moment from 'jalali-moment';
import PersianCalendarPicker from 'react-native-persian-calendar-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as actions from '../actions';

class AddPurchasedItemScreen extends Component {
  static navigationOptions = {
    title: 'Add Item',
  }

  
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {  
    this.setState({
      date: moment(date.format()).locale('fa').format('YYYY/M/D')
    });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onChangeSpentMoney(text) {
    this.props.SpentMoneyChanged(text);
  }

  renderJobs() {
    if (this.props.jobs.length !== 0) {
      return (
        <Picker
          selectedValue={this.props.selectedjob === '' ?
            this.props.selectJob(this.props.jobs[0].name) :
            this.props.selectedjob
          }
          style={{ height: 50, width: 120 }}
          onValueChange={(itemValue) => {
            this.props.selectJob(itemValue);
          }}
        >
          {
            this.props.jobs.map(data => {
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
              this.props.addRecord({
                date: this.state.date,
                spent: this.props.spentMoney,
                status: 'unpaid',
                key: `${this.state.date}-${this.state.date}`,
                note: '',
                type: 'purchased',
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
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
  },
});

const mapStateToProps = state => {
  return {
    jobRecords: state.records.jobsRecord,
    jobs: state.records.jobs,
    selectedjob: state.records.selectedJob,
    spentMoney: state.records.spentMoney
  };
};

export default connect(mapStateToProps, actions)(AddPurchasedItemScreen);
