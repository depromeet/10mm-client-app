import React, {useEffect, useRef} from 'react';
import {
  BackHandler,
  Dimensions,
  Platform,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const webViewRef = useRef(null);
  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current?.goBack();
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress,
        );
      };
    }
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']}>
        <View style={{height: Dimensions.get('window').height}}>
          <View style={{flex: 1}}>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor={backgroundStyle.backgroundColor}
            />

            <WebView
              setSupportMultipleWindows={false}
              ref={webViewRef}
              javaScriptEnabled
              scalesPageToFit={false}
              allowsBackForwardNavigationGestures
              textZoom={100}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              originWhitelist={['http://*', 'https://*', 'intent:*']}
              decelerationRate="normal"
              source={{
                uri: 'https://10mm-client-web.vercel.app/timer',
                flex: 1,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
