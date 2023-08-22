export const { PORT, NODE_ENV, MONGO_URI, MONGO_DEBUG } = process.env;

export const isDev = NODE_ENV === 'development';
export const isProd = NODE_ENV === 'production';
