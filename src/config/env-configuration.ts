export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongodbUri:
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/english-learning',
  port: parseInt(process.env.DEPLOYMENT_PORT ?? '3010'),
  jwtSecret: process.env.JWT_SECRET,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
});
