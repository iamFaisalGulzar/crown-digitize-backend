let JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

// load up the user model
const User = require("../models/user.model");

module.exports = function (passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = "crowndigitinzingpersonaljwt";
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, next) {
      let user = getUser({ id: jwt_payload.id });
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    })
  );
};

const getUser = async (obj) => {
  return await User.findOne({
    where: { id: obj.id },
  });
};
