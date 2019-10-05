import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import { Provider } from 'react-redux';
import { PermissionsAndroid, componentWillMount } from 'react-native';
// import { requestPermission } from 'react-native-android-permissions';
import { PersistGate } from 'redux-persist/lib/integration/react';
import RecordsScreen from './screens/RecordsScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddJobScreen from './screens/AddJobScreen';
import ManuallyAddRecordScreen from './screens/ManuallyAddRecordScreen';
import AddPurchasedItemScreen from './screens/AddPurchasedItemScreen';

// import the two exports from the last code snippet.
import { persistor, store } from './store';
// // import your necessary custom components.
// import { RootComponent, LoadingView } from './components';


class App extends React.Component {
  async componentWillMount() {
    await requestStoragePermission()
  }

  render() {
    // const DrawerStack = createDrawerNavigator(
    //   { 
    //     ManuallyAdd: { screen: ManuallyAddRecordScreen }
    //   }
    // );

    const RecordsStack = createStackNavigator({
      Records: { screen: RecordsScreen },
      Settings: { screen: SettingsScreen },
      ManuallyAdd: { screen: ManuallyAddRecordScreen },
      AddItem: { screen: AddPurchasedItemScreen }
      // Drawer: { screen: DrawerStack }
    });

    const HomeStack = createStackNavigator(
      {
        Home: { screen: HomeScreen },
        AddJob: { screen: AddJobScreen },
        // Drawer: { screen: DrawerStack }
      },
      // {
      //   initialRouteName: 'AddJob'
      // }
  );
    
    // const MainNavigator = createTabNavigator(
    const MainNavigator = createBottomTabNavigator(
      {
        Home: { screen: HomeStack },
        Records: { screen: RecordsStack }
      },
      {
        // tabBarComponent: TabBarBottom,
        
        tabBarPosition: 'bottom',
        tabBarOptions: {
          activeTintColor: 'red',
          inactiveTintColor: 'gray',
          showIcon: true
        },
        animationEnabled: false,
        swipeEnabled: true,
      }   
    );

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainNavigator />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

export async function requestStoragePermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'WorkLog',
        'message': 'WorkLog App needs access to your storage'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the storage")
      // alert("You can use the location");
    } else {
      console.log("storage permission denied")
      // alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
}
