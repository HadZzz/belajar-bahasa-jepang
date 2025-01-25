import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { parseCSV } from '../utils/csvParser';
import { basicData } from '../assets/data/kosakata/basic';
import { foodData } from '../assets/data/kosakata/food';

type VocabItem = {
  kosakata: string;
  reading: string;
  meaning: string;
};

type Category = 'basic' | 'food';

const CATEGORIES = ['basic', 'food'];

export default function VocabularyScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('basic');
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);

  useEffect(() => {
    loadVocabData();
  }, [selectedCategory]);

  const loadVocabData = () => {
    try {
      const csvText = selectedCategory === 'basic' ? basicData : foodData;
      const records = parseCSV(csvText, ';');
      
      // Skip header row
      const parsedVocab = records.slice(1).map(row => ({
        kosakata: row[0],
        reading: row[1],
        meaning: row[2]
      }));

      setVocabList(parsedVocab);
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    }
  };

  const renderVocabItem = ({ item, index }: { item: VocabItem, index: number }) => (
    <TouchableOpacity style={styles.vocabItem}>
      <Text style={styles.vocabText}>{item.kosakata}</Text>
      <Text style={styles.readingText}>{item.reading}</Text>
      <Text style={styles.meaningText} numberOfLines={2}>{item.meaning}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Kosakata' }} />
      
      <View style={styles.categoryContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category as Category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>
              {category === 'basic' ? 'Dasar' : 'Makanan'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={vocabList}
        renderItem={renderVocabItem}
        keyExtractor={(item, index) => `${item.kosakata}-${item.reading}-${index}`}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  vocabItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  vocabText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  readingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: '#999',
  },
});
