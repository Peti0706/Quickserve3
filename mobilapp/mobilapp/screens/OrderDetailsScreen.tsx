import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type OrderDetail = {
  Megrendeles_ID: number;
  termeknev: string;
  kategoria: string;
  tipus: string;
  egysegar: number;
  cikkszam: string;
  mennyiseg: number;
  Osszeg: number;
  datum: string;
  Statusz: string;
  szunet: number;
  Kepurl: string;
  Kedvezmenyes_osszeg: string;
};

type OrderDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderDetails'>;
type OrderDetailsScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

// Dátum formázó függvény
const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}.`;
};

const OrderDetailsScreen = ({
  navigation,
  route,
}: {
  navigation: OrderDetailsScreenNavigationProp;
  route: OrderDetailsScreenRouteProp;
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const { orderId } = route.params;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Hiba', 'Nincs bejelentkezve');
          navigation.replace('Login');
          return;
        }

        const response = await axios.get(`http://localhost:3000/userorders/details/${orderId}`, {
          headers: {
            Authorization: token,
          },
        });
        setOrderDetails(response.data);
      } catch (error) {
        Alert.alert('Hiba', 'Nem sikerült lekérni a rendelés részleteit');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [navigation, orderId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Töltés...</Text>
      </View>
    );
  }

  const summary = orderDetails[0] || {};

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Rendelés részletei #{orderId}</Text>
      {orderDetails.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dátum: </Text>
            <Text style={styles.summaryValue}>{formatDate(summary.datum)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Állapot: </Text>
            <Text style={styles.summaryValue}>{summary.Statusz}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Szünet: </Text>
            <Text style={styles.summaryValue}>{summary.szunet}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Teljes ár: </Text>
            <Text style={styles.summaryValue}>{summary.Kedvezmenyes_osszeg} Ft</Text>
          </View>
        </View>
      )}
      {orderDetails.length === 0 ? (
        <Text style={styles.noDetails}>Nincsenek részletek ehhez a rendeléshez.</Text>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {orderDetails.map((item) => (
            <View key={item.cikkszam} style={styles.detailItem}>
              <Image
                source={{ uri: item.Kepurl }}
                style={styles.image}
                onError={() => Alert.alert('Hiba', `Nem sikerült betölteni a képet: ${item.Kepurl}`)}
              />
              <View style={styles.textContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Termék neve: </Text>
                  <Text style={styles.detailValue}>{item.termeknev}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kategória: </Text>
                  <Text style={styles.detailValue}>{item.kategoria}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Típus: </Text>
                  <Text style={styles.detailValue}>{item.tipus}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Cikkszám: </Text>
                  <Text style={styles.detailValue}>{item.cikkszam}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Egységár: </Text>
                  <Text style={styles.detailValue}>{item.egysegar} Ft</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Mennyiség: </Text>
                  <Text style={styles.detailValue}>{item.mennyiseg}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#252525',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#3a3a3a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0a500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252525',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  noDetails: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  detailItem: {
    flexDirection: 'row', // Kép balra, szöveg jobbra
    padding: 15,
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    marginBottom: 20, // Nagyobb hézag a kártyák között
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginRight: 15, // Hézag a kép és a szöveg között
    alignSelf: 'center'
  },
  textContainer: {
    flex: 1, // A szöveg kitölti a maradék helyet
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f0a500',
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
  },
});

export default OrderDetailsScreen;