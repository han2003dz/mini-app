import { Injectable } from '@nestjs/common';
import { Start, Update, Ctx, On } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { Context } from 'telegraf';
import * as ExcelJS from 'exceljs';
import { Readable } from 'stream';
import fetch from 'node-fetch';
@Injectable()
@Update()
export class BotService {
  constructor(private configService: ConfigService) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('welcome to the bot! Use /admin to check admin');
  }

  @On('text')
  async handleText(@Ctx() ctx: Context) {
    const message = ctx.message;

    if ('text' in message) {
      const text = message.text;

      const isAdmin = await this.checkAdmin(message.from.id);
      switch (text) {
        case '/admin':
          if (isAdmin) {
            await ctx.reply(
              'You are an admin. You can upload files now using /upload.',
            );
          } else {
            await ctx.reply('You are not an admin.');
          }
          break;

        case '/upload':
          if (isAdmin) {
            await ctx.reply('Please upload your file now.');
          } else {
            await ctx.reply(
              'You need to be authenticated as admin to upload files. Use /admin first.',
            );
          }
          break;

        default:
          await ctx.reply('Unknown command.');
          break;
      }
    } else {
      await ctx.reply('This is not a text message.');
    }
  }

  @On('document')
  async onDocument(@Ctx() ctx: Context) {
    const adminTelegramId = this.configService.get<string>('TELEGRAM_ADMIN_ID');
    const message = ctx.message;
    if ('document' in message) {
      if (message.from.id.toString() === adminTelegramId) {
        const fileId = message.document.file_id;
        const fileLink = await ctx.telegram.getFileLink(fileId);

        const response = await fetch(fileLink.href);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await this.readExcel(buffer);

        await ctx.reply('File uploaded and processed successfully.');
        await ctx.reply(JSON.stringify(data));
        console.log('data', data);
      } else {
        await ctx.reply('Only authenticated admin can upload files.');
      }
    }
  }

  private async readExcel(buffer: Buffer): Promise<any[]> {
    const workbook = new ExcelJS.Workbook();
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    await workbook.xlsx.read(stream);

    const worksheet = workbook.getWorksheet(1);
    const rows = [];
    worksheet.eachRow((row) => {
      if (Array.isArray(row.values)) {
        const rowData = row.values.slice(1);
        rows.push(rowData);
      }
    });

    return rows;
  }

  private async checkAdmin(telegramId: number): Promise<boolean> {
    const adminId = parseInt(process.env.TELEGRAM_ADMIN_ID);
    return telegramId === adminId;
  }
}
