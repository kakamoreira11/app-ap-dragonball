import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  Pressable,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const Colors = {
  laranja: '#F5A623',
  laranjaEscuro: '#E67E22',
  azul: '#3498DB',
  azulEscuro: '#1E2A3A',
  roxo: '#9B59B6',
  vermelho: '#E74C3C',
  verde: '#2ECC71',
  amarelo: '#F1C40F',
  branco: '#FFFFFF',
  preto: '#2C3E50',
  cinza: '#7F8C8D',
  fundo: '#F8F9FA',
};

export default function App() {
  const [personagens, setPersonagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotacaoAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    buscarPersonagens();
    animacoesIniciais();
  }, []);

  const animacoesIniciais = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.back()),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    Animated.loop(
      Animated.timing(rotacaoAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const rotacao = rotacaoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  async function buscarPersonagens() {
    try {
      setCarregando(true);
      const resposta = await fetch('https://dragonball-api.com/api/characters?limit=50');
      const dados = await resposta.json();
      const lista = dados.items || dados;
      setPersonagens(lista);
    } catch (error) {
      console.error(error);
    } finally {
      setCarregando(false);
    }
  }

  async function verDetalhes(id) {
    try {
      const resposta = await fetch(`https://dragonball-api.com/api/characters/${id}`);
      const dados = await resposta.json();
      setSelecionado(dados);
    } catch (error) {
      alert('Erro ao carregar detalhes');
    }
  }

  const toggleFavorito = (id) => {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(fav => fav !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  const personagensFiltrados = busca === '' 
    ? personagens 
    : personagens.filter(p => p.name.toLowerCase().includes(busca.toLowerCase()));

  const renderizarItem = ({ item, index }) => {
    const entradaAnim = new Animated.Value(0);
    Animated.timing(entradaAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 50,
      useNativeDriver: true,
    }).start();

    const isFavorito = favoritos.includes(item.id);
    const nivelKi = parseInt(item.ki) || 0;
    const nivelMaxKi = parseInt(item.maxKi) || 0;
    const nivelForca = Math.min((nivelKi / 2000000) * 100, 100);

    return (
      <Animated.View
        style={{
          opacity: entradaAnim,
          transform: [{ translateX: entradaAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, 0],
          }) }],
        }}
      >
        <Pressable onPress={() => verDetalhes(item.id)}>
          <LinearGradient
            colors={[Colors.branco, '#F8F9FA']}
            style={styles.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Animated.View style={{ transform: [{ rotate: rotacao }] }}>
                  <Ionicons name="flash" size={20} color={Colors.laranja} />
                </Animated.View>
                <Text style={styles.powerLevel}>Nível KI: {nivelForca.toFixed(0)}%</Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorito(item.id)}>
                <Ionicons 
                  name={isFavorito ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={isFavorito ? Colors.vermelho : Colors.cinza} 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardContent}>
              <Animated.Image 
                source={{ uri: item.image }} 
                style={[styles.imagem, { transform: [{ scale: pulseAnim }] }]}
              />
              <View style={styles.info}>
                <Text style={styles.nome}>{item.name}</Text>
                <View style={styles.badgeContainer}>
                  <LinearGradient colors={[Colors.laranja, Colors.laranjaEscuro]} style={styles.badge}>
                    <Text style={styles.badgeText}>{item.race || 'Guerreiro'}</Text>
                  </LinearGradient>
                </View>
                <View style={styles.stats}>
                  <Ionicons name="flash" size={14} color={Colors.amarelo} />
                  <Text style={styles.statText}>KI: {item.ki}</Text>
                </View>
                <View style={styles.stats}>
                  <Ionicons name="trending-up" size={14} color={Colors.verde} />
                  <Text style={styles.statText}>Max KI: {item.maxKi}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${nivelForca}%` }]} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };

  if (carregando) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.centro}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Ionicons name="logo-octocat" size={80} color={Colors.branco} />
        </Animated.View>
        <ActivityIndicator size="large" color={Colors.branco} />
        <Text style={styles.carregandoTexto}>Carregando Guerreiros Z...</Text>
      </LinearGradient>
    );
  }

  if (selecionado) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.detalhesContainer}>
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => setSelecionado(null)}>
            <Ionicons name="arrow-back" size={24} color={Colors.branco} />
            <Text style={styles.textoVoltar}>Voltar</Text>
          </TouchableOpacity>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <LinearGradient colors={[Colors.laranja, Colors.laranjaEscuro]} style={styles.detalhesCard}>
              <Animated.Image 
                source={{ uri: selecionado.image }} 
                style={[styles.detalhesImagem, { transform: [{ scale: pulseAnim }] }]}
              />
              <Text style={styles.detalhesNome}>{selecionado.name}</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Ionicons name="person" size={24} color={Colors.laranja} />
                  <Text style={styles.statLabel}>Raça</Text>
                  <Text style={styles.statValor}>{selecionado.race || 'Desconhecida'}</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Ionicons name="flash" size={24} color={Colors.amarelo} />
                  <Text style={styles.statLabel}>KI</Text>
                  <Text style={styles.statValor}>{selecionado.ki}</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Ionicons name="trending-up" size={24} color={Colors.verde} />
                  <Text style={styles.statLabel}>Max KI</Text>
                  <Text style={styles.statValor}>{selecionado.maxKi}</Text>
                </View>
                
                <View style={styles.statCard}>
                  <Ionicons name="flag" size={24} color={Colors.vermelho} />
                  <Text style={styles.statLabel}>Afiliação</Text>
                  <Text style={styles.statValor}>{selecionado.affiliation || 'N/A'}</Text>
                </View>
              </View>
              
              {selecionado.transformations && selecionado.transformations.length > 0 && (
                <View style={styles.transformations}>
                  <Text style={styles.transformationsTitle}>🌀 Transformações: {selecionado.transformations.length}</Text>
                </View>
              )}
              
              <TouchableOpacity 
                style={styles.favoritarBtn}
                onPress={() => toggleFavorito(selecionado.id)}
              >
                <Ionicons 
                  name={favoritos.includes(selecionado.id) ? 'heart' : 'heart-outline'} 
                  size={20} 
                  color={Colors.branco} 
                />
                <Text style={styles.favoritarBtnText}>
                  {favoritos.includes(selecionado.id) ? 'Favoritado' : 'Favoritar'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Animado */}
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.titulo}> Dragon Ball Z - API</Text>
          <Text style={styles.subtitulo}>O Poder dos Guerreiros Z</Text>
        </Animated.View>
      </LinearGradient>
      
      {/* Busca Animada */}
      <Animated.View style={[styles.buscaContainer, { opacity: fadeAnim }]}>
        <Ionicons name="search" size={20} color={Colors.cinza} />
        <TextInput
          style={styles.buscaInput}
          placeholder="🔍 Buscar seu guerreiro favorito..."
          placeholderTextColor={Colors.cinza}
          value={busca}
          onChangeText={setBusca}
        />
        {busca !== '' && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Ionicons name="close-circle" size={20} color={Colors.cinza} />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      <View style={styles.statsHeader}>
        <Text style={styles.contador}>
          {personagensFiltrados.length} Guerreiros Encontrados
        </Text>
        <View style={styles.favoritosBadge}>
          <Ionicons name="heart" size={14} color={Colors.vermelho} />
          <Text style={styles.favoritosText}>{favoritos.length} Favoritos</Text>
        </View>
      </View>
      
      <FlatList
        data={personagensFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderizarItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.fundo,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  carregandoTexto: {
    fontSize: 16,
    color: Colors.branco,
    marginTop: 10,
  },
  header: {
    padding: 30,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.branco,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: Colors.branco,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.branco,
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buscaInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  contador: {
    fontSize: 12,
    color: Colors.cinza,
  },
  favoritosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFEEEE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  favoritosText: {
    fontSize: 11,
    color: Colors.vermelho,
    fontWeight: 'bold',
  },
  lista: {
    padding: 15,
  },
  card: {
    borderRadius: 20,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  powerLevel: {
    fontSize: 11,
    color: Colors.laranja,
    fontWeight: 'bold',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 3,
    borderColor: Colors.laranja,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.preto,
    marginBottom: 5,
  },
  badgeContainer: {
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    color: Colors.branco,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  statText: {
    fontSize: 12,
    color: Colors.cinza,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.laranja,
    borderRadius: 2,
  },
  detalhesContainer: {
    flex: 1,
    padding: 20,
  },
  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  textoVoltar: {
    fontSize: 16,
    color: Colors.branco,
    fontWeight: 'bold',
  },
  detalhesCard: {
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  detalhesImagem: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: Colors.branco,
    marginBottom: 20,
  },
  detalhesNome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.branco,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    width: (width - 40 - 30) / 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.branco,
    marginTop: 5,
    opacity: 0.8,
  },
  statValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.branco,
    marginTop: 2,
  },
  transformations: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  transformationsTitle: {
    fontSize: 12,
    color: Colors.branco,
    fontWeight: 'bold',
  },
  favoritarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  favoritarBtnText: {
    color: Colors.branco,
    fontSize: 14,
    fontWeight: 'bold',
  },
});