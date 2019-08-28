import { Module } from "@nestjs/common";
import { DomainCoreModule } from "../core/domain-core.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User } from "./model/user.model";
import { UserRepo } from "./repo/user.repo";

@Module({
    imports: [DomainCoreModule, MongooseModule.forFeature([{ name: User.modelName, schema: User.model.schema }])],
    providers: [UserRepo],
    exports: [UserRepo]
})
export class DomainUserModule { }