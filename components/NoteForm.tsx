import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { addNote, editNote } from '@/state/noteSlice';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

type EditData = {
    ItemId?: number;
    [key: string]: any; 
};

type NoteFormProps = {
    editdata: EditData;
};

export default function NoteForm({ editdata }: NoteFormProps) {
    const dispatch = useDispatch();
    const { ItemId, ItemContent, ItemTitle } = editdata
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [recording, setRecording] = useState(null);
    const [recordingStatus, setRecordingStatus] = useState('');
    const [audioPermission, setAudioPermission] = useState();

    useEffect(() => {
        if(ItemId != undefined) {
            setTitle(ItemTitle)
            setContent(ItemContent)
        }
    },[])

    const handleSaveNote = () => {
            if (title.trim() === '' || content.trim() === '') {
                alert('Veuillez remplir tous les champs.');
                return;
            }
            if(!ItemId) {
                dispatch(addNote({ title, content }));
                setTitle('');
                setContent('');
            } else {
                dispatch(editNote({ id: ItemId, data: { title, content } }));
            }
    };

    const startRec = async () => {
        const perm = await Audio.requestPermissionsAsync();
        if(perm.status === "granted"){
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true
            });
            const newRecording = new Audio.Recording();
            console.log('Start Rec')
            await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
            await newRecording.startAsync()
            setRecording(newRecording);
            setRecordingStatus('recording')
        }
    }
    const stopRec = async () => {
        if(recordingStatus === 'recording') {
            console.log('stop rec')
            await recording.stopAndUnloadAsync()
            const recordingUri = recording.getURI();

            const fileName = `recording-${Date.now()}.caf`
            await FileSystem.makeDirectoryAsync(
                FileSystem.documentDirectory + 'recordings/', { intermediates: true }
            );
            await FileSystem.moveAsync({
                from: recordingUri,
                to: FileSystem.documentDirectory + 'recordings/' + `${fileName}`
              });
        }
    }
    const getDurationFormatted = (ms: number) => {}
    const getRecordingLines = () => {}
    const clearRecordings = () => {}

    return (
        <View style={styles.boxContainer}>
            <TextInput 
                style={styles.input} 
                placeholder="Title" 
                value={title} 
                onChangeText={setTitle} 
            />
            <TextInput 
                style={[styles.input, styles.textArea]} 
                placeholder="Content" 
                value={content} 
                onChangeText={setContent} 
                multiline 
            />
            <Button title={recording ? 'Stop Recording' : 'Start Recording'} onPress={recording ? stopRec : startRec}/>
            <Button title="Save Note" onPress={handleSaveNote} />
        </View>
    );
}

const styles = StyleSheet.create({
    boxContainer: {
        width: '100%',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
});
