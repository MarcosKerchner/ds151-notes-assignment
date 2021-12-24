import React, { useEffect, useState, useContext } from 'react';
import Platform from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, Alert } from 'react-native';
import { Input } from 'react-native-elements/dist/input/Input';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { InputAccessoryView } from 'react-native-web';
import api from '../components/api';

async function processAdicionar(title) {
  await api.post('categories', { 
    title 
  })
}

function HomeScreen({navigation}) {
  const [list, setList] = useState([]); 
  const [title, setTitle] = useState('');
  const [reloadLista, setDoReloadList] = useState(false);

  

  async function getCategories() {
    const response = await api.get('/categories');
    setList(response.data);
    setTitle('');
  }

  async function deleteCategory(category) {
    const response = await api.delete('categories/' + category.id).then((response) => {
      alertMessage('OK', 'Sucesso ao deletar Categoria');
      setDoReloadList(!reloadLista);
    }).catch((err) => {
      alertMessage('Erro', 'Erro ao deletar Categoria \n' + err);    
    });
  }
  function Adicionar(text) {
    if (text) {  
      processAdicionar(text).then(
        setDoReloadList(!reloadLista)
      )
    }
  }

  useEffect(() => {
    console.log('reloaded');
    setList(getCategories());
  }, [reloadLista]);
  
  return (
      <View style={styles.container}>
        <Input
          style={styles.input}
          type="text"
          placeholder="Nova Categoria"
          value={title}
          editable={true}
          onChangeText={(title) => setTitle(title)}
          onEndEditing={() => Adicionar(title)}
        />
        <Button title='Adicionar' style={styles.button} onPress={() => Adicionar(title)} />
        
        <FlatList  
            data={list}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              return(
                <View style={styles.bloco}>
                  <TouchableOpacity onPress={() => navigation.navigate("TaskList", {categoryId: item.id})}>
                    <Text style={styles.info}>{item.title}</Text> 
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => questDeleteCategory(item)}>
                    <Image source={require('../../images/trashIcon.png')} style={styles.icon}/>
                  </TouchableOpacity>
                </View>
              ) 
            }}
        />
      </View>
  );

  function questDeleteCategory(category) {
    if (isMobile()) {  
      Alert.alert(
          "Delete",
          "Deseja deletar o professor " + category.title + "?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => deleteCategory(category) }
          ],
          {cancelable: true}
      );
    } else {
      deleteCategory(category);
    }
  }
}

function isMobile() {
  return(Platform.OS === 'android' || Platform.OS === 'ios');
}

function alertMessage(title,message) {
  if (isMobile()) {  
    Alert.alert(
        title,
        message,
        [
          { text: "OK", onPress: () => "" }
        ],
        {cancelable: true}
    );
  }
}


export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center'
  },
  bloco: { 
    alignItems: 'baseline', 
    justifyContent: 'space-evenly',
    margin: 10,
    flexDirection: 'row',
    maxWidth: "80%",
    width: 100
  },
  button: {
    paddingHorizontal: 10
  },
  input: {
    alignSelf: 'center',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "50%",
    maxWidth: 400,
    minWidth: 70
  },
  icon: {
    width: 16,
    height: 16,   
    margin: 5,
  },
  info: {
    fontSize: 16,
    color: 'black',
    marginTop: 15,
  },
});