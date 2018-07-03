import React from 'react'
import './ReactotronConfig'

import { Button, View, Text, AppRegistry } from 'react-native'
import { createStackNavigator } from 'react-navigation'

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

const TopLevelNavigator = createStackNavigator(
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
      <Drawer
        ref={(ref) => this._leftDrawer = ref}
        type='overlay'
        content={<ControlPanel
          screenProps={this.props}
          closeControlPanel={() => this.closeLeftControlPanel()}
          openControlPanel={() => this.openLeftControlPanel()}
        />}
        openDrawerOffset={0.2}
        tapToClose
        side='left'
        captureGestures
        onOpen={() => {
          this.setState({ isLeftDrawerOpened: true })
        }}
        onClose={() => this.setState({ isLeftDrawerOpened: false })}
        panOpenMask={0.05}>
        <Drawer
          ref={(ref) => this._drawer = ref}
          type='overlay'
          content={<ControlPanel
            contacts={this.state.contacts}
            screenProps={this.props}
            closeControlPanel={() => this.closeControlPanel()}
            openControlPanel={() => this.openControlPanel()}
            searchContact={(contact) => this.onSearchContact(contact)}

          />}
          openDrawerOffset={0.2}
          tapToClose
          onOpen={() => {
            this.setState({ isRightDrawerOpened: true })
          }}
          onClose={() => { this.setState({ isRightDrawerOpened: false }) }}
          side='right'
          captureGestures
          panOpenMask={0.05}>
          <TopLevelNavigator
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef)
            }}
          />
        </Drawer>
      </Drawer>
    )
  }
}

// AppRegistry.registerComponent('RNRedux', () => RNRedux)
