import jsExtension from '@eslint/js';
import p5jsPlugin from 'eslint-plugin-p5js';
import prettierExtension from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

import fs from 'fs';
import path from 'path';

const toPascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getConstantNames = (dir, keepOriginName) => {
  const files = fs.readdirSync(dir);
  var names = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      names = [...names, ...getConstantNames(filePath)];
    } else if (path.extname(file) === '.js') {
      const originName = path.basename(file, path.extname(file));
      const name = keepOriginName ? originName : toPascalCase(originName);
      names.push(name);
    }
  });

  return names;
};

const customGlobals = [
  ...getConstantNames(path.resolve('docs/src/pages')),
  ...getConstantNames(path.resolve('docs/src/config')),
  ...getConstantNames(path.resolve('docs/src/state')),
  ...getConstantNames(path.resolve('docs/src/classes')),
  ...getConstantNames(path.resolve('docs/src/utils'), true),
];

export default [
  jsExtension.configs.recommended,
  prettierExtension,
  prettierPlugin,
  {
    files: ['docs/src/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        ...p5jsPlugin.environments.p5.globals,
        ...globals.browser,
        ...customGlobals.reduce((obj, name) => {
          obj[name] = 'readonly';
          return obj;
        }, {}),
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: [
            p5jsPlugin.configs.p5.rules['no-unused-vars'][1].varsIgnorePattern,
            ...customGlobals,
          ].join('|'),
        },
      ],
      'no-redeclare': ['error', { builtinGlobals: false }],
    },
    plugins: {
      p5js: p5jsPlugin,
    },
  },
];
