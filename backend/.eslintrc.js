module.exports = {
  env: {
    es6: true,
    node: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint', ],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended', 
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'import/extensions': ['error', 'always', {tsx: 'never', ts: 'never', js: 'never'}]
  },
  "overrides": [
    {
      // Allow Typeorm entity classes export without default reserved world.
      "files": ["**/src/database/entity/*.ts", "**/src/database/migration/*.ts"],
      "rules": {
        "import/prefer-default-export": "off"
      }
    },
    {
      // Ignore specific eslint rules in migration files 
      "files": ["**/src/database/migration/*.ts"],
      "rules": {
        "class-methods-use-this": "off",
        "@typescript-eslint/no-explicit-any": "off",
      }
    },
  ],
};
