import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Platform, Button, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Post {
  id: number;
  authorId: number;
  title: string;
  content: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch("http://localhost:3000/posts");
    if (!response.ok) throw new Error("Erro ao buscar os posts");
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }
};

const fetchUserName = async (userId: number, token: string): Promise<string> => {
  
  try {
    const response = await fetch(`http://localhost:3000/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token??"",
      },
    });
    if (!response.ok) throw new Error("Erro ao buscar o autor");
    const user: User = await response.json();
    return user.name;
  } catch (error) {
    console.error("Erro ao obter o nome do autor:", error);
    return "Autor não conhecido";
  }
};

export default function Index() {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [authorNames, setAuthorNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchData = async () => {
          const response = await fetch('https://api.example.com/user');
          const data = await response.json();
          setUserData(data);
        };    
        const posts = await fetchPosts();
        setPosts(posts);

        const token = Platform.OS === 'web' ? await sessionStorage.getItem('tokenAutenticacao') : await SecureStore.getItemAsync('tokenAutenticacao');
        const authorMap: { 
          [key: string]: string }= {};

        // Obtenha todos os autores simultaneamente
        await Promise.all(posts.map(async (post) => {
          if (!authorMap[post.authorId]) {
            const authorName = await fetchUserName(post.authorId, token || '');
            authorMap[post.authorId] = authorName;
          }
        }));

        setAuthorNames(authorMap);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);  
  const handleDeletePost = async (postId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {        
        alert('Post deletado com sucesso');
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        const errorResponse = await response.json();
        Alert.alert('Erro', errorResponse.message || 'Erro ao deletar o post.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar deletar o post.');
    }
  };
  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Text style={styles.username}>{authorNames[item.authorId] || "Carregando..."}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePost(item.id)}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
    </View>
  );

  function handleCommentNav(){
    router.push("/post")
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleCommentNav}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  postContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'Roboto_500Medium',
  },
  content: {
    color: '#555',
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  deleteButton: {
    marginLeft: 'auto',
    backgroundColor: '#ff5252',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  
});
