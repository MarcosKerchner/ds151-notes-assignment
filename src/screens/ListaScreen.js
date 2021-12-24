import React, { useEffect, useState } from 'react';
import Platform from 'react';
import { View, Text, StyleSheet, Button, FlatList, Image, Alert } from 'react-native';
import { Input } from 'react-native-elements/dist/input/Input';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../components/api';

async function processAdicionar(title, categoryId) {
    await api.post('tasks', { 
        categoryId,
        title
    });
}

function ListaScreen({route, navigation}) {
    const {categoryId} = route.params;
    const [list, setList] = useState([]); 
    const [title, setTitle] = useState('');
    const [reloadLista, setDoReloadList] = useState(false);

    async function getCategories() {
        const url = '/tasks?categoryId=' + categoryId;
        console.log('url:' + url);
        const response = await api.get(url);
        setList(response.data);
        setTitle('');
    }

    async function questDeleteTask(task) {
        const response = await api.delete('tasks/' + task.id).then(() => {
            alertMessage('OK', 'Sucesso ao deletar Item');
            setDoReloadList(!reloadLista);
        }).catch((err) => {
            alertMessage('Erro', 'Erro ao deletar Item \n' + err);    
        });
    }

    function Adicionar(text) {
        if (text) {  
            processAdicionar(text, categoryId).then(
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
                placeholder="Novo Item"
                value={title}
                editable={true}
                onChangeText={(title) => setTitle(title)}
                onEndEditing={() => processAdicionar(title)}
            />
            <Button title='Adicionar' onPress={() => Adicionar(title) } />
            
            <FlatList  
                data={list}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    return(
                        <View style={styles.bloco}>
                            <Text style={styles.info}>{item.title}</Text> 
                            <TouchableOpacity onPress={() => questDeleteTask(item)}>
                                <Image source={require('../../images/trashIcon.png')} style={styles.icon}/>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </View>
    );
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

export default ListaScreen;
