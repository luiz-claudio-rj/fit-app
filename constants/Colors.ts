export default {
  primary: "#0F0F0F", // Cor principal personalizada
  primaryContainer: "#4d3c00",
  secondary: "#E8BA19",
  secondaryContainer: "#ff9800",
  tertiary: "#ff7043",
  tertiaryContainer: "#ff5722",
  surface: "#1f1f1f", // Cor de superfície escura
  surfaceVariant: "#373737", // Variante da cor da superfície
  surfaceDisabled: "rgba(255, 255, 255, 0.12)", // Superfície desabilitada
  background: "#121212", // Cor de fundo padrão
  error: "#CF6679", // Cor de erro
  errorContainer: "#B3261E", // Contêiner da cor de erro
  onPrimary: "#000000", // Texto sobre `primary`
  onPrimaryContainer: "#E8BA19", // Texto sobre `primaryContainer`
  onSecondary: "#000000", // Texto sobre `secondary`
  onSecondaryContainer: "#E8BA19", // Texto sobre `secondaryContainer`
  onTertiary: "#000000", // Texto sobre `tertiary`
  onTertiaryContainer: "#ff7043", // Texto sobre `tertiaryContainer`
  onSurface: "#FFFFFF", // Texto sobre superfícies
  onSurfaceVariant: "#CACACA", // Texto sobre variantes de superfícies
  onSurfaceDisabled: "rgba(255, 255, 255, 0.38)", // Texto sobre superfícies desabilitadas
  onError: "#FFFFFF", // Texto sobre erro
  onErrorContainer: "#FFB4A9", // Texto sobre contêiner de erro
  onBackground: "#FFFFFF", // Texto sobre o fundo
  outline: "#737373", // Cor para bordas e separadores
  outlineVariant: "#8E8E8E", // Variante da cor de borda
  inverseSurface: "#FFFFFF", // Cor inversa da superfície
  inverseOnSurface: "#121212", // Texto sobre superfícies inversas
  inversePrimary: "#4d3c00", // Cor primária inversa
  shadow: "#000000", // Cor da sombra
  scrim: "#000000", // Cor de scrim (fundo de modais)
  backdrop: "rgba(0, 0, 0, 0.5)", // Cor de fundo para modais
  white: "#FFFFFF", // Branco
  elevation: {
    level0: "transparent",
    level1: "rgba(255, 255, 255, 0.05)",
    level2: "rgba(255, 255, 255, 0.08)",
    level3: "rgba(255, 255, 255, 0.11)",
    level4: "rgba(255, 255, 255, 0.12)",
    level5: "rgba(255, 255, 255, 0.14)",
  },
} as const;
