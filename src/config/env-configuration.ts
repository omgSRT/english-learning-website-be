export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri:
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/english-learning',
  port: parseInt(process.env.DEPLOYMENT_PORT ?? '3010'),
});
