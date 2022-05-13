import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  ImageBackground,
  Platform,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import DATA from './API/CONTENTLISTINGPAGE-PAGE1.json';
import {
  placeholder,
  poster1,
  poster2,
  poster3,
  poster4,
  poster5,
  poster6,
  poster7,
  poster8,
  poster9,
  back,
  nav,
  search,
} from './Slices';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const ICON = {
  poster1: poster1,
  poster2: poster2,
  poster3: poster3,
  poster4: poster4,
  poster5: poster5,
  poster6: poster6,
  poster7: poster7,
  poster8: poster8,
  poster9: poster9,
};

const Section: React.FC<{
  name: string;
  'poster-image': string;
}> = ({item}: any) => {
  return (
    <TouchableOpacity key={item.name} style={styles.sectionContainer}>
      <Image
        style={styles.poster}
        source={ICON[item['poster-image'].split('.')[0]]}
        defaultSource={placeholder}
      />
      {!!item.name && <Text style={[styles.sectionTitle]}>{item.name}</Text>}
    </TouchableOpacity>
  );
};

const {width} = Dimensions.get('window');
const PADDING = 16;
const SEARCH_SHRINK_WIDTH = 0; //search_width when unfocused
const SEARCH_FULL_WIDTH = width - PADDING * 7; //search_width when focused

const App = () => {
  const isDarkMode = useColorScheme() === 'light';

  const [show, setShow] = useState(true);
  const [input, setInput] = useState('');
  const [data, setData] = useState(DATA['page']['content-items']['content']);
  const [inputLength, _] = useState(new Animated.Value(SEARCH_FULL_WIDTH));
  const [opacity, __] = useState(new Animated.Value(0));
  const [searchBarFocused, ___] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if (input !== '')
      setData(
        DATA['page']['content-items']['content'].filter(
          ({name}) => input.toLowerCase() === name.substring(0, input.length).toLowerCase(),
        ),
      );
      else setData(
        DATA['page']['content-items']['content'].filter(
          ({name}) => input === name.substring(0, input.length),
        )
      );
  }, [input]);

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const onBlur = () => {
    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleScroll = (event: any) => {
    if (
      (event.nativeEvent.contentOffset.y > 0 && show !== false) ||
      (event.nativeEvent.contentOffset.y < 0 && show !== true)
    )
      event.nativeEvent.contentOffset.y > 0 ? setShow(false) : setShow(true);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={backgroundStyle} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          position: 'relative',
          ...Platform.select({
            android: {elevation: 20, shadowColor: '#353935'},
            ios: {
              shadowColor: '#353935',
              shadowOffset: {width: -2, height: 4},
              shadowOpacity: 0.2,
              shadowRadius: 3,
            },
          }),
        }}>
        <ImageBackground
          source={nav}
          imageStyle={{backgroundColor: show ? '#000' : '#28282B'}}>
          <View
            style={{
              paddingVertical: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: '100%',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity onPress={onBlur}>
                <Image
                  source={back}
                  resizeMode={'contain'}
                  style={{height: 25}}
                />
              </TouchableOpacity>
              {!searchBarFocused && (
                <Text style={styles.title}>{DATA.page.title}</Text>
              )}
            </View>
            <Animated.View
              style={[
                styles.search,
                {
                  width: inputLength,
                  position: 'absolute',
                  left: 50,
                  alignSelf: 'center',
                },
                searchBarFocused === true
                  ? undefined
                  : {justifyContent: 'center'},
              ]}>
              <TextInput
                autoCapitalize={'none'}
                onBlur={onBlur}
                onFocus={onFocus}
                onChangeText={setInput}
                value={input}
                placeholder="Type something"
              />
            </Animated.View>
            <TouchableOpacity onPress={onFocus} style={{height: '100%'}}>
              <Image
                source={search}
                resizeMode={'contain'}
                style={{height: 25}}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
      <FlatList
        onScroll={handleScroll}
        numColumns={3}
        contentContainerStyle={styles.wrapper}
        data={data}
        renderItem={Section}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  poster: {
    width: '100%',
    height: 200,
  },
  sectionContainer: {
    width: '32%',
    height: 230,
    marginBottom: '7%',
    marginRight: '2%',
  },
  wrapper: {
    flexGrow: 1,
    backgroundColor: '#000',
    // flexDirection: 'row',
    paddingHorizontal: '2%',
  },
  sectionTitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#fff',
  },
  title: {
    fontSize: 26,
    color: '#fff',
  },
  // searchContainer: {
  //   flexDirection: 'row',
  //   height: 72,
  //   borderBottomColor: '#00000033',
  //   paddingTop: 100,
  // },
  search: {
    flex: 1,
    width: 0,
    flexDirection: 'row',
    height: 40,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});

export default App;
