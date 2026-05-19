import { IsEnum, IsOptional, IsString } from "class-validator"

export class CreateFormDto {
    @IsString()
    schema!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    name!: string;

    @IsString()
    slug!: string;

    @IsEnum(["draft", "published"])
    status!: "draft" | "published";

    @IsEnum(["public", "private"])
    visibility!: "public" | "private";
}