import mongoose from "mongoose";
import { v5 } from 'uuid';
import { Password } from "../../services/hash-password/password";
import { obfuscate } from "./getters/obfuscate";

interface UserAttrs {
  name: string;
  email: string;
  password: string;
  country: string;
}

interface UserDoc extends mongoose.Document {
  name: string;
  email: string;
  userID: string;
  password: string;
  score: number;
  country: string;
  isVerified: boolean;
  role: string;
  active: boolean;
  otp: string;
  otpRequestCounter: number;
  otpNextResendAt: Date;
  otpSubmitCounter: number; // number of submitted OTP in a short time
  forgotPasswordResetCounter: number;
  forgotPasswordNextResetAt: Date;
  scoreUpdateAt: Date;
  challengesHints: [string];
};

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
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
    get: obfuscate // when return email returned like (te***@test.com)
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
      delete ret.otpSubmitCounter;
      delete ret.forgotPasswordResetCounter;
      delete ret.active;
    }
  },
  // toObject: {
  //   getters: true,
  //   versionKey: false,
  //   transform: (doc, ret) => {
  //     ret.id = String(ret._id);
  //     delete ret._id;
  //     delete ret.role;
  //     delete ret.password;
  //     delete ret.otpNextResendAt;
  //     delete ret.forgotPasswordNextResetAt;
  //     delete ret.scoreUpdateAt;
  //     delete ret.otpRequestCounter;
  //     delete ret.otpSubmitCounter;
  //     delete ret.forgotPasswordResetCounter;
  //     delete ret.active;
  //     return ret;
  //   },
  // },
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
userSchema.query.userByName = function (name: string) {
  return this.where({ name });
};

// used with find ---- return array
userSchema.query.byName = function (name: string) {
  return this.where({ name: { $regex: name, $options: 'i' } });
};

userSchema.query.byEmail = function (email: string) {
  return this.where({ email });
};


// userschema.statics.findByCredentials = async (email, password) => {
//   const user:any = await User.findOne({ email })

//   if (!user) {
//       throw new Error('Unable to login')
//   }

//   const isMatch = await bcrypt.compare(password, user.password)

//   if (!isMatch) {
//       throw new Error('Unable to login')
//   }

//   return user
// }

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
