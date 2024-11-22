import { Link, router } from 'expo-router';
import { useState} from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface user{
    id: number,
    name: string,
    password: string,    
    email: string
}
export default function Index() {
    const [email, setEmail] = useState('');
    const [password, setSenha] = useState('');
  
    const handleLogin = async () => {
        if (email.length === 0 || password.length === 0) {
            alert("Email ou senha vazios!");
            return;
        }        
        try{
            const response = await fetch("http://localhost:3000/auth/signin", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password,
                    email: email
                })
            });
            
            const result = await response.json();
            const token = result.token            
            // console.log("token:")
            // console.log(token)
            saveToken(token, result.user)
            if(result.status === 200)
                router.push("/(tabs)")
            else{
                alert("Usuário não encontrado")
            }
        }catch(error){
            alert(error)
            console.log(error)
        }
        const tokenRecover = getToken();
        console.log(tokenRecover)
    };

async function saveToken(token: string, user: user) {
    try {
        if (Platform.OS === 'web') {
          // Salva no localStorage para aplicações web
          localStorage.setItem('tokenAutenticacao', token);    
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          // Salva no SecureStore para dispositivos móveis
          await SecureStore.setItemAsync('tokenAutenticacao', token);
          await SecureStore.setItemAsync('user', JSON.stringify(user));
        }
        console.log('Token salvo com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar o token:', error);
      }
}

async function getToken(): Promise<string | null>  {
    try {
        if (Platform.OS === 'web') {
          // Recupera do localStorage para aplicações web
          return localStorage.getItem('tokenAutenticacao');
        } else {
          // Recupera do SecureStore para dispositivos móveis
          return await SecureStore.getItemAsync('tokenAutenticacao');
        }
      } catch (error) {
        console.error('Erro ao obter o token:', error);
        return null;
      }
  }
  async function deleteToken() {
    try {
      await SecureStore.deleteItemAsync('tokenAutenticacao');
      await SecureStore.deleteItemAsync('user');
      await localStorage.deleteItemAsync('tokenAutenticacao');
      await localStorage.deleteItemAsync('user');
      console.log('Token removido com sucesso!');
    } catch (error) {
     console.error('Erro ao remover o token:', error);
    }
  }
  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setSenha}
            />

            <Link href="/createAccount" style={styles.createAccount}>
                Criar conta
            </Link>
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    createAccount:{
        marginTop: -10,
        marginLeft: 4,
        marginBottom: 10,
        fontSize: 15,
        textDecorationLine: 'underline',
        color: 'black',
    },
    button: {
        height: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    createAccountText: {
        marginTop: 20,
        color: '#007BFF',
        textAlign: 'center',
        fontSize: 16,
    },
});