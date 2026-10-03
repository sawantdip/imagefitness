import mongoose from 'mongoose';
let pending;
export async function connectDatabase(uri) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!pending)
    pending = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 10000, maxPoolSize: 5, bufferCommands: false })
      .catch((error) => {
        pending = undefined;
        throw error;
      });
  await pending;
  return mongoose.connection;
}
