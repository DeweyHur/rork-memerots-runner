const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for import.meta issue with Zustand
config.resolver.unstable_conditionNames = [
    'require',
    'react-native',
    'default',
];

module.exports = config; 