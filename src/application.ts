import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestServer} from '@loopback/rest';
import path from 'path';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {JWTStrategy} from './strategies/jwt.strategy';
import {CurrentUserProvider} from './providers/current-user.provider';

export class TodoAppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Bind authentication
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);
    this.bind('authentication.currentUser').toProvider(CurrentUserProvider);

    // REST Explorer
    this.component(RestExplorerComponent);
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',   // ✅ Just path, no securitySchemes here
    });

    // Serve static files
    this.static('/', path.join(__dirname, '../public'));

    // Patch OpenAPI spec globally to include JWT
    this.api({
      openapi: '3.0.0',
      info: {title: 'Todo API', version: '1.0.0'},
      paths: {},
      components: {
        securitySchemes: {
          JWT: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{JWT: []}], // Apply JWT globally
    });

    // Boot options
    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}