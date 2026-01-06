import React, { useState } from 'react';

const NotesFeature = () => {
    const [notes, setNotes] = useState([
        { id: 1, title: 'Personal Study - John 1', content: 'Focus on the "Logos" concept and its relation to creation.', date: '2026-01-06' },
        { id: 2, title: 'Sermon Points', content: 'The baptism of Jesus as a fulfillment of all righteousness.', date: '2026-01-05' }
    ]);

    return (
        <div className="notes-feature">
            <div className="notes-header">
                <h3>Your Study Journal</h3>
                <button className="new-note-btn">+ New Entry</button>
            </div>
            <div className="notes-list">
                {notes.map(note => (
                    <div key={note.id} className="note-card">
                        <div className="note-card-header">
                            <h4>{note.title}</h4>
                            <span className="note-date">{note.date}</span>
                        </div>
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesFeature;
