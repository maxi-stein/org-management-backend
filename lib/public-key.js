import fs from 'fs';
import path from 'path';
import config from 'config';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const publicKey = fs.readFileSync(
  path.join(__dirname, `../keys/${config.auth.key}.pub`),
);
