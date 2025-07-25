import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
// Add logic to check for user_id and auto-navigate
function AppWrapper({ navigation }) {
  useEffect(() => {
    const checkUserId = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        navigation.replace('Main');
      }
    };
    checkUserId();
  }, []);
  return <App />;
}

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import Main from './Screens/Main';
import SpecificPost from './Screens/SpecificPost';
import Splash from './Screens/Splash';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="SpecificPost" component={SpecificPost} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default AppWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
