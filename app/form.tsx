import { StyleSheet, View } from 'react-native';
import NoteForm from '@/components/NoteForm';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { useRouter, useLocalSearchParams } from 'expo-router';

type editdata = {
    ItemId?: number;
    [key: string]: any;
};

export default function Form() {
    const params = useLocalSearchParams();
    return (
        <Provider store={store}>
            <View>
                <NoteForm editdata={params} />
            </View>
        </Provider>
    )
}

const styles = StyleSheet.create({});
