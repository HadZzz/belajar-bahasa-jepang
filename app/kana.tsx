import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { parseCSV } from '../utils/csvParser';
import { hiraganaData } from '../assets/data/kana/hiragana';
import { katakanaData } from '../assets/data/kana/katakana';

type KanaItem = {
  kana: string;
  romaji: string;
  description: string;
};

export default function KanaScreen() {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>('hiragana');
  const [kanaList, setKanaList] = useState<KanaItem[]>([]);

  useEffect(() => {
    loadKanaData();
  }, [activeTab]);

  const loadKanaData = () => {
    try {
      const csvText = activeTab === 'hiragana' ? hiraganaData : katakanaData;
      const records = parseCSV(csvText, ';');
      
      // Skip header row
      const parsedKana = records.slice(1).map(row => ({
        kana: row[0],
        romaji: row[1],
        description: row[2]
      }));

      setKanaList(parsedKana);
    } catch (error) {
      console.error('Error loading kana data:', error);
    }
  };

  const renderKanaItem = ({ item }: { item: KanaItem }) => (
    <TouchableOpacity style={styles.kanaItem}>
      <Text style={styles.kanaText}>{item.kana}</Text>
      <Text style={styles.romajiText}>{item.romaji}</Text>
      <Text style={styles.descriptionText} numberOfLines={2}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Belajar Kana' }} />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hiragana' && styles.activeTab]}
          onPress={() => setActiveTab('hiragana')}
        >
          <Text style={[styles.tabText, activeTab === 'hiragana' && styles.activeTabText]}>
            Hiragana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'katakana' && styles.activeTab]}
          onPress={() => setActiveTab('katakana')}
        >
          <Text style={[styles.tabText, activeTab === 'katakana' && styles.activeTabText]}>
            Katakana
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={kanaList}
        renderItem={renderKanaItem}
        keyExtractor={(item) => `${activeTab}-${item.kana}`}
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
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  kanaItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  kanaText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  romajiText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
});
