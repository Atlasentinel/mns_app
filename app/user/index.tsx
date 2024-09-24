import Navbar from "@/components/navigation/navbar";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { View, Text, SafeAreaView, Alert, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Callout } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Test() {
    const insets = useSafeAreaInsets();

    const viewStyles = StyleSheet.create({
        viewStyle: {
            alignItems: 'center',
            backgroundColor: 'white',
            height: 740,
            gap: 10,
            display: 'flex',
        },
        views: {
            marginBottom: insets.bottom,
            marginTop: insets.top,
            flexDirection: 'column',
            gap: 10,
        },
        btn_menu: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 100
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
        scrollView: {
            marginHorizontal: 20,
            marginVertical: 10,
            height: 30
        },
        text: {
            fontSize: 22,
            fontWeight: 600,
            marginBottom: insets.bottom
        }
    });

    const source = [
        { id: 1, prenom: "Roger", nom: "Rabbit", tel: "0645372718" },
        { id: 2, prenom: "Stephanie", nom: "Bonne", tel: "0753421873" },
        { id: 3, prenom: "Marcus", nom: "Halloway", tel: "066988654" },
        { id: 5, prenom: "Loan", nom: "Keovilay", tel: "0837362827" },
        { id: 6, prenom: "Jean", nom: "Neymar", tel: "0754362738" },
        { id: 7, prenom: "Jade", nom: "Orlalcool", tel: "0634251738" },
    ];

    const call = (item: any) => {
        Alert.alert(`Appelle de ${item.prenom + ' ' + item.nom} en cours... \n\n +33 ${item.tel}`);
    };

    return (
        <SafeAreaView style={viewStyles.viewStyle}>
            <View style={viewStyles.views}>
                <Navbar viewStyles={viewStyles} />
            </View>
            <Text style={viewStyles.text}>Contact : </Text>
            <FlatList
                data={source}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => call(item)}>
                        <View style={viewStyles.flatlist}>
                            <Text>{item.prenom} {item.nom}</Text>
                            <Text>
                                <TabBarIcon name="call" color="green" />
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={true}
            />
        
        </SafeAreaView>
    );
}