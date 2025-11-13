import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getTags } from '@/lib/appwrite/tags';
import { useAuth } from '@/contexts/AuthContext';
import type { Tags } from '@/types/appwrite';

export default function TagsScreen() {
  const { user, loading: authLoading } = useAuth();
  const [tags, setTags] = useState<Tags[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTags();
    }
  }, [user, authLoading]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const result = await getTags();
      setTags(result);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text>Please log in</Text>
      </View>
    );
  }

  const renderTag = ({ item }: any) => (
    <View style={styles.tagItem}>
      <Text style={styles.tagName}>{item.name}</Text>
      <Text style={styles.tagCount}>{item.usageCount || 0} notes</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && tags.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : tags.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tags yet</Text>
        </View>
      ) : (
        <FlatList
          data={tags}
          renderItem={renderTag}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={styles.listContent}
          numColumns={2}
        />
      )}
    </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  listContent: {
    padding: 10,
  },
  tagItem: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    margin: 5,
    justifyContent: 'center',
  },
  tagName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagCount: {
    fontSize: 12,
    color: '#666',
  },
});
