import Navbar from "@/components/navigation/navbar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const [source, setSource] = useState<{ id: string, nom: string, imageUrl: string, coords?: { latitude: number, longitude: number } }[]>([]);
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

    // Fetch data on component mount
    fetchData();

    // Set up polling to check for updates every 2 seconds
    const intervalId = setInterval(fetchData, 2000); // Adjust the interval as needed

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const onDelete = async (id: string) => {
    const filteredSource = source.filter((item) => item.id !== id);
    setSource(filteredSource);

    // Save the updated source back to AsyncStorage
    try {
      await AsyncStorage.setItem('source', JSON.stringify(filteredSource));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données', error);
    }
  };

  const viewStyles = StyleSheet.create({
    viewStyle: {
      alignItems: 'center',
      backgroundColor: 'white',
      height: 740,
      gap: 10,
      display: 'flex',
    },
    btn_menu: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 100
    },
    views: {
      marginBottom: insets.bottom,
      marginTop: insets.top,
      flexDirection: 'column',
      gap: 10,
    },
    deleteBtnStyle: {
      padding: 10,
      fontSize: 14,
      color: 'black',
    },
    flatlist: {
      borderWidth: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      marginBottom: 10,
      borderRadius: 10,
      backgroundColor: '#f5f5f5',
    },
  });

  return (
    <SafeAreaView style={viewStyles.viewStyle}>
      <View style={viewStyles.views}>
        <Navbar viewStyles={viewStyles} />
      </View>
      {source.length <= 0 && (
        <Text >Aucun obstacle pour le moment..</Text>
      )}
      <FlatList
        data={source}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={viewStyles.flatlist}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.nom}</Text>
            <TouchableOpacity onPress={() => onDelete(item.id)}>
              <TabBarIcon name="trash" color="red" />
            </TouchableOpacity>

          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
}
