import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide Your Name"],
    },
    email: {
      type: String,
      validate: validator.isEmail,
      required: [true, "Please Provide Your Email"],
      unique: [true, "this email is used, please login"],
    },
    password: {
      type: String,
      required: [
        function () {
          return !this.googleId || !this.facebookId;
        },
        "Please Provide Your Password",
      ],
      minlength: 8,
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [
        function () {
          return !this.googleId || !this.facebookId;
        },
        "Please Provide Your passwordConfirm",
      ],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: `Your Password and PasswordConfirm Doesn't match`,
      },
    },
    photo: {
      type: String,
      default: "user-default.png",
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user", "doctor"],
    },
    lastLogin: { type: Date },
    passwordResetToken: String,
    passwordResetTokenExpiresIn: Date,
    googleId: { type: String },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

userSchema.virtual("sessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "user",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createResetToken = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  const encryptedToken = crypto.createHash("sha256").update(token).digest("hex");

  user.passwordResetToken = encryptedToken;
  user.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });
  return token;
};

userSchema.pre(/^find/, function (next) {
  this.populate("sessions");
  next();
});
userSchema.methods.comparePassword = async function (inputedPass) {
  return bcrypt.compare(inputedPass, this.password);
};

const User = mongoose.model("User", userSchema);
export { userSchema };
export default User;
