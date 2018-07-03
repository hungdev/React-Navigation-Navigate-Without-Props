import React from 'react'
import './ReactotronConfig'

import { Button, View, Text, AppRegistry } from 'react-native'
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'

import { Provider } from 'react-redux'
import configureStore from './configureStore'
import App from './app'
import NavigationService from './NavigationService'
import stackPri from './stackPri'
import HomeScreen from './HomeScreen'
import DetailsScreen from './DetailsScreen'
import Drawer from 'react-native-drawer'
import ControlPanel from './ControlPanel'

const store = configureStore()

const TopLevelNavigator = createDrawerNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen
  },
  {
    initialRouteName: 'Home'
  }
)
// const RNRedux = () => (
//   <Provider store={store}>
//     <TopLevelNavigator
//       ref={navigatorRef => {
//         NavigationService.setTopLevelNavigator(navigatorRef)
//       }}
//       />
//   </Provider>
// )
export default class AppWithNavigationState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contacts: [],
      isLeftDrawerOpened: false,
      isRightDrawerOpened: false
    }
  }

  render () {
    return (
      <TopLevelNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef)
        }}
      />
    )
  }
}

// AppRegistry.registerComponent('RNRedux', () => RNRedux)
