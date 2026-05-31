import {TodoAppApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import open from 'open';
import {createDefaultAdmin} from './services/default-admin';
import {RestServer} from '@loopback/rest';

export async function main(
  options: ApplicationConfig = {},
) {
  const app = new TodoAppApplication(
    options,
  );

  await app.boot();
  await app.start();

  await createDefaultAdmin(app);

  const restServer =
    await app.getServer(RestServer);

  // Replace IPv6 localhost with IPv4
  const url =
    restServer.url
      ?.replace('[::1]', '127.0.0.1') ??
    'http://127.0.0.1:3000';

  console.log(
    `✅ Server running at ${url}`,
  );

  console.log(
    `✅ API Explorer at ${url}/explorer`,
  );

  await open(`${url}/explorer`);

  return app;
}

if (require.main === module) {
  main().catch(err => {
    console.error(
      'Cannot start application',
      err,
    );
    process.exit(1);
  });
}