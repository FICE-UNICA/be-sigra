import { IsNotEmpty, IsString } from "class-validator";


export class LoginUserDto {
    @IsString()
    @IsNotEmpty({message:"No puede estar vacio este campo"})
    username: string;

    @IsString()
    @IsNotEmpty({message:"No puede estar vacio este campo"})
    password: string
}