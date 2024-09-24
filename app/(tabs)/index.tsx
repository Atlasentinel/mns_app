import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import Navbar from '@/components/navigation/navbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
  const [source, setSource] = useState<{ id: string; nom: string; imageUrl: string; coords?: { latitude: number; longitude: number } }[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedSource = await AsyncStorage.getItem('source');
        if (storedSource) {
          setSource(JSON.parse(storedSource));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('source', JSON.stringify(source));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des données', error);
      }
    };
    saveData();
  }, [source]);

  const getLocation = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Permission d\'accéder à la localisation refusée.');
      return;
    }
    try {
      let locationData = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationData.coords;
      setLocation({ latitude, longitude });
    } catch (error) {
      Alert.alert("Une erreur est survenue : " + error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewImageUrl(result.assets[0].uri);
    }
  };

  const onAdd = () => {
    if (!newItemName.trim() || !newImageUrl.trim()) {
      Alert.alert('Erreur', "Le nom de l'élément et l'image ne peuvent pas être vides.");
      return;
    }

    const newItem = {
      id: (source.length + 1).toString(),
      nom: newItemName,
      imageUrl: newImageUrl,
      coords: location ? { latitude: location.latitude, longitude: location.longitude } : undefined,
    };
    const nouvelleSource = [...source, newItem];
    setSource(nouvelleSource);
    setNewItemName('');
    setNewImageUrl('');
    setLocation(null);
    getLocation();
  };

  const onDelete = (id: string) => {
    const nouvelleSource = source.filter(item => item.id !== id);
    setSource(nouvelleSource);
  };

  const viewStyles = StyleSheet.create({
    viewStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      padding: 20,
      height: '100%',
    },
    btn_menu: {
      marginBottom: insets.bottom,
      marginTop: insets.top,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 100,
    },
    views: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 15,
      width: '100%',
    },
    flatlist: {
      flexDirection: 'row',
      width: '100%',
      borderWidth: 1,
      borderColor: '#dfe1e5',
      backgroundColor: '#fff',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
      marginBottom: 10,
    },
    inputStyle: {
      height: 40,
      borderColor: '#e5e5e5',
      borderWidth: 1,
      borderRadius: 15,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      marginBottom: 10,
      fontSize: 16,
    },
    buttonStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: '#FF5A5F',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      width: '40%',
    },
    buttonTextStyle: {
      flexDirection: 'row',
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    mapStyle: {
      width: '90%',
      height: 280,
      marginHorizontal: 20,
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 15,
    },
  });

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={viewStyles.viewStyle}>
        <Navbar viewStyles={viewStyles} />
        <View style={viewStyles.views}>
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <TextInput
              style={viewStyles.inputStyle}
              placeholder="Nom de l'élément"
              value={newItemName}
              onChangeText={setNewItemName}
            />
            <Button title="Choisir une image" onPress={pickImage} color="#FF5A5F" />
            {newImageUrl ? <Image source={{ uri: newImageUrl }} style={{ borderRadius: 10, width: 100, height: 100, marginVertical: 10, marginHorizontal: 130 }} /> : null}
          </View>
          <TouchableOpacity style={viewStyles.buttonStyle} onPress={onAdd}>
            <Text style={viewStyles.buttonTextStyle}>Ajouter</Text>
            <TabBarIcon name="add" color="white" />
          </TouchableOpacity>
          {isLoading ? (
            <View>
              <TabBarIcon style={{ fontSize: 120 }} name="map-outline" color="#FF5A5F"></TabBarIcon>
              <Text style={{ fontSize: 20 }}>Chargement...</Text>
            </View>
          ) : (
            location && (
              <MapView
                style={viewStyles.mapStyle}
                region={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
              >
                {source.map((item) => (
                  item.coords && (
                    <Marker
                      key={item.id}
                      coordinate={{ latitude: item.coords.latitude, longitude: item.coords.longitude }}
                      title={item.nom}
                    >
                      <Callout  onPress={() => onDelete(item.id)}>
                        <View style={{ alignItems: 'center', borderRadius: 30 }}>
                          <Text>{item.nom}</Text>
                          {item.imageUrl ? <Image source={{ uri: item.imageUrl }} style={{ borderRadius: 10, width: 150, height: 150 }} /> : null}
                          <Text style={{color: 'red'}}>Supprimer</Text>
                        </View>
                      </Callout>
                    </Marker>
                  )
                ))}
              </MapView>
            )
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
