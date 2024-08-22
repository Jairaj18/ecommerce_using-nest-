import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth-credentials.dto';
import { sendMailDto } from './dto/sendMail.dto';
import { ResetPasswordDto } from './dto/reset-Password.dto';


@Controller('auth')
export class AuthController {
    constructor(private authServise:AuthService){}

    @Post('/signup')
    async signUp(@Body() AuthDto:AuthDto , @Res() res): Promise<void>{
        return await this.authServise.signUp(AuthDto,res);
    }

    @Post('/signin')
    async  signIn(@Body() AuthDto:AuthDto): Promise<{accessToken: string}>{
        return this.authServise.signIn(AuthDto);
    }

    @Post('/sendEmailToChangePassword')
    async sendEmailToChangePassword(@Body() sendMailDto: sendMailDto, @Res() res) {
        return this.authServise.sendMail(sendMailDto, res);
    }

    @Post('/resetPassword')
    async resetPassword( 
        @Param('id') id: string,
        @Param('token') token: string,
        @Body() resetPasswordDto: ResetPasswordDto,
        @Res() res: Response) {
            return await this.authServise.resetPassword(id, token, resetPasswordDto);
        }
}

