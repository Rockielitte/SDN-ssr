import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function isPasswordMatch(pass: string, hashPass: string) {
    return await bcrypt.compare(pass, hashPass);
}
