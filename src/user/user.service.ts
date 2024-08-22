import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
   
   
    constructor(private prisma: PrismaService) {}

    async createUser(email: string, password: string, name: string, address?: string) {
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                throw new Error('Email address is already in use');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    address
                }
            });
            
            return newUser;

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new Error('Email address is already in use');
            }
            throw error; 
        }
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user;
    }

    async findAll() {
        return this.prisma.user.findMany();
    }
}