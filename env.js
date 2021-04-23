exports.getEnv = (webpackEnv) => {
  const NODE_ENV = webpackEnv.WEBPACK_BUILD ?
    'production' :
    'development';
  return {
    PUBLIC_URL: '',
    NODE_ENV,
    TIMESTAMP: Date.now(),
  };
};
