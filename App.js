import React, {useContext} from 'react';
import { Text, View, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginHome from './src/screens/LoginScreen';
import ListaScreen from './src/screens/ListaScreen';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          tabBar={() => null}
        >  
          <Stack.Screen name="Login" component={LoginHome} 
            options={{
              title: 'Login',
              headerStyle: {
                backgroundColor: 'blue',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen name="Home" component={HomeScreen}
            options={{
              headerRight: null
            }}
          />
          <Stack.Screen name="TaskList" component={ListaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;