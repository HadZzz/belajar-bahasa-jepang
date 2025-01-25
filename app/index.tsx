import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>日本語を学ぼう！</Text>
      <Text style={styles.subtitle}>Mari Belajar Bahasa Jepang</Text>

      <View style={styles.menuContainer}>
        <Link href="/kana" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Kana</Text>
            <Text style={styles.menuDescription}>Hiragana & Katakana</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/kanji" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Kanji</Text>
            <Text style={styles.menuDescription}>Belajar Kanji</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/vocabulary" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Kosakata</Text>
            <Text style={styles.menuDescription}>Vocabulary</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/radical" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Radikal</Text>
            <Text style={styles.menuDescription}>Kanji Radicals</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  menuContainer: {
    width: '90%',
    gap: 16,
  },
  menuItem: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  menuDescription: {
    color: '#666',
    fontSize: 16,
  },
});
