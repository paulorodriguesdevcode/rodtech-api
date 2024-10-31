import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { writeFile } from 'fs/promises';

export class UtilsService {
  static generateHash(value: string | undefined): string {
    if (!value) {
      throw new HttpException(
        'Não é possível encriptar um valor vazio!',
        HttpStatus.BAD_REQUEST,
      );
    }
    return bcrypt.hashSync(value, 10);
  }

  static async validateHash(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash || '');
  }

  static async saveBase64ToFile(
    fileName: string,
    base64Data: string,
  ): Promise<void> {
    await writeFile(fileName, base64Data, 'base64');
  }

  static generateUniqueFileName(id: string): string {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const formattedTime = currentDate
      .toTimeString()
      .slice(0, 8)
      .replace(/:/g, '');

    return `${id}-${formattedDate}-${formattedTime}`;
  }

  static formatToBRDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };

    return date.toLocaleString('pt-BR', { ...options }).replace(',', '');
  }

  static async saveSignatureAndReturnPath(
    signature: string,
    uniqueKey: string,
  ): Promise<string> {
    const base64Image = signature.split(';base64,').pop();

    if (!base64Image) {
      throw new HttpException(
        'Não foi possível identificar a imagem base64 da assinatura',
        HttpStatus.BAD_REQUEST,
      );
    }

    const fileName = UtilsService.generateUniqueFileName(uniqueKey);
    const fileWithPath = `./src/common/signatures/${fileName}.png`;

    await UtilsService.saveBase64ToFile(fileWithPath, base64Image);

    return fileWithPath;
  }
}
