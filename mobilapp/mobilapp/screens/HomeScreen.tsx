import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';


// Navigációs stack típusdefiníció
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  OrderDetails: { orderId: number };
};

// Rendelés típusdefiníció az API válasza alapján
type Order = {
  Megrendeles_ID: number;
  Datum: string;
  Osszeg: number;
};

const formatDate = (dateString:any) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 mert 0-tól számoz
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}.`; // Pl. "2025.03.11."
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: { navigation: HomeScreenNavigationProp }) => {
  const [orders, setOrders] = useState<Order[]>([]); // Típus megadása
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Hiba', 'Nincs bejelentkezve');
          navigation.replace('Login');
          return;
        }

        const response = await axios.get('http://localhost:3000/userorders', {
          headers: {
            Authorization: token,
          },
        });
        setOrders(response.data);
      } catch (error) {
        Alert.alert('Hiba', 'Nem sikerült lekérni a rendeléseket');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  const handleViewOrder = (orderId: number) => {
    console.log(`Megnézem a rendelést: ${orderId}`);
     navigation.navigate('OrderDetails', { orderId });
  };

  if (loading) {
    return (
      <View >
        <Text>Töltés...</Text>
      </View>
    );
  }

 
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Üdv a főoldalon!</Text>
        <Text style={styles.subtitle}>Rendeléseid:</Text>
        {orders.length === 0 ? (
          <Text style={styles.noOrders}>Nincsenek rendeléseid.</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.Megrendeles_ID.toString()}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>Megrendelés ID: </Text>
                  <Text style={styles.orderValue}>{item.Megrendeles_ID}</Text>
                </View>
                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>Dátum: </Text>
                  <Text style={styles.orderValue}>{formatDate(item.Datum)}</Text>
                </View>
                <View style={styles.orderRow}>
                  <Text style={styles.orderLabel}>Összeg: </Text>
                  <Text style={styles.orderValue}>{item.Osszeg} Ft</Text>
                </View>
                <View style={styles.orderButton}>
                  <Button 
                    title="Megnézem" 
                    onPress={() => handleViewOrder(item.Megrendeles_ID)} 
                    color="#dd7a00" 
                  />
                </View>
              </View>
            )}
          />
        )}
        <View style={styles.logoutButton}>
          <Button 
            title="Kilépés" 
            onPress={handleLogout} 
            color="#073865" 
          />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      padding: 20,
      backgroundColor: '#252525', // Sötétebb háttér a nagyobb kontrasztért
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 20,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 20,
      color: '#dd7a00',
      marginBottom: 15,
      fontWeight: '600',
    },
    noOrders: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
      padding: 20,
    },
    orderItem: {
      padding: 15,
      backgroundColor: '#3a3a3a', // Sötétebb kártya a kontraszt növeléséhez
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3, // Erősebb árnyék
      shadowRadius: 5,
      elevation: 5, // Magasabb elevation
    },
    orderRow: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    orderLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#f0a500', // Világos narancssárga
    },
    orderValue: {
      fontSize: 16,
      color: '#fff', // Fehér
    },
    orderButton: {
      marginTop: 10,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#dd7a00',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3, // Erősebb árnyék
      shadowRadius: 5,
      elevation: 5,
    },
    logoutButton: {
      marginTop: 20,
      borderRadius: 10,
      overflow: 'hidden',
      backgroundColor: '#073865',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3, // Erősebb árnyék
      shadowRadius: 5,
      elevation: 5,
    },
  });
export default HomeScreen;