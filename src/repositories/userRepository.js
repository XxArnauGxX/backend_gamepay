import User from '../models/user.js';

export async function findByEmail(email) {
  return await User.findOne({ email });
}

export async function createUser(data) {
  const user = new User(data);
  return await user.save();
}
