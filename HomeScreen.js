import React from 'react'
import { Button, View, Text, AppRegistry } from 'react-native'
import { createStackNavigator } from 'react-navigation'

import { connect } from 'react-redux'
import { addPerson, deletePerson } from './actions'

class HomeScreen extends React.Component {
  render () {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title='Go to Details'
          onPress={() => this.props.dispatchAddPerson('ah')}
        />
      </View>
    )
  }
}

function mapStateToProps (state) {
  return {
    people: state.people.people
  }
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchAddPerson: (person) => dispatch(addPerson(person)),
    dispatchdeletePerson: (person) => dispatch(deletePerson(person))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
