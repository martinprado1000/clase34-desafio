const passport = require("passport");
const userModel = require("../models/userModel");

// requiero mis estrategias de login y registro.
const localStrategyRegister = require("../strategies/localStrategyRegister")
const localStrategyLogin = require("../strategies/localStrategyLogin")
const githubStrategy = require("../strategies/githubStrategy")

const initializePassport = () => {
  
  localStrategyRegister
  localStrategyLogin
  githubStrategy   

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findOne({ _id:id });
    done(null, user);
  });

};

module.exports = initializePassport;
