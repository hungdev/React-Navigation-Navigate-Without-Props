import React from 'react'
import { Button, View, Text, AppRegistry } from 'react-native'
import { createStackNavigator } from 'react-navigation'

// import { Provider } from 'react-redux'
// import configureStore from './configureStore'
// import App from './app'
// import NavigationService from './NavigationService'
// import stackPri from './stackPri'

export default class DetailScreen extends React.Component {
  render () {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title='Go to Details'
          onPress={() => this.props.navigation.navigate('Details')}
        />
      </View>
    )
  }
}
