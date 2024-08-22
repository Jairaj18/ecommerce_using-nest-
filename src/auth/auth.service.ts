import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; // Assuming correct import path
import { AuthDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcryptjs';
import { NodemailerService } from './email.services'; // Assuming correct import path
import { Role } from '@prisma/client';
import { sendMailDto } from './dto/sendMail.dto';
import * as jwt from 'jsonwebtoken';
import { ResetPasswordDto } from './dto/reset-Password.dto';

@Injectable()
export class AuthService {
   
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private nodemailerService: NodemailerService,
    ) {}

    async signUp(authDto: AuthDto, res: any): Promise<void> {
        const { email, password, name, address } = authDto;
        
        try {
            const user = await this.userService.createUser(email, password, name, address);
            await this.nodemailerService.sendWelcomeEmail(email, name); 
            
            return res.status(201).json({ message: 'Signup successful', user });

        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    async signIn(authDto: AuthDto): Promise<{ accessToken: string; user: any }> {
        const { email, password } = authDto;

        try {
            const user = await this.userService.findByEmail(email);

            if (user && await bcrypt.compare(password, user.password)) {
                const payload = { email, role: user.role };
                const accessToken = await this.jwtService.sign(payload);
                
                return {
                    accessToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        address: user.address,
                        role: user.role,
                    },
                };
            } else {
                throw new UnauthorizedException('Invalid credentials');
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
    async sendMail(sendMailDto: sendMailDto, res: any): Promise<void> {
        const { email } = sendMailDto;

        try {
            const user = await this.userService.findByEmail(email);

            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }

            const secret = user.id + process.env.JWT_SECRET; // Combine with user-specific data for better security
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '5m' });
            const resetLink = `http://localhost:3000/reset-password/${user.id}/${token}`;

            const mailer = await this.nodemailerService.sendEmailToChangePassword(email, resetLink);
            console.log(mailer); 
            res.json({
                message:"Password reset email sent successfully"
            })

        } catch (error) {
            console.error('Error sending password reset email:', error);
            throw error;
        }
    }

    resetPassword(id: string, token: string, resetPasswordDto: ResetPasswordDto) {
        // const {password,confirm_password} = resetPasswordDto;

        // if(password != confirm_password){
        //     throw new Error('Password do not match');
        // }

        // try{
        //     const decodeToken:any = jwt.verify(token, process.env.JWT_SECRET);
        //     if(decodeToken.id !== id){
        //         throw new Error('Invalid token');
        //     }
        // }catch(error){
        //     throw new Error('Invalid or expired token');
        // }

        // const user = await this.userService.findById(id);
        // if(!user){
        //     throw new Error("user not found");
        // }

        // user.password = await bcrypt.hash(password,10);
        // await this.userService.save(user);
        // }
}
}