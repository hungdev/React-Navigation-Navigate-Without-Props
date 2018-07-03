import React from 'react'
console.disableYellowBox = true
import {
  AppRegistry
} from 'react-native'

import { Provider } from 'react-redux'
import configureStore from './configureStore'
import App from './AppContainer'

const store = configureStore()

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent('RNRedux', () => RNRedux)
