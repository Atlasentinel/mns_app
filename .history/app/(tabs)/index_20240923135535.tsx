import { Image, StyleSheet, Platform, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from 'react-native-screens';
import { Link } from 'expo-router';

export default function HomeScreen() {

  const insets = useSafeAreaInsets();

  const viewStyles = StyleSheet.create({
    viewStyle: {
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
      height: 740,
      display: 'flex',
      fontSize: 44,
    },
    deleteBtnStyle: {
      marginBottom: insets.bottom,
      marginTop: insets.top,
      marginHorizontal: 100,
      borderWidth: 4,
      borderRadius: 10,
      padding: 10,
      fontSize: 44,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      color: 'white',
      width: 200,
      borderColor: 'white'
    },
  });

  const onSupprimer = () => {
    let msg = "";
    Platform.OS === 'ios' ? msg = "MENU TAH LES FOU" : msg = "Sheeeesh";
    return msg
  }

  return (
    <View style={viewStyles.viewStyle}>
      <Link href="@/app/user/index">{onSupprimer()}</Link>
    </View>
  );

}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
