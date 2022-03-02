import React from 'react';

import { StatusBar } from 'react-native';

import { ThemeProvider } from 'styled-components';

import { NavigationContainer } from '@react-navigation/native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import AppLoading from 'expo-app-loading';

import theme from './src/global/styles/theme';

import { AppRoutes } from './src/routes/app.routes';

import 'intl';

import 'intl/locale-data/jsonp/pt-BR';

import { SignIn } from './src/screens/SignIn';

import { AuthProvider } from './src/hooks/auth';

export default function App() {
  const [fontLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontLoaded) {
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StatusBar 
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />     
          <AuthProvider>
            <SignIn />
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}