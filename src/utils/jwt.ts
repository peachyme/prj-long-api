import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (user: { id: string }): string => {
  const { id: string } = user;
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET as string, { expiresIn: "8h" });
}

export const generateVerificationToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
};

export const generateResetToken = (user: { id: string }): string => {
  const { id: string } = user;
  return jwt.sign({ userId: user.id }, process.env.JWT_RESET_SECRET as string, { expiresIn: '1h' });
};

// I choose 8h because I prefer to make the user log in again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days and make him log in again after 7 days of inactivity.
// export const  generateRefreshToken = (user: { id: string }, jti: string): string => {
//   return jwt.sign({
//     userId: user.id,
//     jti,
//   }, process.env.JWT_REFRESH_SECRET as string, {
//     expiresIn: '8h',
//   });
// }

// export const generateTokens = (user: { id: string }, jti: string)
// : { accessToken: string; refreshToken: string } =>  {
//   const accessToken = generateAccessToken(user);
//   const refreshToken = generateRefreshToken(user, jti);

//   return {
//     accessToken,
//     refreshToken,
//   };
// }
