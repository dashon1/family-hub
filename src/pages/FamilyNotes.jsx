
import React, { useState, useEffect } from 'react';
import { Note, User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Pin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

import NoteForm from '../components/notes/NoteForm';
import NoteCard from '../components/notes/NoteCard';
import NoteCategoryFilter from '../components/notes/NoteCategoryFilter';
import PasscodeProtection from '../components/shared/PasscodeProtection';

export default function FamilyNotes() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [needsPasscode, setNeedsPasscode] = useState(false);

  useEffect(() => {
    loadNotes();
    loadUser();
  }, []);

  useEffect(() => {
    // Check if selected category requires passcode
    if (user?.protected_categories && user.protected_categories.includes(selectedCategory)) {
      setNeedsPasscode(true);
    } else {
      setNeedsPasscode(false);
    }
  }, [selectedCategory, user]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadNotes = async () => {
    const fetchedNotes = await Note.list('-updated_date');
    setNotes(fetchedNotes);
  };

  const handleNoteSubmit = async (noteData) => {
    if (editingNote) {
      await Note.update(editingNote.id, noteData);
    } else {
      await Note.create({
        ...noteData,
        household_id: user?.household_id
      });
    }
    setShowForm(false);
    setEditingNote(null);
    loadNotes();
  };

  const handleTogglePin = async (note) => {
    await Note.update(note.id, { ...note, pinned: !note.pinned });
    loadNotes();
  };

  const handleDeleteNote = async (noteId) => {
    await Note.delete(noteId);
    loadNotes();
  };

  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

  const renderNotesSection = () => {
    if (pinnedNotes.length > 0) {
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Pin className="w-5 h-5" />
            Pinned Notes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {pinnedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => {
                    setEditingNote(note);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderUnpinnedNotes = () => {
    if (unpinnedNotes.length === 0 && pinnedNotes.length === 0) {
      return (
        <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No notes yet</h3>
            <p className="text-gray-500">Create your first note to get started!</p>
          </CardContent>
        </Card>
      );
    }

    if (unpinnedNotes.length === 0 && pinnedNotes.length > 0) return null; // If only pinned notes exist, no unpinned section to render

    return (
      <div className="space-y-4">
        {pinnedNotes.length > 0 && (
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            All Notes
          </h2>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {unpinnedNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={() => {
                  setEditingNote(note);
                  setShowForm(true);
                }}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Family Notes
            </h1>
            <p className="text-gray-600 mt-2">Store important family information in one place</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Note
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <NoteCategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            notes={notes}
          />
        </div>

        {needsPasscode ? (
          <PasscodeProtection 
            title={`Protected: ${selectedCategory.replace('_', ' ')}`}
          >
            {renderNotesSection()}
            {renderUnpinnedNotes()}
          </PasscodeProtection>
        ) : (
          <>
            {renderNotesSection()}
            {renderUnpinnedNotes()}
          </>
        )}

        <AnimatePresence>
          {showForm && (
            <NoteForm
              note={editingNote}
              onSubmit={handleNoteSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingNote(null);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
