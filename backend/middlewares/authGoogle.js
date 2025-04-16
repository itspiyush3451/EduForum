import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client"; // Import Prisma client
dotenv.config();

const prisma = new PrismaClient();
// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await prisma.user.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (!user) {
          // If user doesn't exist, create one
          user = await prisma.user.create({
            data: {
              email: profile.emails[0].value,
              username: profile.displayName,
              googleId: profile.id,
              usertype: "STUDENT", // Default role
            },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.userid);
});

// Deserialize user from session
passport.deserializeUser(async (userid, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { userid } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
