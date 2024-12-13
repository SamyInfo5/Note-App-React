import { RootState } from '@/store';
import { StyleSheet,View, FlatList, Text, Button, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNote, filterBySearch, initializeNotes, clearFilter, filterByDate  } from '@/state/noteSlice';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useState, useEffect } from 'react';

type RootStackParamList = {
    form: { ItemId: number, ItemTitle: string, ItemContent: string,  audioUri: string};
};

export default function NoteList() {

    const dispatch = useDispatch()
    const notes = useSelector((state: RootState) => state.note.note)
    const filteredNotes = useSelector((state: RootState) => state.note.filteredNotes);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(initializeNotes())
    }, [dispatch])

    

    type ItemProps = {
        id: number,
        title: string,
        content : string
        audioUri: string
    }

    const Item = ({id, title, content, audioUri}: ItemProps) => (
        <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.content}>{content}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button  title='✍🏼' onPress={() => navigation.navigate('form', { ItemId: id, ItemContent: content, ItemTitle: title, audioUri: audioUri }) }/>
                <Button title='🗑️' onPress={() => dispatch(deleteNote(id))}/>
            </View>
        </View>
    );

    const handleSearch = (query: string) => {
        setSearch(query);
        if (query.trim() === "") {
            dispatch(clearFilter());
        } else {
            dispatch(filterBySearch(query));
        }
    };

    const handleFilterByDate = () => {
        dispatch(filterByDate());
    };

    const dataToRender = filteredNotes ?? notes

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search notes"
                value={search}
                onChangeText={handleSearch}
            />
            <Button title="Trier par date" onPress={handleFilterByDate} />
            <FlatList
                data={dataToRender}
                renderItem={({item}) => <Item id={item.id} title={item.title} content={item.content}/>}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        height: '100%',
    },
    searchInput: {
        height: 50,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginVertical: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    content: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
