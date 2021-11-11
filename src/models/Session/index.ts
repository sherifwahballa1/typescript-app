import mongoose, { Schema } from "mongoose";
import { LoginDetails, NewLogin } from "../../interfaces/ISession";
import { SessionDoc, SessionModel } from "../../interfaces/mongo/Session";
import keys from "../../config"

const sessionSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    trim: true,
  },
  role: {
    type: String
  },
  // used for login devices
  sessions: [
    {
      urn: { type: Number }
    }
  ],
  // usuage rate limit per hour
  usage: {
    total: Number,
    span: Date,
    blocked: Boolean,
    nextAt: Date
  }
}, { timestamps: true });

sessionSchema.methods.initSession = function (id) {
  this.user = id;
  this.usage = {
    total: 0,
    span: new Date(),
    blocked: false,
    nextAt: new Date()
  };
};

// generates random number
function getRandom() {
  return Math.floor(100000000 + Math.random() * 900000000);
}


// create new random number for session
sessionSchema.methods.newLogin = function (opts: LoginDetails): NewLogin {
  const ticket = {
    urn: getRandom()
  };
  this.sessions.unshift(ticket);
  if (this.sessions.length > keys.maxLogins) this.sessions.pop();
  return ticket;
};

sessionSchema.query.byUserID = function (id: Schema.Types.ObjectId) {
  return this.where({ _id: id });
};

sessionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Session = mongoose.model<SessionDoc, SessionModel>('Session', sessionSchema);

export { Session };
