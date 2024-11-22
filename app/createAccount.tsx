import React, { useState } from 'react';
import Link from 'expo-router';
import { router } from 'expo-router';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const CreateAccount: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleCreateAccount = async () => {
        if (name.length === 0 || email.length === 0 || password.length === 0) {
            window.alert("Todos os campos são obrigatórios!");
            Alert.alert("Todos os campos são obrigatórios!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const result = await response.json();
            console.log("Retorno do servidor: ");
            console.log(result);

            if (result.status == 200) {
                window.alert("Conta criada com sucesso!");
                Alert.alert("Conta criada com sucesso!");
                router.push("/(tabs)");
            } else {
                window.alert("Erro ao criar conta!");                
                Alert.alert("Erro ao criar conta");
            }
        } catch (error) {
            window.alert("Erro ao criar conta!");
            console.error(error);
            Alert.alert("Erro", "Ocorreu um erro ao criar a conta.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar Conta</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />

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
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                <Text style={styles.buttonText}>Criar Conta</Text>
            </TouchableOpacity>
        </View>
    );
};

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
        marginBottom: 20,
        backgroundColor: '#fff',
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
});

export default CreateAccount;