import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule, UserService, UserController } from '@app/user';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot/bot.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_NAME,
    }),
    MongooseModule.forFeature(),
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('BOT_TOKEN'),
      }),
    }),
    UserModule,
    // other module
  ],
  controllers: [UserController],
  providers: [UserService, BotService],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply() // add AuthMiddleware
      .exclude({
        path: 'user/profile',
        method: RequestMethod.GET,
      })
      .forRoutes('*');
  }
}
