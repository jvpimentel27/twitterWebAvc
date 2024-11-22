import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import getToken  from './index';
import { router } from 'expo-router';

export default function AddPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [authorId, setAuthor] = useState('');

  const handlePostSubmit = async () => {
    let token
    let user 
    try {
      // mudando o local de salvamento com base na plataforma do usuário
      if(Platform.OS == "web"){
        token = await localStorage.getItem('tokenAutenticacao');
        user = JSON.parse(localStorage.getItem('user')??"")
      }
      else{
        token = SecureStore.getItem("tokenAutenticacao");
        user = JSON.parse(SecureStore.getItem("user")??"");
      }

      const response = await fetch('http://localhost:3000/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          authorId: user.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar post');
      }
  
      const post = await response.json();
      alert("Post criado com sucesso!");
      router.push("/");
      console.log('Post criado com sucesso:', post);
            
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Conteúdo"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Enviar Post" onPress={handlePostSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
});
