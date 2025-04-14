import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert,Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';

// Navigációs stack típusdefiníciója
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

// Navigation prop típusának meghatározása
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
  const [nev, setNev] = useState('');
  const [jelszo, setJelszo] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        Nev: nev,
        Jelszo: jelszo,
      });
      const { token } = response.data;
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Hiba', 'Hibás név vagy jelszó');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Bejelentkezés</Text>
        <TextInput
          style={styles.input}
          placeholder="Név"
          placeholderTextColor="#073865"
          value={nev}
          onChangeText={setNev}
        />
        <TextInput
          style={styles.input}
          placeholder="Jelszó"
          placeholderTextColor="#073865"
          value={jelszo}
          onChangeText={setJelszo}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button 
            title="Bejelentkezés" 
            onPress={handleLogin} 
            color="#dd7a00"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
  },
  container: {
    width: '85%', 
    paddingTop:50,
    paddingRight:20,
    paddingLeft:20,
    backgroundColor: 'black', 
    borderRadius: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10, 
    paddingBottom:50
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color:"#dd7a00", 
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#073865', 
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5', 
    color: 'black', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#dd7a00', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default LoginScreen;