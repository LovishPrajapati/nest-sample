import mongoose, { Mongoose } from 'mongoose';
import { setGlobalOptions } from '@typegoose/typegoose';
import { MONGO_DEBUG } from '../config/keys';

setGlobalOptions({
  schemaOptions: {
    minimize: true,
    id: false,
    versionKey: false,
  },
});
if (MONGO_DEBUG) {
  mongoose.set('debug', true);
}

export async function db(uri: string): Promise<Mongoose> {
  return mongoose.connect(uri);
}
