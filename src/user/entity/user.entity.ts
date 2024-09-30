import { TimeEnum } from '@app/enum/time.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { BaseEntity } from '@app/common/entity/base-entity.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends BaseEntity {
  @Prop({ required: true, unique: true, index: true })
  telegram_id: number;

  @Prop({ required: false })
  username: string;

  @Prop({ required: false })
  first_name: string;

  @Prop({ required: false })
  last_name: string;

  @Prop({ required: false })
  language_code?: string;

  @Prop({ required: false })
  is_premium: boolean;

  @Prop({ default: null, required: false })
  avatar?: string;

  @Prop({ required: false, unique: true })
  ref_code?: string;

  @Prop({ default: null, required: false })
  ref_by?: number;

  @Prop({ default: 0 })
  ref_claimable: number;

  @Prop({ default: 0 })
  current_point: number;

  @Prop({ default: 0 })
  total_point: number;

  @Prop({ default: false })
  isBlock: boolean;

  @Prop({ default: false })
  isDelete: boolean;

  @Prop({ default: 1000 })
  point_per_hour: number;

  @Prop({ default: TimeEnum.TWO_HOUR })
  max_mine_hour: number;

  @Prop({ default: null })
  last_synced_point: Date;

  @Prop({ default: 0 })
  total_ref_count: number;

  @Prop({ default: 0 })
  total_ref_point: number;

  @Prop({ default: 0 })
  checkin_streak: number;

  @Prop({ required: false })
  last_checkin: Date;

  @Prop({ default: 0 })
  total_checkin: number;

  @Prop({ default: 1 })
  user_level: number;

  @Prop({ required: false })
  wallet_address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongooseAggregatePaginate);
