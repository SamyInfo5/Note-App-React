import AsyncStorage from "@react-native-async-storage/async-storage";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Dispatch } from "redux";

interface Note {
    id: number;
    datetime: string;
    [key: string]: any;
}

interface NoteState {
    note: Array<Note>;
    filteredNotes: Array<Note> | null;
}

const initialState: NoteState = {
    note: [],
    filteredNotes: null,
};

type EditNotePayload = {
    id: number; 
    data: Partial<Note>; 
};

const NoteSlice = createSlice({
    name: "note",
    initialState,
    reducers: {
        setNotes: (state, action: PayloadAction<Array<Note>>) => {
            state.note = action.payload;
            state.filteredNotes = null;
        },
        addNote: (state, action: PayloadAction<object>) => {
            const newNote = {
                id: state.note.length > 0 ? state.note[state.note.length - 1].id + 1 : 1,
                datetime: new Date().toISOString(),
                ...action.payload,
            };
            state.note.push(newNote);
            AsyncStorage.setItem('notes', JSON.stringify(state.note));
        },
        clearFilter: (state) => {
            state.filteredNotes = null;
        },
        deleteNote: (state, action: PayloadAction<number>) => {
            state.note = state.note.filter(note => note.id !== action.payload);
            state.filteredNotes = state.note.filter(note => note.id !== action.payload);
            AsyncStorage.setItem('notes', JSON.stringify(state.note));
        },
        editNote: (state, action: PayloadAction<EditNotePayload>) => {
            const { id, data } = action.payload;
            const index = state.note.findIndex(note => note.id === Number(id));
            console.log({ ind: index })
            if (index !== -1) {
                state.note[index] = {
                    ...state.note[index],
                    ...data,
                    datetime: new Date().toISOString(),
                };
                AsyncStorage.setItem('notes', JSON.stringify(state.note));
            }
        },
        filterBySearch: (state, action: PayloadAction<string>) => {
            const searchQuery = action.payload.toLowerCase(); 
            state.filteredNotes = state.note.filter(note => 
                (note.title?.toLowerCase().includes(searchQuery) ||  
                note.content?.toLowerCase().includes(searchQuery))
            );
        },
        filterByDate: (state) => {
            state.filteredNotes = [...state.note].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
        },
    },
});

export const { setNotes, addNote, deleteNote, editNote, filterBySearch, filterByDate, clearFilter } = NoteSlice.actions;

export const initializeNotes = () => async (dispatch: Dispatch) => {
    try {
        const storedNotes = await AsyncStorage.getItem("notes");
        if (storedNotes) {
            dispatch(setNotes(JSON.parse(storedNotes)));
        }
    } catch (error) {
        console.error("Failed to load notes from AsyncStorage:", error);
    }
};

export default NoteSlice.reducer;
