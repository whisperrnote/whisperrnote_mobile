import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useNotes } from '@/contexts/NotesContext';
import type { NotesStatus } from '@/types/appwrite.d.ts';

export default function NewNoteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addNote } = useNotes();
  const router = useRouter();

  const handleCreate = async () => {
    try {
      setError('');
      if (!title.trim()) {
        setError('Title is required');
        return;
      }
      
      setLoading(true);
      
      const now = new Date().toISOString();
      const tagArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await addNote({
        title,
        content,
        tags: tagArray,
        status: 'draft' as NotesStatus,
        createdAt: now,
        updatedAt: now,
      });

      router.back();
    } catch (err: any) {
      setError(err?.message || 'Failed to create note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create New Note</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TextInput
          style={[styles.input, { fontSize: 18 }]}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
          editable={!loading}
        />

        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Write your note here..."
          value={content}
          onChangeText={setContent}
          placeholderTextColor="#999"
          multiline
          editable={!loading}
          textAlignVertical="top"
        />

        <TextInput
          style={styles.input}
          placeholder="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
          placeholderTextColor="#999"
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Note</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    fontSize: 14,
  },
});
