import 'zone.js/dist/zone-node';
import { APP_BASE_HREF } from '@angular/common';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import { join } from 'path';
import { existsSync } from 'fs';

import { AppServerModule } from './src/main.server';

import { BookRoute } from './routes/book-route';
import { UserRoute } from './routes/user-route';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/angular-ssr/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const bookRoute: BookRoute = new BookRoute();
  const userRoute: UserRoute = new UserRoute();

  mongoose.connect('mongodb://localhost/angular-ssr', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.use(cors());

  bookRoute.bookRoute(server);
  userRoute.userRoute(server);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
