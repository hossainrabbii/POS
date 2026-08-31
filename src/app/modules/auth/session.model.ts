import { Schema, model, Types } from "mongoose";

export interface ISession {
  userId: Types.ObjectId;
  refreshToken: string;
  expiresAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

sessionSchema.index(
  { expiresAt: 1 },
  {
    expireAfterSeconds: 0,
  },
);

export const Session = model<ISession>("Session", sessionSchema);
