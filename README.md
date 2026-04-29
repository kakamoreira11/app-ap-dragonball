# 📱 API - App de Consumo de API em React Native

## 📌 Sobre o Projeto

Este é um projeto acadêmico desenvolvido em **React Native** utilizando a plataforma **Expo Snack**. O aplicativo demonstra o consumo de APIs externas, exibindo os dados em uma lista estilizada com animações e loader de carregamento. Serve como base para estudos de requisições assíncronas, hooks (useState, useEffect) e componentes de listagem no React Native.

## 🎨 Funcionalidades

- 🔄 Consumo de dados de uma API externa
- 📱 Listagem responsiva com **FlatList**
- ⏳ Indicador de carregamento (**ActivityIndicator**)
- ✨ Animações suaves com **Animated API**
- 🎨 Interface com gradientes (**LinearGradient**)
- 🔍 Ícones vetorizados (**Ionicons**)
- 📏 Design adaptável (**Dimensions API**)

## 🛠️ Tecnologias Utilizadas

- **React Native** (Expo Snack v50–55)
- **React Hooks** (useState, useEffect, useRef)
- **FlatList** para renderização eficiente de listas
- **Animated API** para animações
- **expo-linear-gradient** para efeitos visuais
- **@expo/vector-icons** para ícones
- **Fetch / Axios** para consumo da API

## 📁 Estrutura de Arquivos
Project/
├── assets/ # Imagens e recursos estáticos
├── services/ # Configuração das chamadas da API
├── App.js # Tela principal (lista + consumo de API)
├── package.json # Dependências
└── README.md # Este arquivo

## 🎯 Componentes e Recursos no App.js

O arquivo principal `App.js` implementa:

| Componente | Função |
|------------|--------|
| `FlatList` | Exibe a lista de dados da API |
| `ActivityIndicator` | Mostra loading enquanto os dados são carregados |
| `Animated` | Cria animações na interface |
| `LinearGradient` | Aplica gradientes de fundo |
| `Ionicons` | Adiciona ícones estilizados |
| `Dimensions` | Adapta o layout ao tamanho da tela |

## 🎨 Cores do Tema

```javascript
const Colors = {
  laranja: '#F5A623',
  laranjaEscuro: '#E67E22',
  azul: '#3498DB',
  azulEscuro: '#1E2A3A',
  roxo: '#9B59B6',
  vermelho: '#E74C3C',
  verde: '#2ECC71',
  amarelo: '#F1C40F'
}
