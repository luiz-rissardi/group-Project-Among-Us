import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { SocketHandler } from './server/controllers';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', 'localhost:4000', 'your-production-domain.com']

});

// 1. Instância do servidor HTTP unificado
const server = createServer(app);

// 2. Anexa o Socket.IO ao servidor HTTP
SocketHandler.setup(server);

/**
 * Serve arquivos estáticos da pasta /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Bypass de rotas do Socket.IO para não passar pelo renderizador do Angular SSR
 */
app.use((req, res, next) => {
  if (req.url?.startsWith('/socket.io/')) {
    return next();
  }

  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Inicialização em ambiente standalone (ex: node server.mjs / PM2)
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  server.listen(port, () => {
    console.log(`🚀 Servidor unificado (Angular SSR + WebSocket) rodando na porta ${port}`);
  });
}

/**
 * O createNodeRequestHandler do Angular SSR exige o app (Express) como argumento
 */
export const reqHandler = createNodeRequestHandler(app);