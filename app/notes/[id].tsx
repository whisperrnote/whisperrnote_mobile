import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNotes } from '@/contexts/NotesContext';
import { listNoteComments, createComment } from '@/lib/appwrite/comments';
import type { Comments } from '@/types/appwrite';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentNote, fetchNote, updateCurrentNote, removeNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadNoteData();
    }
  }, [id]);

  const loadNoteData = async () => {
    try {
      setLoading(true);
      await fetchNote(id as string);
      const noteComments = await listNoteComments(id as string);
      setComments(noteComments.documents);
    } catch (error) {
      console.error('Failed to load note:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setTags(currentNote.tags?.join(', ') || '');
    }
  }, [currentNote]);

  const handleSave = async () => {
    try {
      const tagArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await updateCurrentNote(id as string, {
        title,
        content,
        tags: tagArray,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await removeNote(id as string);
            router.back();
          } catch (error) {
            console.error('Failed to delete note:', error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await createComment(id as string, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!currentNote) {
    return (
      <View style={styles.centerContainer}>
        <Text>Note not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
            />
            <TextInput
              style={[styles.contentInput, styles.editContentInput]}
              value={content}
              onChangeText={setContent}
              placeholder="Content"
              multiline
              textAlignVertical="top"
            />
            <TextInput
              style={styles.tagsInput}
              value={tags}
              onChangeText={setTags}
              placeholder="Tags (comma separated)"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>{title}</Text>
            {tags && (
              <View style={styles.tagContainer}>
                {tags.split(',').map((tag, i) => (
                  <Text key={i} style={styles.tag}>{tag.trim()}</Text>
                ))}
              </View>
            )}
            <Text style={styles.content}>{content}</Text>
          </>
        )}
      </View>

      <View style={styles.commentsSection}>
        <Text style={styles.commentsSectionTitle}>Comments</Text>

        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Add a comment..."
            multiline
          />
          <TouchableOpacity
            style={styles.commentButton}
            onPress={handleAddComment}
            disabled={!commentText.trim()}
          >
            <Text style={styles.commentButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {comments.map(comment => (
          <View key={comment.$id} style={styles.comment}>
            <Text style={styles.commentContent}>{comment.content}</Text>
            <Text style={styles.commentDate}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  editButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  contentInput: {
    fontSize: 16,
    marginBottom: 10,
  },
  editContentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    height: 150,
    textAlignVertical: 'top',
  },
  tagsInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentsSection: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  addCommentContainer: {
    marginBottom: 15,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    height: 60,
    textAlignVertical: 'top',
  },
  commentButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  comment: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  commentContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
});
