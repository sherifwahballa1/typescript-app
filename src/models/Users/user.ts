import mongoose, { Model, Schema } from "mongoose";
import { v5 } from 'uuid';
import { NotAuthorizedError } from "../../errors/not-authorized-error";
import { UserAttrs, UserCredentials, UserDoc, UserModel } from "../../interfaces/mongo/User";
import { Password } from "../../services/hash-password/password";
// import { obfuscate } from "./getters/obfuscate";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // get: obfuscate // when return email returned like (te***@test.com)
  },
  userID: {
    type: String,
    unique: true,
    default: ""
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    default: 0
  },
  country: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "user"
  },
  active: {
    type: Boolean,
    default: false
  },
  otp: { type: String },
  otpRequestCounter: {
    type: Number,
    default: 0
  },
  otpNextResendAt: {
    type: Date,
    default: Date.now
  },
  otpSubmitCounter: {
    type: Number,
    default: 0
  },
  otpNextSubmitAt: {
    type: Date,
    default: Date.now
  },
  forgotPasswordResetCounter: {
    type: Number,
    default: 0
  },
  forgotPasswordNextResetAt: {
    type: Date,
    default: Date.now
  },
  scoreUpdateAt: {
    type: Date,
    default: Date.now
  },
  challengesHints: [],
  // Expires in a week
  // createdAt: {
  //   type: Date,
  //   required: true,
  //   expires: 60 * 60 * 24 * 7,
  //   default: Date.now,
  // },
}, {
  // collection: "Users",
  // versionKey: false,
  toJSON: {
    versionKey: false, // exclude the version key ('__v') from the output
    getters: true,
    // doc refers to document
    // ret refers to returned values
    transform(doc, ret) {
      ret.id = doc._id;
      delete ret._id;
      delete ret.role;
      delete ret.password;
      delete ret.otpNextResendAt;
      delete ret.forgotPasswordNextResetAt;
      delete ret.scoreUpdateAt;
      delete ret.otpRequestCounter;
      delete ret.otpNextSubmitAt;
      delete ret.otpSubmitCounter;
      delete ret.forgotPasswordResetCounter;
      delete ret.active;
    }
  },
  toObject: {
    // getters: true,
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = String(ret._id);
      delete ret._id;
      // delete ret.role;
      // delete ret.password;
      // delete ret.otpNextResendAt;
      // delete ret.forgotPasswordNextResetAt;
      // delete ret.scoreUpdateAt;
      // delete ret.otpRequestCounter;
      // delete ret.otpSubmitCounter;
      // delete ret.forgotPasswordResetCounter;
      // delete ret.active;
      return ret;
    },
  },
});

/**
 * Indicies
 */
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function (done) {
  // Only run this function if password was moddified (not on other update functions)
  if (!this.isModified('password')) return done();
  const hashed = await Password.toHash(this.get('password'));
  this.set('password', hashed);
  let userID = await v5(this.id, v5.URL);
  this.set('userID', userID); // this.userID = userID;
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
}

// used with findOne ---- return object
userSchema.statics.userByName = function (this: Model<UserDoc>, name: string) {
  return this.findOne({ name }).exec();
};

userSchema.statics.byID = function (this: Model<UserDoc>, id: string) {
  return this.findById({ id }).exec();
};

userSchema.statics.byEmail = function (this: Model<UserDoc>, email: string) {
  return this.findOne({ email }).exec();
};

userSchema.statics.byUUID = function (this: Model<UserDoc>, userID: string) {
  return this.findOne({ userID }).exec();
};

userSchema.statics.findByCredentials = async function (this: Model<UserDoc>, credentials: UserCredentials) {
  const user: any = this.findOne({ email: credentials.email })

  if (!user) throw new NotAuthorizedError('Invalid Credentials');

  const isMatch = await Password.compare(user.password, credentials.password);

  if (!isMatch)
    throw new NotAuthorizedError('Invalid Credentials')

  return user
}

userSchema.methods.updateOtp = function () {
  let blockTimeInMinutes = 1;
  let nextResendTime = 0;

  // block user for 1h if he made 5 requests
  // otherwise block user for 1 minute
  if (this.otpRequestCounter === 4) {
    blockTimeInMinutes = 60;
    this.otpRequestCounter = -1; // set otpRequestCounter to 0 after (1) hour of blocking
  } else if (this.otpRequestCounter === 3) {
    blockTimeInMinutes = 30;
  } else if (this.otpRequestCounter === 2) {
    blockTimeInMinutes = 15;
  } else if (this.otpRequestCounter === 1) {
    blockTimeInMinutes = 5;
  }

  nextResendTime = new Date().getTime() + blockTimeInMinutes * 60 * 1000;

  // generate 6-digits OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // set the otp && otpNextResendAt && otpRequestCounter in user document
  this.otp = otp;
  this.otpNextResendAt = new Date(nextResendTime);
  this.otpRequestCounter++;
};


userSchema.methods.updateSubmitOtp = function () {
  let blockTimeInMinutes = 0;

  // block user for 30 min if he made 5 requests
  // otherwise block user for 1 minute
  if (this.otpSubmitCounter === 5) {
    this.otpSubmitCounter = -1;
    blockTimeInMinutes = 30 * 60 * 1000; // 30 min
  }

  this.otpNextSubmitAt = new Date().getTime() + blockTimeInMinutes;
  this.otpSubmitCounter++;
};


userSchema.methods.setUserVerify = function () {
  this.isVerified = true;
  this.active = true;
  this.otpRequestCounter = 0;
  this.otpSubmitCounter = 0;
};


const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
