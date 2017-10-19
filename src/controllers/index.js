
import welcome from './welcome';
import error from './error';

const controllers = [welcome, error];

export default (router, container) => controllers
  .forEach(f => f(router, container));
