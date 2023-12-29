import React, {useEffect, useRef} from 'react';
import {
  BackHandler,
  Platform,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import {NavigationContainer} from '@react-navigation/native';
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

  const InjectedCode = `(function() {
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({type:'NAVIGATION',payload:{idx:e.state.idx}}));
    });
  
    const meta = document.createElement('meta'); 
    meta.setAttribute('content', 'viewport-fit=cover'); 
    meta.setAttribute('name', 'viewport');
    document.getElementsByTagName('head')[0].appendChild(meta);

  })();
  true; // without this, js parsing error comes up
  `;

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <SafeAreaView style={{backgroundColor: '#141417', flex: 1}}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />

          <View style={{flex: 1}}>
            <WebView
              setSupportMultipleWindows={false}
              ref={webViewRef}
              javaScriptEnabled
              scalesPageToFit={false}
              allowsBackForwardNavigationGestures
              onLoadStart={() => {
                webViewRef.current?.injectJavaScript(InjectedCode);
              }}
              textZoom={100}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              originWhitelist={['http://*', 'https://*', 'intent:*']}
              decelerationRate="normal"
              source={{
                uri: 'https://www.10mm.today/',
              }}
              bounces={false}
              webviewDebuggingEnabled
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default App;
