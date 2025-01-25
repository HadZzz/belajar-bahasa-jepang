import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { loadVocabData, VocabItem } from '../utils/vocabLoader';
import { SearchBar } from '../components/SearchBar';

type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
const JLPT_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

const { width } = Dimensions.get('window');

export default function VocabularyScreen() {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel>('N5');
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVocab, setSelectedVocab] = useState<VocabItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVocabularyData();
  }, [selectedLevel]);

  const loadVocabularyData = async () => {
    try {
      setLoading(true);
      const data = await loadVocabData(selectedLevel);
      setVocabList(data);
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVocab = useMemo(() => {
    if (!searchQuery) return vocabList;
    const query = searchQuery.toLowerCase();
    return vocabList.filter(
      vocab =>
        vocab.kosakata.toLowerCase().includes(query) ||
        vocab.reading.toLowerCase().includes(query) ||
        vocab.meaning.toLowerCase().includes(query)
    );
  }, [vocabList, searchQuery]);

  const handleVocabPress = (vocab: VocabItem) => {
    setSelectedVocab(vocab);
    setModalVisible(true);
  };

  const renderVocabItem = ({ item }: { item: VocabItem }) => (
    <TouchableOpacity 
      style={styles.vocabItem}
      onPress={() => handleVocabPress(item)}
    >
      <Text style={styles.vocabText}>{item.kosakata}</Text>
      <Text style={styles.readingText}>{item.reading}</Text>
      <Text style={styles.meaningText} numberOfLines={2}>{item.meaning}</Text>
    </TouchableOpacity>
  );

  const renderVocabModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detail Kosakata</Text>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedVocab && (
              <View style={styles.modalVocabContent}>
                <Text style={styles.modalVocabText}>{selectedVocab.kosakata}</Text>
                
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="book-outline" size={20} color="#666" style={styles.sectionIcon} />
                    Cara Baca
                  </Text>
                  <Text style={styles.modalSectionText}>{selectedVocab.reading}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    <Ionicons name="language-outline" size={20} color="#666" style={styles.sectionIcon} />
                    Arti
                  </Text>
                  <Text style={styles.modalSectionText}>{selectedVocab.meaning}</Text>
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
          title: 'Kosakata JLPT',
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
        placeholder="Cari kosakata, cara baca, atau arti..."
        onClear={() => setSearchQuery('')}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlashList
          data={filteredVocab}
          renderItem={renderVocabItem}
          estimatedItemSize={100}
          numColumns={1}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Tidak ada kosakata yang ditemukan</Text>
            </View>
          }
        />
      )}

      {renderVocabModal()}
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
  vocabItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vocabText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  readingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  meaningText: {
    fontSize: 16,
    color: '#333',
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
  modalVocabContent: {
    padding: 20,
  },
  modalVocabText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalSection: {
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
