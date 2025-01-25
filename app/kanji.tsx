import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { parseCSV } from '../utils/csvParser';
import { n5Data } from '../assets/data/kanji/n5';
import { n4Data } from '../assets/data/kanji/n4';
import { n3Data } from '../assets/data/kanji/n3';
import { n2Data } from '../assets/data/kanji/n2';
import { n1Data } from '../assets/data/kanji/n1';

type KanjiItem = {
  kanji: string;
  reading: string;
  meaning: string;
};

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

export default function KanjiScreen() {
  const [selectedLevel, setSelectedLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [kanjiList, setKanjiList] = useState<KanjiItem[]>([]);

  useEffect(() => {
    loadKanjiData();
  }, [selectedLevel]);

  const loadKanjiData = () => {
    try {
      let csvText;
      switch (selectedLevel) {
        case 'N5':
          csvText = n5Data;
          break;
        case 'N4':
          csvText = n4Data;
          break;
        case 'N3':
          csvText = n3Data;
          break;
        case 'N2':
          csvText = n2Data;
          break;
        case 'N1':
          csvText = n1Data;
          break;
      }

      const records = parseCSV(csvText, ';');
      
      // Skip header row
      const parsedKanji = records.slice(1).map(row => ({
        kanji: row[0],
        reading: row[1],
        meaning: row[2]
      }));

      setKanjiList(parsedKanji);
    } catch (error) {
      console.error('Error loading kanji data:', error);
    }
  };

  const renderKanjiItem = ({ item }: { item: KanjiItem }) => (
    <TouchableOpacity style={styles.kanjiItem}>
      <Text style={styles.kanjiText}>{item.kanji}</Text>
      <Text style={styles.readingText}>{item.reading}</Text>
      <Text style={styles.meaningText}>{item.meaning}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Belajar Kanji' }} />
      
      <View style={styles.levelContainer}>
        {JLPT_LEVELS.map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.levelButton, selectedLevel === level && styles.selectedLevel]}
            onPress={() => setSelectedLevel(level)}
          >
            <Text style={[styles.levelText, selectedLevel === level && styles.selectedLevelText]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={kanjiList}
        renderItem={renderKanjiItem}
        keyExtractor={(item) => `${item.kanji}-${item.reading}`}
        numColumns={3}
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
  levelContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  selectedLevel: {
    backgroundColor: '#007AFF',
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedLevelText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  kanjiItem: {
    flex: 1,
    margin: 4,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  kanjiText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  readingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
    textAlign: 'center',
  },
  meaningText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
