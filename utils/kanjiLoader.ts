import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { parseCSV } from './csvParser';

export type KanjiItem = {
  kanji: string;
  reading: string;
  meaning: string;
};

const KANJI_FILES = {
  N5: require('../assets/data/kanji/jlpt_n5_-_kanjis(1).csv'),
  N4: require('../assets/data/kanji/jlpt_n4_-_kanjis(1).csv'),
  N3: require('../assets/data/kanji/jlpt_n3_-_kanjis(1).csv'),
  N2: require('../assets/data/kanji/jlpt_n2_-_kanjis(1).csv'),
  N1: require('../assets/data/kanji/jlpt_n1_-_kanjis(1).csv'),
};

export async function loadKanjiData(level: keyof typeof KANJI_FILES): Promise<KanjiItem[]> {
  try {
    const asset = Asset.fromModule(KANJI_FILES[level]);
    await asset.downloadAsync();
    
    if (!asset.localUri) {
      throw new Error(`Could not load JLPT ${level} kanji data`);
    }

    const csvContent = await FileSystem.readAsStringAsync(asset.localUri);
    const records = parseCSV(csvContent, ';');
    
    // Skip header row and parse data
    return records.slice(1).map(row => ({
      kanji: row[0],
      reading: row[1],
      meaning: row[2]
    }));
  } catch (error) {
    console.error(`Error loading JLPT ${level} kanji data:`, error);
    return [];
  }
}
