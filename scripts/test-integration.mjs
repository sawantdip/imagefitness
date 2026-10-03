import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {MongoMemoryServer} from 'mongodb-memory-server';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const database=await MongoMemoryServer.create({binary:{downloadDir:path.join(root,'.npm-cache/mongodb'),version:'8.0.17'}});
try{const child=spawn(process.execPath,['--test','server/tests/integration.test.js'],{cwd:root,stdio:'inherit',env:{...process.env,TEST_MONGODB_URI:database.getUri()}});process.exitCode=await new Promise((resolve,reject)=>{child.on('exit',resolve);child.on('error',reject);});}finally{await database.stop();}
