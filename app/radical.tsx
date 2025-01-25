import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { parseCSV } from '../utils/csvParser';
import { radicalsData } from '../assets/data/radikal/radicals';

type RadicalItem = {
  radical: string;
  reading: string;
  meaning: string;
  strokeCount: string;
  examples: string;
};

export default function RadicalScreen() {
  const [radicalList, setRadicalList] = useState<RadicalItem[]>([]);
  const [selectedStrokeCount, setSelectedStrokeCount] = useState<number | null>(null);

  useEffect(() => {
    loadRadicalData();
  }, []);

  const loadRadicalData = () => {
    try {
      const records = parseCSV(radicalsData, ';');
      
      // Skip header row
      const parsedRadicals = records.slice(1).map(row => ({
        radical: row[0],
        reading: row[1],
        meaning: row[2],
        strokeCount: row[3],
        examples: row[4]
      }));

      setRadicalList(parsedRadicals);
    } catch (error) {
      console.error('Error loading radical data:', error);
    }
  };

  const filteredRadicals = selectedStrokeCount
    ? radicalList.filter(item => parseInt(item.strokeCount) === selectedStrokeCount)
    : radicalList;

  const strokeCounts = Array.from(new Set(radicalList.map(item => parseInt(item.strokeCount)))).sort((a, b) => a - b);

  const renderRadicalItem = ({ item }: { item: RadicalItem }) => (
    <TouchableOpacity style={styles.radicalItem}>
      <Text style={styles.radicalText}>{item.radical}</Text>
      <Text style={styles.readingText}>{item.reading}</Text>
      <Text style={styles.meaningText}>{item.meaning}</Text>
      <Text style={styles.examplesText}>Contoh: {item.examples}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Belajar Radikal' }} />
      
      <View style={styles.strokeContainer}>
        <TouchableOpacity
          style={[styles.strokeButton, selectedStrokeCount === null && styles.selectedStroke]}
          onPress={() => setSelectedStrokeCount(null)}
        >
          <Text style={[styles.strokeText, selectedStrokeCount === null && styles.selectedStrokeText]}>
            Semua
          </Text>
        </TouchableOpacity>
        {strokeCounts.map((count) => (
          <TouchableOpacity
            key={count}
            style={[styles.strokeButton, selectedStrokeCount === count && styles.selectedStroke]}
            onPress={() => setSelectedStrokeCount(count)}
          >
            <Text style={[styles.strokeText, selectedStrokeCount === count && styles.selectedStrokeText]}>
              {count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRadicals}
        renderItem={renderRadicalItem}
        keyExtractor={(item) => item.radical}
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
  strokeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  strokeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    minWidth: 40,
    alignItems: 'center',
  },
  selectedStroke: {
    backgroundColor: '#007AFF',
  },
  strokeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  selectedStrokeText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  radicalItem: {
    flex: 1,
    margin: 4,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  radicalText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  readingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  meaningText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  examplesText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
