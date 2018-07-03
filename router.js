import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  createStackNavigator, StackNavigator, DrawerNavigator, SwitchNavigator, NavigationActions,
  addNavigationHelpers
} from 'react-navigation'
import { BackHandler, TouchableOpacity, Text, View } from 'react-native'
import { NAV_LOGIN, NAV_ACCOUNT, NAV_HOME } from '../global/Constant'
import Log from '../utils/LogUtils'
import LoginScreen from '../screens/LoginScreen'
import MainScreen from '../screens/MainScreen'
import ProfileScreen from '../screens/ProfileScreen'
import DrawerButton from '../components/DrawerButton'
import Drawer from 'react-native-drawer'
import { addListener } from '../utils/ReactNavigationRedux'
import ContactDrawer from '../screens/ContactDrawer'
import MainDrawer from '../screens/MainDrawer'
import Contacts, { openContactForm } from 'react-native-contacts'
import Reactotron from 'reactotron-react-native'
import { replaceAll } from '../utils/Formater'
import _ from 'lodash'
import LogUtils from '../utils/LogUtils';
import TabHomeStack from './TabHomeStack'
import LookupTransaction from '../screens/LookupTransaction'

export const AppNavigator = StackNavigator({
  NAV_LOGIN: { screen: LoginScreen },
  NAV_HOME: { screen: MainScreen },
  NAV_ACCOUNT: { screen: ProfileScreen },
  NAV_LOOKUP_TRANS: { screen: LookupTransaction }
}, {
    navigationOptions: ({ navigation }) => ({
      // headerLeft: <DrawerButton navigation={navigation} />,
      headerRight: <ContactButton navigation={navigation} />,
      gesturesEnabled: false
    })
  });

export class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    Navigation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = {
      contacts: [],
      isLeftDrawerOpened: false,
      isRightDrawerOpened: false
    }
  }

  componentWillMount() {
    // Contacts.getAll((err, contacts) => {
    // 	if (err === 'denied') {
    // 		Toast('youShouldAllowAppToUseContact')
    // 		// error
    // 	} else {
    // 		this.setState({ contacts })
    // 		myContacts = contacts
    // 	}
    // })
  }


  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {

    if (this.state.isLeftDrawerOpened) {
      this.closeLeftControlPanel();
    } else if (this.state.isRightDrawerOpened) {
      this.closeControlPanel();
    } else {
      const { dispatch, Navigation } = this.props;
      if (Navigation.index === 0) {
        return false;
      }
      dispatch(NavigationActions.back());
    }
    return true;
  };

  _addNavigationHelpers(navigation) {
    const original = addNavigationHelpers(navigation);
    let debounce;
    return {
      ...original,
      navigateWithDebounce: (routeName, params, action) => {
        let func = () => {
          if (debounce) {
            return;
          }
          navigation.dispatch(NavigationActions.navigate({
            routeName,
            params,
            action
          }));

          debounce = setTimeout(() => {
            debounce = 0;
          }, 200)
        };
        return func();

      }
    }
  }
  closeControlPanel = () => {
    this._drawer.close()
  };
  openControlPanel = () => {
    this._drawer.open()
  };

  closeLeftControlPanel = () => {
    this._leftDrawer.close()
  };
  openLeftControlPanel = () => {
    this._leftDrawer.open()
  };

  onSearchContact(text) {
    let qr = _.filter(myContacts, item => item.phoneNumbers && item.phoneNumbers[0] && replaceAll(item.phoneNumbers[0].number, '-', '').includes(text))
    Contacts.getContactsMatchingString(text, (err, contacts) => {
      if (err === 'denied') {
        alert(`error: ${err}`)
      } else {
        let merContact = _.uniqBy(_.concat(qr, contacts), "recordID")
        this.setState({ contacts: merContact })
      }
    })
  }

  render() {
    const { dispatch, Navigation } = this.props;
    Log.d(this, 'State', this.props)
    const { contacts } = this.state
    return (
      <Drawer
        ref={(ref) => this._leftDrawer = ref}
        type="overlay"
        content={<MainDrawer
          screenProps={this.props}
          closeControlPanel={() => this.closeLeftControlPanel()}
          openControlPanel={() => this.openLeftControlPanel()}
        />}
        openDrawerOffset={0.2}
        tapToClose={true}
        side="left"
        captureGestures={true}
        onOpen={() => {
          this.setState({ isLeftDrawerOpened: true })

        }}
        onClose={() => this.setState({ isLeftDrawerOpened: false })}
        panOpenMask={0.05}>
        <Drawer
          ref={(ref) => this._drawer = ref}
          type="overlay"
          content={<ContactDrawer
            contacts={this.state.contacts}
            screenProps={this.props}
            closeControlPanel={() => this.closeControlPanel()}
            openControlPanel={() => this.openControlPanel()}
            searchContact={(contact) => this.onSearchContact(contact)}

          />}
          openDrawerOffset={0.2}
          tapToClose={true}
          onOpen={() => {
            this.setState({ isRightDrawerOpened: true })
          }}
          onClose={() => { this.setState({ isRightDrawerOpened: false }) }}
          side="right"
          captureGestures={true}
          panOpenMask={0.05}>
          <AppNavigator
            navigation={this._addNavigationHelpers({
              dispatch,
              state: Navigation,
              addListener,
            })
            } />
        </Drawer>
      </Drawer>
    )
  }
}


// const MainNavigator = DrawerNavigator({
// 	Home: {
// 		screen: AppWithNavigationState
// 	},
// 	Drawer: {
// 		screen: MainDrawer
// 	}
// })

class ContactButton extends React.Component {
  static contextTypes = {
    drawer: PropTypes.object.isRequired
  };
  render() {
    return (
      <TouchableOpacity onPress={this.context.drawer.open}>
        <Text>
          Open Contact
                </Text>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = state => ({
  Navigation: state.Navigation,
  isLoading: state.isLoading
});

export default connect(mapStateToProps)(AppWithNavigationState);