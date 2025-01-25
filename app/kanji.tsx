import { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    const fetchKanji = async () => {
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

    fetchKanji();
  }, [selectedLevel]);

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
      onPress={() => handleKanjiPress(item)}
      style={styles.kanjiItem}
    >
      <LinearGradient
        colors={['#fff', '#f8f8f8']}
        style={styles.kanjiGradient}
      >
        <Text style={styles.kanjiChar}>{item.kanji}</Text>
        <View style={styles.kanjiDetails}>
          <Text style={styles.reading}>{item.reading}</Text>
          <Text style={styles.meaning} numberOfLines={1}>{item.meaning}</Text>
        </View>
      </LinearGradient>
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
        <ImageBackground 
          source={require('../assets/images/japanese-paper.png')}
          style={styles.modalContent}
          imageStyle={styles.modalBackground}
        >
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
                <View style={styles.kanjiCircle}>
                  <Text style={styles.modalKanjiChar}>{selectedKanji.kanji}</Text>
                </View>
                
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
        </ImageBackground>
      </View>
    </Modal>
  );

  return (
    <ImageBackground 
      source={require('../assets/images/japanese-pattern.png')}
      style={styles.container}
      imageStyle={styles.backgroundPattern}
    >
      <Stack.Screen 
        options={{ 
          title: 'Belajar Kanji',
          headerStyle: { backgroundColor: '#f4f4f4' },
        }} 
      />
      
      <View style={styles.levelContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.levelScroll}
        >
          {JLPT_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                selectedLevel === level && styles.selectedLevel
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <Text style={[
                styles.levelText,
                selectedLevel === level && styles.selectedLevelText
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Cari kanji, cara baca, atau arti..."
        onClear={() => setSearchQuery('')}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF4B4B" />
          <Text style={styles.loaderText}>Memuat Kanji...</Text>
        </View>
      ) : (
        <FlashList
          data={filteredKanji}
          renderItem={renderKanjiItem}
          estimatedItemSize={100}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundPattern: {
    opacity: 0.05,
  },
  levelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelScroll: {
    paddingHorizontal: 12,
  },
  levelButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
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
    backgroundColor: '#FF4B4B',
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
    flex: 1,
    margin: 6,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  kanjiGradient: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kanjiChar: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  kanjiDetails: {
    alignItems: 'center',
  },
  reading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  meaning: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: width * 0.85,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalBackground: {
    opacity: 0.1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalKanjiContent: {
    padding: 24,
  },
  kanjiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalKanjiChar: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSection: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
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
