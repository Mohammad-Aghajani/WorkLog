import React, { Component } from 'react';
import { View, Switch, Text, Picker, ScrollView } from 'react-native';
import { Button, Input, Header } from 'react-native-elements';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import * as actions from '../actions';
import MyView from '../src/MyView';

class AddJobScreen extends Component {
  static navigationOptions = {
    title: 'Add Job',
  }

  constructor(props) {
    super(props);
    this.state = {
      overtimeSwitch: false,
      modalVisible: false,
      editedName: '',
      editedHourlyWage: '',
      editedASFactor: '',
      editedNSFactor: '',
    };
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

  onEdittingNameChange(text) {
      this.props.nameEdited(text);
  }

  onEdittingWageChange(text) {
      this.props.wageEdited(text);
  }

  EdittingAsFactorChange(text) {
    this.props.asFactorEdited(text);
  }

  EdittingNsFactorChange(text) {
    this.props.nsFactorEdited(text);
  }

  onNameChange(text) {
      this.props.nameChanged(text);
  }

  onWageChange(text) {
      this.props.wageChanged(text);
  }

  asFactorChange(text) {
    this.props.asFactorChanged(text);
  }

  nsFactorChange(text) {
    this.props.nsFactorChanged(text);
  }

  onButtonPress() {
    // console.log(this.props.asFactor);
    // console.log(typeof this.props.nsFactor);
    
    this.props.addJob({
      name: this.props.name,
      hourlyWage: this.props.wage,
      AfternoonShiftFactor: this.props.asFactor,
      NightShiftFactor: this.props.nsFactor
    });
    // return (
    //     this.props.navigation.navgiate('Home')
    // ); 
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        backdropOpacity={0.50}
        backdropColor={'red'}
        visible={this.state.modalVisible}
      >

        <Input
          label='Name'
          placeholder='Job name'
          value={this.props.edittingJobName}
          onChangeText={this.onEdittingNameChange.bind(this)}
          containerStyle={{ margin: 5, }}
        />

        <Input
          label='Wage'
          placeholder='Hourly wage'
          value={this.props.edittingJobWage}
          onChangeText={this.onEdittingWageChange.bind(this)}
          containerStyle={{ margin: 5, }}
        />

        <Button
          title="Edit"
          large
          onPress={() => {
            if (this.props.selectedjob !== '') {
              console.log('omadtush');
              // this.props.deleteThisRecord(this.state.key, this.state.selectedJob);
              this.props.editThisJob({
                name: this.props.edittingJobName,
                hourlyWage: this.props.edittingJobWage,
                // AfternoonShiftFactor: this.props.asFactor,
                // NightShiftFactor: this.props.nsFactor
              }, this.props.selectedjob);
            }
            // this.props.selectJob(this.props.edittingJobName);
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
        <Button
          title="Close"
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
      </Modal>
    );
  }

  render() {
    console.log(this.props.selectedjob);
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {this.renderModal()}
          <Header
            rightComponent={
              <Button
                title="Delete"
                icon={{ name: 'delete' }}
                // backgroundColor="#F44336"
                onPress={() => {
                  this.props.deleteJob(this.props.selectedjob);
                  this.props.selectJob('');
                  this.props.navigation.navigate('Home');
                }}
              />
            }
            leftComponent={this.renderJobs()}
            centerComponent={
              <Button
                title="Edit"
                icon={{ name: 'edit' }}
                backgroundColor="#F44336"
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
              />
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
          <View>
            <Input
              label='Name'
              placeholder='Job name'
              value={this.props.name}
              onChangeText={this.onNameChange.bind(this)}
              containerStyle={{ flex: 1, margin: 15, }}
            />
            
            <Input
              label='Wage'
              placeholder='Hourly wage'
              value={this.props.wage}
              onChangeText={this.onWageChange.bind(this)}
              containerStyle={{ flex: 1, margin: 15, }}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 5 }}>
            <Text style={{ fontSize: 16, margin: 15 }}>
              Overtime
            </Text>
            <Switch
              onValueChange={(value) => this.setState({ overtimeSwitch: value })} 
              value={this.state.overtimeSwitch} 
            />
          </View>
          <MyView hide={!this.state.overtimeSwitch}>
            <Input
              label='Afternoon shift factor'
              placeholder='enter number like 1.5'
              value={this.props.asFactor}
              onChangeText={this.asFactorChange.bind(this)}
              containerStyle={{ flex: 1, margin: 15, }}
            />

            <Input
              label='Night shift factor'
              placeholder='enter number like 2'
              value={this.props.nsFactor}
              onChangeText={this.nsFactorChange.bind(this)}
              containerStyle={{ flex: 1, margin: 15, }}
            />
          </MyView>
        </ScrollView>
        <View>
          <Button
            buttonStyle={{
              margin: 10,
              backgroundColor: "rgba(92, 99,216, 1)",
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5
            }}
            title="Add"
            icon={{ name: 'add' }}
            onPress={() => {
              this.onButtonPress();
              this.props.navigation.navigate('Home');
            }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
    return {
      jobs: state.records.jobs,
      jobRecords: state.records.jobsRecordForView,
      name: state.records.jobName,
      wage: state.records.jobWage,
      asFactor: state.records.jobAsFactor,
      nsFactor: state.records.jobNsFactor,
      selectedjob: state.records.selectedJob,
      edittingJobName: state.records.edittingJobName,
      edittingJobWage: state.records.edittingJobWage,
      edittingJobAsFactor: state.records.edittingJobAsFactor,
      edittingJobNsFactor: state.records.edittingJobNsFactor,
    };
  };

export default connect(mapStateToProps, actions)(AddJobScreen);
