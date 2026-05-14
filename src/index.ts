import {TodoAppApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {RestServer} from '@loopback/rest';
import open from 'open';

export {TodoAppApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new TodoAppApplication(options);

  await app.boot();

  // Auto-create tables
  await app.migrateSchema({existingSchema: 'drop'});

  await app.start();

  // Correct way to get REST server
 const restServer = await app.getServer(RestServer);
const url = restServer.url?.replace('[::1]', '127.0.0.1') || 'http://127.0.0.1:3000';
console.log(`✅ Server is running at ${url}`);
console.log(`✅ OpenAPI Explorer at ${url}/explorer`);

  // Optional: open browser
  await open(`${url}/explorer`);

  return app;
}

if (require.main === module) {
  main().catch(err => {
    console.error('Cannot start application', err);
    process.exit(1);
  });
}