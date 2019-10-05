import React, { Component } from 'react';
import { Text, View, Picker } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { Stopwatch } from 'react-native-stopwatch-timer';
import { connect } from 'react-redux';
import moment from 'jalali-moment';
import * as actions from '../actions';
// import { Stopwatch } from '../src/Stopwatch';
import MyView from '../src/MyView';
import { calcDuration } from '../src/CalcIncome';

class HomeScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      // tabBarIcon: {
      //   icon: () => {
      //     return <Icon name="g-translate" size={10} color="red" />;
      //   }
      // },
      headerRight: (
        <Button
          title=''
          onPress={() => navigation.navigate('AddJob')}
          icon={{ name: 'add' }}
          buttonStyle={{
            margin: 10,
            backgroundColor: "rgba(92, 99,216, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5
          }}
        />
      ),
      // headerstyle: {
      //       marginTop: Platform.OS === 'android' ? 24 : 0
      // },
      // headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      stopwatchStart: false,
      stopwatchReset: false,
      isHidden: true,
      selectedJob: '',
    };
    // if (this.props.jobs) {
    //   this.state = { ...this.state, selectedJob: this.props.jobs[0].name };
    // }
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
    this.startTime = null;
    this.endTime = null;
    this.duration = '';
    this.date = '';
    this.startkey = '';
    this.startjobname = '';
  }

  toggleStopwatch() {
    this.setState({ stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false });
  }
 
  resetStopwatch() {
    this.setState({ stopwatchStart: false, stopwatchReset: true });
  }
  
  getFormattedTime(time) {
      this.currentTime = time;
  } 

  renderJobs() {
    // if (Object.keys(this.props.jobs).length === 0 && this.props.jobs.constructor === Object) {
    if (this.props.jobs.length !== 0) {
      // console.log(this.props.data);
      // console.log(this.props.jobs);
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
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
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
        <View style={styles.container}>

          <MyView hide={this.state.isHidden}>
            <Text style={styles.welcome}>
              {moment.unix(this.startTime).locale('fa').format('HH:mm')}
            </Text>
          </MyView>
          <MyView hide={this.state.isHidden}>
            <View style={{ textAlign: 'left' }}>
              <Stopwatch
                start={this.state.stopwatchStart}
                reset={this.state.stopwatchReset}
                options={options}
                getTime={this.getFormattedTime} 
              />
            </View>
          </MyView>
          <View style={styles.buttons}>
            <Button
              buttonStyle={{
                margin: 10,
                backgroundColor: "rgba(92, 99,216, 1)",
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5
              }}
              title={!this.state.stopwatchStart ? 'Start' : 'Stop'}
              icon={!this.state.stopwatchStart ? { name: 'fingerprint' } : { name: 'stop' }}
              onPress={() => {
                let value = this.state.isHidden;
                if (!this.state.stopwatchStart) {
                  value = false;
                  this.toggleStopwatch();
                  this.props.setAppStatus(true);
                  this.startTime = moment().locale('fa').unix();
                  this.key = moment().locale('fa').format('HH:mm:ss');
                  this.startjobname = this.props.selectedjob;
                  this.endTime = '';
                  this.duration = '';
                  this.date = moment.unix(this.startTime).format('jYYYY/jM/jD');
                } else {
                  value = true;
                  this.resetStopwatch();
                  this.props.setAppStatus(false);
                  this.endTime = moment().locale('fa').unix();
                  this.duration = calcDuration(this.startTime, this.endTime);
                  if (this.props.selectedjob !== '') {
                    this.props.addRecord({
                      start: this.startTime,
                      end: this.endTime,
                      status: 'unpaid',
                      key: `${this.date}-${this.key}`,
                      note: '',
                      type: 'record',
                    }, this.startjobname);
                  }
                  this.date = '';
                }
                this.setState({ isHidden: value });
              }}
            />
            {/* <MyView hide={this.state.isHidden}>
              <Button
                title={!this.state.stopwatchStart ? 'Resume' : 'Pause'}
                icon={!this.state.stopwatchStart ? { name: 'play-circle-outline' } : { name: 'pause-circle-outline' }}
                backgroundColor="#9E9E9E"
                large
                onPress={this.toggleStopwatch}
              />
            </MyView> */}
          </View>
          <MyView>
              <Text style={styles.welcome}>
                {this.duration}
              </Text>
              <Text style={styles.welcome}>
                {this.date}
              </Text>
              <Text style={styles.welcome}>
                {this.props.appStatus ? 'salam' : 'bye'}
              </Text>
          </MyView>

        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  buttons: {
    flexDirection: 'row'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
};


const options = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
    width: 220,
  },
  text: {
    fontSize: 30,
    color: '#000',
    marginLeft: 7,
  }
};

const mapStateToProps = state => {
  return {
    name: state.records.jobName,
    wage: state.records.jobWage,
    selectedjob: state.records.selectedJob,
    jobRecords: state.records.jobsRecord,
    jobs: state.records.jobs,
    appStatus: state.records.appStartedStatus,
  };
};

export default connect(mapStateToProps, actions)(HomeScreen);
