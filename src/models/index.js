import getDef from './Default';

export default (connect) => {
  const models = {
    Default: getDef(connect),
  };

  return models;
};
