import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as crypto from 'crypto';
import { writeFile } from 'fs/promises';
import path, { extname, join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileService {
    async upload(user: User, file: Express.Multer.File, storagePath: string) {
        const fileName = await this.createNameFile(file, user);
        const fileExtension = await extname(file.originalname);
        const path = await join(storagePath, `${fileName}${fileExtension}`);

        writeFile(path, file.buffer);

        return path;
    }

    async createNameFile(file: Express.Multer.File, user: User): Promise<string> {
        const algorithm = 'aes-256-cbc';
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
    
        const fileName: string = this.encryptFileName(file.originalname, algorithm, key, iv);
    
        return fileName+'-'+user.id;
    }

    encryptFileName(nameFile: string, algorithm: any, key: any, iv: any): string {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(nameFile, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return `${encrypted}_${iv.toString('hex')}`;
    }

    async delete(files: string[]): Promise<void> {
        const deletePromises = files.map(async (filePath) => {
            try {
                await fs.unlink(path.resolve(filePath));
            } catch (error) {
                console.error(`Error deleting file ${filePath}: `, error);
            }
        });

        await Promise.all(deletePromises);
    }
}
