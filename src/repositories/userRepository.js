import User from '../models/user.js';

export async function findByEmail(email) {
  return await User.findOne({ email });
}

export async function createUser(data) {
  const user = new User(data);
  return await user.save();
}

export async function findById(id) {
  return await User.findById(id);
}

export async function updateRefreshToken(userId, newRefreshToken) {
  return await User.findByIdAndUpdate(
    userId,
    { refreshToken: newRefreshToken },
    { new: true }
  );
}
