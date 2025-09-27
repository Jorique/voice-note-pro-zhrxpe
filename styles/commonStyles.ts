
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#007AFF',      // iOS Blue
  secondary: '#5856D6',    // iOS Purple
  accent: '#34C759',       // iOS Green
  background: '#FFFFFF',   // White background
  backgroundAlt: '#F2F2F7', // Light gray
  text: '#000000',         // Black text
  textSecondary: '#8E8E93', // Gray text
  grey: '#C7C7CC',         // Light gray
  card: '#FFFFFF',         // White card
  border: '#E5E5EA',       // Light border
  error: '#FF3B30',        // iOS Red
  warning: '#FF9500',      // iOS Orange
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  record: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(255, 59, 48, 0.3)',
    elevation: 8,
  },
  recordActive: {
    backgroundColor: colors.warning,
    transform: [{ scale: 1.1 }],
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: {
    height: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
});
