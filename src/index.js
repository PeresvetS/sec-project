// @flow

import 'babel-polyfill';

import path from 'path';
import Koa from 'koa';
import hbs from 'koa-hbs';
import { get } from 'lodash';
import rollbar from 'rollbar';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import Router from 'koa-router';
import convert from 'koa-convert';
import koaLogger from 'koa-logger';
import dateFormat from 'dateformat';
import middleware from 'koa-webpack';
import flash from 'koa-flash-simple';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import methodOverride from 'koa-methodoverride';
import getWebpackConfig from '../webpack.config.babel';
import container from './container';
import addRoutes from './controllers';


export default() => {
  rollbar.init(process.env.ROLLBAR_KEY);

  const app = new Koa();
  app.use(helmet());
  app.keys = ['some secret hurr'];
  app.use(session(app));
  app.use(flash());

  app.use(async (ctx, next) => {
    ctx.state = {
      flash: ctx.flash,
    };
    try {
      await next();
    } catch (err) {
      // err.status = err.statusCode || err.status || 500;
      // ctx.redirect('/500');
    }
  });
  app.use(bodyParser());

  app.use(methodOverride((req) => { // eslint-disable-line consistent-return
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      return req.body._method; // eslint-disable-line no-underscore-dangle
    }
  }));

  app.use(serve(path.join(__dirname, '..', 'public')));


  if (process.env.NODE_ENV !== 'test') {
    app.use(middleware({ config: getWebpackConfig() }));
  }

  app.use(koaLogger());

  const router = new Router();

  hbs.registerHelper('urlFor', (...args) => router.url(...args));

  app.use(convert(hbs.middleware({
    viewPath: path.join(__dirname, 'views'),
  })));

  addRoutes(router, container);
  app.use(router.allowedMethods());
  app.use(router.routes());


  app.use(async (ctx) => {
    if (ctx.status === 404) {
      ctx.redirect('/404');
    }
  });

  const optionsRollbar = {
    exitOnUncaughtException: true,
  };
  rollbar.errorHandler(process.env.ROLLBAR_KEY);
  rollbar.handleUncaughtExceptionsAndRejections(process.env.ROLLBAR_KEY, optionsRollbar);

  return app;
};
