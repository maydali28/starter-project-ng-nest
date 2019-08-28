import { Module } from "@nestjs/common";
import { DomainCoreModule } from "../core/domain-core.module";
import { AuthenticationRepo } from "./repo/authentication.repo";
import { MongooseModule } from "@nestjs/mongoose";
import { Authentication } from "./model/authentication.model";
import { FacebookAuthenticationService } from "./social/facebook/facebook-authentication.service";
import { FacebookClientService } from "./social/facebook/facebook-client.service";
import { FacebookProfileService } from "./social/facebook/facebook-profile.service";
import { DeprecatedAuthenticationCreateValidator } from "./validators/depricated-authentication-create.validator";

@Module({
    imports: [DomainCoreModule, MongooseModule.forFeature([{ name: Authentication.modelName, schema: Authentication.model.schema }])],
    providers: [
        AuthenticationRepo,
        FacebookClientService,
        FacebookProfileService,
        FacebookAuthenticationService,
        DeprecatedAuthenticationCreateValidator,
    ],
    exports: [AuthenticationRepo, FacebookAuthenticationService, FacebookProfileService, DeprecatedAuthenticationCreateValidator],
})
export class DomainAuthenticationModule { }