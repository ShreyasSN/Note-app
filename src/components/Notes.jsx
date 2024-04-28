import React, { useEffect, useState } from 'react';
import CreateNote from './CreateNote';
import './notes.css';
import { v4 as uuid } from 'uuid';
import Note from './Note';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Notes = () => {
    const [inputText, setInputText] = useState('');
    const [notes, setNotes] = useState([
        { id: uuid(), text: "Default note 1" },
        { id: uuid(), text: "Default note 2" }
    ]);
    const [editToggle, setEditToggle] = useState(null);

    const editHandler = (id, text) => {
        setEditToggle(id);
        setInputText(text);
    };

    const saveHandler = () => {
        if (editToggle) {
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === editToggle ? { ...note, text: inputText } : note
                )
            );
        } else {
            setNotes((prevNotes) => [
                ...prevNotes,
                {
                    id: uuid(),
                    text: inputText,
                },
            ]);
        }

        setInputText('');
        setEditToggle(null);
    };

    const deleteHandler = (id) => {
        const newNotes = notes.filter((n) => n.id !== id);
        setNotes(newNotes);
    };


    const handleDoubleClick = (newText = 'New data: ') => {
        setNotes((prevNotes) => [
            ...prevNotes,
            {
                id: uuid(),
                text: newText,
            },
        ]);
    };
    

    const handleDragOverNew = (e) => {
        e.preventDefault();
    };


    const handleDropNew = (e) => {
        e.preventDefault();
        const newText = e.dataTransfer.getData("text/plain");
        
        handleDoubleClick(newText);
    };

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('Notes'));
        if (data && Array.isArray(data) && data.length > 0) {
            setNotes(data);
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem('Notes', JSON.stringify(notes.map(({ id, text }) => ({ id, text }))));
    }, [notes]);
    
    
    
    const generateXLSX = () => {
        const dataToExport = notes.map(note => {
            const noteElement = document.getElementById(note.id);
            if (!noteElement) {
                console.log(note.text, ", error here.");
                return null;
            } // Handle cases where the note element is not found
            const rect = noteElement.getBoundingClientRect();
            return {
                'Note Text': note.text,
                'Distance from Top': rect.top,
                'Distance from Left': rect.left,
                'Distance from Top-Left Corner': Math.sqrt(rect.top * rect.top + rect.left * rect.left)
            };
        }).filter(Boolean); // Remove null values
    
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Notes');
        const blob = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([blob]), 'notes.xlsx');
    };
    
    
    

    return (
        <div>
            <div 
                className="notes" 
                onDoubleClick={() => handleDoubleClick()}
                draggable
                onDragOver={handleDragOverNew}
                onDrop={handleDropNew}
            >
                {notes.map((note) =>
                    editToggle === note.id ? (
                        <CreateNote
                            key={note.id}
                            inputText={inputText}
                            setInputText={setInputText}
                            saveHandler={saveHandler}
                        />
                    ) : (
                        <Note
                            key={note.id}
                            id={note.id}
                            text={note.text}
                            editHandler={editHandler}
                            deleteHandler={deleteHandler}
                            saveHandler={saveHandler}
                        />
                    )
                )}
            </div>
            <div className='export'>
                <button onClick={generateXLSX} className='button-9' role='button'>Export Notes</button>

                
            </div>
            
        </div>

    );
};

export default Notes
