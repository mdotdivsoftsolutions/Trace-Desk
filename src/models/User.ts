import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'super_admin' | 'admin' | 'employee' | 'client';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phoneNumber?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  hashPassword(password: string): Promise<string>;
  seedSuperAdmin(): Promise<IUserDocument>;
}

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'employee', 'client'],
      default: 'employee',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
      index: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      index: true,
    },
    resetPasswordExpires: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password against bcrypt hash
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

// Static helper to hash passwords
UserSchema.statics.hashPassword = async function (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Static helper to ensure Super Admin exists on startup
UserSchema.statics.seedSuperAdmin = async function (): Promise<IUserDocument> {
  const superAdminEmail = 'manum66466@gmail.com';
  let user = await this.findOne({ email: superAdminEmail });

  const defaultPassword = 'Manumanoj$14';
  const defaultName = 'Manu .M (M.Div SoftSolutions )';

  if (!user) {
    const passwordHash = await this.hashPassword(defaultPassword);
    user = await this.create({
      name: defaultName,
      email: superAdminEmail,
      passwordHash,
      role: 'super_admin',
      status: 'active',
    });
    console.log(`[Auth] Seeded default Super Admin user: ${superAdminEmail}`);
  }

  return user;
};

export const User: IUserModel =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default User;
