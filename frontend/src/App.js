import React, { useState, useMemo } from "react";
import Header from "./components/Header";
import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";
import Sidebar from "./components/Sidebar";

import "./App.css";

// Simple unique id for demo/local state
function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// PUBLIC_INTERFACE
function App() {
  /** Main application for Note Management. */
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered note list for search
  const filteredNotes = useMemo(
    () =>
      notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [notes, searchQuery]
  );

  const selectedNote =
    notes.find((note) => note.id === selectedNoteId) || null;

  // PUBLIC_INTERFACE
  function createNote(title, content) {
    const newNote = {
      id: generateId(),
      title,
      content,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  }

  // PUBLIC_INTERFACE
  function updateNote(id, title, content) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              title,
              content,
              updated: new Date().toISOString(),
            }
          : n
      )
    );
  }

  // PUBLIC_INTERFACE
  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedNoteId((prev) => (prev === id ? null : prev));
  }

  // PUBLIC_INTERFACE
  function selectNote(id) {
    setSelectedNoteId(id);
  }

  // PUBLIC_INTERFACE
  function handleSearch(q) {
    setSearchQuery(q);
  }

  return (
    <div className="main-app">
      <Header onSearch={handleSearch} />
      <div className="main-app-content">
        <Sidebar
          notes={filteredNotes}
          onSelect={selectNote}
          selectedNoteId={selectedNoteId}
        />
        <div className="main-app-center">
          <NoteEditor
            key={selectedNoteId}
            note={selectedNote}
            onSave={(title, content) => {
              selectedNote
                ? updateNote(selectedNote.id, title, content)
                : createNote(title, content);
            }}
            onDelete={() => selectedNote && deleteNote(selectedNote.id)}
            isEdit={!!selectedNote}
          />
          <NoteList
            notes={filteredNotes}
            onSelect={selectNote}
            selectedNoteId={selectedNoteId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
