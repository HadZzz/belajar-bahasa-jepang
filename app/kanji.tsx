import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { loadKanjiData, KanjiItem } from '../utils/kanjiLoader';
import { SearchBar } from '../components/SearchBar';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
const JLPT_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

const { width } = Dimensions.get('window');

export default function KanjiScreen() {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [kanjiList, setKanjiList] = useState<KanjiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadKanjiDataForLevel();
  }, [selectedLevel]);

  const loadKanjiDataForLevel = async () => {
    try {
      setLoading(true);
      const data = await loadKanjiData(selectedLevel);
      setKanjiList(data);
    } catch (error) {
      console.error('Error loading kanji data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredKanji = useMemo(() => {
    if (!searchQuery) return kanjiList;
    const query = searchQuery.toLowerCase();
    return kanjiList.filter(
      kanji =>
        kanji.kanji.toLowerCase().includes(query) ||
        kanji.reading.toLowerCase().includes(query) ||
        kanji.meaning.toLowerCase().includes(query)
    );
  }, [kanjiList, searchQuery]);

  const handleKanjiPress = (kanji: KanjiItem) => {
    setSelectedKanji(kanji);
    setModalVisible(true);
  };

  const renderKanjiItem = ({ item }: { item: KanjiItem }) => (
    <TouchableOpacity 
      style={styles.kanjiItem}
      onPress={() => handleKanjiPress(item)}
    >
      <Text style={styles.kanjiText}>{item.kanji}</Text>
      <Text style={styles.readingText}>{item.reading}</Text>
      <Text style={styles.meaningText} numberOfLines={2}>{item.meaning}</Text>
    </TouchableOpacity>
  );

  const renderKanjiModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detail Kanji</Text>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedKanji && (
              <View style={styles.modalKanjiContent}>
                <Text style={styles.modalKanjiChar}>{selectedKanji.kanji}</Text>
                
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="book-outline" size={20} color="#666" style={styles.sectionIcon} />
                    Cara Baca
                  </Text>
                  <Text style={styles.modalSectionText}>{selectedKanji.reading}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="language-outline" size={20} color="#666" style={styles.sectionIcon} />
                    Arti
                  </Text>
                  <Text style={styles.modalSectionText}>{selectedKanji.meaning}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="school-outline" size={20} color="#666" style={styles.sectionIcon} />
                    Level JLPT
                  </Text>
                  <Text style={styles.modalSectionText}>{selectedLevel}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Belajar Kanji',
          headerStyle: { backgroundColor: '#f4f4f4' },
        }} 
      />
      
      <View style={styles.levelContainer}>
        <FlatList
          data={JLPT_LEVELS}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.levelButton,
                selectedLevel === item && styles.selectedLevel
              ]}
              onPress={() => setSelectedLevel(item)}
            >
              <Text style={[
                styles.levelText,
                selectedLevel === item && styles.selectedLevelText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
        />
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Cari kanji, cara baca, atau arti..."
        onClear={() => setSearchQuery('')}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlashList
          data={filteredKanji}
          renderItem={renderKanjiItem}
          estimatedItemSize={120}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Tidak ada kanji yang ditemukan</Text>
            </View>
          }
        />
      )}

      {renderKanjiModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  levelContainer: {
    paddingVertical: 12,
    backgroundColor: '#f4f4f4',
  },
  levelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedLevel: {
    backgroundColor: '#007AFF',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedLevelText: {
    color: '#fff',
  },
  listContainer: {
    padding: 12,
  },
  kanjiItem: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 6,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  kanjiText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  readingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  meaningText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: width * 0.85,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalKanjiContent: {
    alignItems: 'center',
    padding: 20,
  },
  modalKanjiChar: {
    fontSize: 72,
    marginBottom: 24,
  },
  modalSection: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  modalSectionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});
