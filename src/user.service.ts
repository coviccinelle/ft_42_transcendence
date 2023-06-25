import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { User, Prisma } from "@prisma/client";

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	
}
