import React from 'react';

const Note = ({ id, text, editHandler, deleteHandler, saveHandler }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", text);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => {
      e.preventDefault();
  };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newText = e.dataTransfer.getData("text/plain");
        
        editHandler(id, text + '\n' + newText);
    };

    return (
        <div
            className="note"
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="note-content" id={id}>
                <p>{text? text: "Default"}</p>
            </div>
            <div className="note-actions">
                <button className="edit" onClick={() => editHandler(id, text)}>Edit</button>
                <button className="delete" onClick={() => deleteHandler(id)}>Delete</button>
            </div>

        </div>
    );
};

export default Note;
