import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/api/v1/auth/google/callback",
  scope: ["profile", "email"],
};
console.log(process.env.GOOGLE_CLIENT_ID);
const verifyCallback = (accessToken, refreshToken, profile, done) => {
  try {
    const userData = {
      name: profile._json.name,
      email: profile._json.email,
      photo: profile._json.picture,
      googleId: profile.id,
    };
    console.log(userData);

    done(null, userData);
  } catch (error) {
    console.error("error: 🤬", error);
    done(error, null);
  }
};

passport.use("google", new GoogleStrategy(googleOptions, verifyCallback));
