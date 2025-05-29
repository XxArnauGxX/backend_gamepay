import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  overview: String,
  image: String,
  releaseDate: String,
  rating: Number,
  price: {
    type: Number,
    required: true,
  },
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
  },
  genres: [String],
});

export default mongoose.model('Product', productSchema);
