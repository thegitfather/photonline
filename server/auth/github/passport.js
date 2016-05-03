import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github2';

export function setup(User, config) {
  passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({'github.id': profile.id}).exec().then(user => {
      if (user) {
        return done(null, user);
      }

      user = new User({
        name: profile.displayName,
        role: 'user',
        provider: 'github',
        github: { id: profile.id }
      });
      user.save()
      .then(user => done(null, user))
      .catch(err => done(err));
    })
    .catch(err => done(err));
  }));
}
