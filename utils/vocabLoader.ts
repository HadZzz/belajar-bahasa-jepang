import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { parseCSV } from './csvParser';

export type VocabItem = {
  kosakata: string;
  reading: string;
  meaning: string;
};

const JLPT_FILES = {
  N5: require('../assets/data/kosakata/jlpt_n5(1).csv'),
  N4: require('../assets/data/kosakata/jlpt_n4(1).csv'),
  N3: require('../assets/data/kosakata/jlpt_n3(1).csv'),
  N2: require('../assets/data/kosakata/jlpt_n2(1).csv'),
  N1: require('../assets/data/kosakata/jlpt_n1(1).csv'),
};

export async function loadVocabData(level: keyof typeof JLPT_FILES): Promise<VocabItem[]> {
  try {
    const asset = Asset.fromModule(JLPT_FILES[level]);
    await asset.downloadAsync();
    
    if (!asset.localUri) {
      throw new Error(`Could not load JLPT ${level} data`);
    }

    const csvContent = await FileSystem.readAsStringAsync(asset.localUri);
    const records = parseCSV(csvContent, ';');
    
    // Skip header row and parse data
    return records.slice(1).map(row => ({
      kosakata: row[0],
      reading: row[1],
      meaning: row[2]
    }));
  } catch (error) {
    console.error(`Error loading JLPT ${level} data:`, error);
    return [];
  }
}
