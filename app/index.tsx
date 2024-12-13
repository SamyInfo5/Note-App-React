import { TextInput, StyleSheet, View } from 'react-native';
import NoteList from '@/components/NoteList';
import { Provider } from 'react-redux';
import { store } from '@/store'

export default function HomeScreen() {
  return (
    <Provider store={store}>
      <View>
        <NoteList/>
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({});
