import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ROOT = path.resolve(__dirname, '..');
export const OUTPUT_PATH = path.resolve(__dirname, '..', 'dist/');
