import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
  {
    title: 'Kana',
    subtitle: 'Hiragana & Katakana',
    icon: 'text-outline' as const,
    route: '/kana',
    color: ['#FF6B6B', '#FF8787'],
  },
  {
    title: 'Kanji',
    subtitle: 'Belajar Kanji',
    icon: 'brush-outline' as const,
    route: '/kanji',
    color: ['#4ECDC4', '#45B7AF'],
  },
  {
    title: 'Kosakata',
    subtitle: 'Vocabulary',
    icon: 'book-outline' as const,
    route: '/vocabulary',
    color: ['#FFD93D', '#F6C90E'],
  },
  {
    title: 'Radikal',
    subtitle: 'Kanji Radicals',
    icon: 'leaf-outline' as const,
    route: '/radical',
    color: ['#95E1D3', '#81C7BB'],
  },
];

export default function Home() {
  return (
    <ImageBackground 
      source={require('../assets/images/japanese-pattern.png')} 
      style={styles.container}
      imageStyle={styles.backgroundPattern}
    >
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
        style={styles.overlay}
      >
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/torii-gate.png')}
            style={styles.headerImage}
          />
          <Text style={styles.title}>日本語を学ぼう！</Text>
          <Text style={styles.subtitle}>Mari Belajar Bahasa Jepang</Text>
        </View>

        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item, index) => (
            <Link key={item.route} href={item.route} asChild>
              <TouchableOpacity>
                <LinearGradient
                  colors={item.color}
                  style={[
                    styles.menuItem,
                    { marginLeft: index % 2 === 0 ? 0 : 16 }
                  ]}
                >
                  <Ionicons name={item.icon} size={32} color="#fff" />
                  <Text style={styles.menuText}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.subtitle}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    opacity: 0.1,
  },
  overlay: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  headerImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: '#FF4B4B',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  menuItem: {
    width: (width - 56) / 2,
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  menuDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
  },
});
