const User = require("../models/user.model");

var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = (passport) => {
  let config = {};
  config.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  config.secretOrKey = process.env.JWT_SECRET;

  passport.use(
    new JwtStrategy(config, async function (jwtPayload, done) {
      try {
        console.log("jwtPayload", jwtPayload);
        const user = await User.findOne({ _id: jwtPayload._id });
        console.log("user", user);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (e) {
        return done(e, false);
      }
    })
  );
};
