import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // files: ['**/*.{ts,tsx}'],
  // rules: {
  //   'react/react-in-jsx-scope': 'off',  
  // },
  // rules: {
  //   ...nextPlugin.configs['core-web-vitals'].rules,
  //   'react/react-in-jsx-scope': 'off',
  //   '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional: adjust as needed
  // },
];

export default eslintConfig;
