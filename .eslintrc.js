module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended'],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'off', // Turn off any warnings
    'no-unused-vars': 'off', // Let TypeScript handle this
    'no-console': 'off',
    'no-constant-condition': 'off', // Allow while(true) loops
  },
  ignorePatterns: ['dist/', 'node_modules/', '*.js'],
}; 