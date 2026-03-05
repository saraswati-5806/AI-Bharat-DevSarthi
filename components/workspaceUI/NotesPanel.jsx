// components/panels/NotesPanel.jsx
'use client'
import { useState } from 'react'
import { FileText, Save, Download, Trash2 } from 'lucide-react'

export default function NotesPanel() {
  const [notes, setNotes] = useState('')
  const [savedNotes, setSavedNotes] = useState([])
  const [noteTitle, setNoteTitle] = useState('')

  const saveNote = () => {
    if (!notes.trim()) return
    
    const newNote = {
      id: Date.now(),
      title: noteTitle || `Note ${savedNotes.length + 1}`,
      content: notes,
      timestamp: new Date().toLocaleString()
    }
    
    setSavedNotes(prev => [newNote, ...prev])
    setNotes('')
    setNoteTitle('')
  }

  const deleteNote = (id) => {
    setSavedNotes(prev => prev.filter(note => note.id !== id))
  }

  const downloadNote = (note) => {
    const blob = new Blob([note.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${note.title}.txt`
    a.click()
  }

  return (
    <div className="h-full flex flex-col card overflow-hidden">
      {/* Header */}
      <div className="p-4 flex-shrink-0" style={{borderBottom: '1px solid var(--border-light)'}}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold" style={{color: 'var(--text-dark)'}}>Notes</h3>
            <div className="text-xs" style={{color: 'var(--text-secondary)'}}>
              {savedNotes.length} saved
            </div>
          </div>
        </div>
      </div>

      {/* Note Title */}
      <div className="p-4 flex-shrink-0" style={{background: 'var(--bg-canvas)'}}>
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Note title (optional)..."
          className="w-full px-3 py-2 text-sm rounded-lg mb-2"
          style={{
            background: 'white',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)'
          }}
        />
      </div>

      {/* Note Editor */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start taking notes..."
          className="flex-1 p-3 rounded-lg resize-none text-sm"
          style={{
            background: 'white',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
            lineHeight: '1.6'
          }}
        />
        
        <button
          onClick={saveNote}
          disabled={!notes.trim()}
          className="btn-success mt-3 w-full py-2 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Note
        </button>
      </div>

      {/* Saved Notes */}
      {savedNotes.length > 0 && (
        <div 
          className="flex-shrink-0 overflow-y-auto"
          style={{
            maxHeight: '40%',
            borderTop: '1px solid var(--border-light)'
          }}
        >
          <div className="p-3">
            <div className="text-xs font-bold mb-2" style={{color: 'var(--text-secondary)'}}>
              Saved Notes
            </div>
            <div className="space-y-2">
              {savedNotes.map(note => (
                <div 
                  key={note.id}
                  className="p-3 rounded-lg"
                  style={{background: 'var(--bg-canvas)'}}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-medium text-sm" style={{color: 'var(--text-dark)'}}>
                      {note.title}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => downloadNote(note)}
                        className="p-1 rounded hover:bg-gray-200 transition"
                        title="Download"
                      >
                        <Download className="w-3 h-3" style={{color: 'var(--text-secondary)'}} />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 rounded hover:bg-red-100 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs mb-1" style={{color: 'var(--text-secondary)'}}>
                    {note.content.substring(0, 80)}...
                  </div>
                  <div className="text-xs" style={{color: 'var(--text-tertiary)'}}>
                    {note.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}