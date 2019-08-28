import {
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { BaseService } from '../../../domain/core/repo/repo.base';
import { ScopedEntityAuthCheck } from '../../../../shared/authchecks/scoped-entity.authcheck';
import { Authorization } from '../decorators/authorization.decorator';
import { CoreRequest } from '../types/core-request.contract';
import { ApiBearerAuth, ApiResponse, ApiImplicitParam } from '@nestjs/swagger';
import { RoleAuthCheck } from '../../../../shared/authchecks/role.authcheck';
import { Roles } from '@starter-project-ng-nest/core/global-contracts';
import {
  LabeledBaseModelVm,
  LabeledBaseModel
} from '@starter-project-ng-nest/core/global-contracts';
import { generateCode } from '../../../../utilities/codeGenerate';
/*
  Domain Service Hosted Endpoints are RESTful, with the following best-practice structure
  GET /items - Retrieves a list of items
  GET /items/12 - Retrieves a specific item
  POST /items - Creates a new item
  PUT /items/12 - Updates item #12
  PATCH /items/12 - Partially updates item #12
  DELETE /items/12 - Deletes item #12
*/

export abstract class LabeledControllerBase<
  T extends LabeledBaseModelVm,
  M extends LabeledBaseModel<M>
> {
  constructor(
    private readonly entityRepo: BaseService<M>,
    private readonly tag: string
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: `get Items`
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Get()
  @ApiBearerAuth()
  @Authorization([new ScopedEntityAuthCheck()])
  public async getItems(@Req() req: CoreRequest, @Body() body): Promise<T[]> {
    const entity = await this.entityRepo.findAll(body || {}, {
      accessPermissions: req.accessPermissions
    });
    return this.entityRepo.map<T[]>(entity.map(ent => ent.toJSON()));
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: `get Item by code`
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiImplicitParam({ name: 'code', type: String })
  @Get(':code')
  @ApiBearerAuth()
  @Authorization([new ScopedEntityAuthCheck()])
  public async getItem(
    @Req() req: CoreRequest,
    @Param('code') code: string
  ): Promise<T> {
    const entity = await this.entityRepo.findBycode(code, {
      accessPermissions: req.accessPermissions,
      skipCache: true
    });
    return this.entityRepo.map<T>(entity.toJSON());
  }

  @Post()
  @ApiBearerAuth()
  @Authorization([new RoleAuthCheck(Roles.staffAdmin)])
  public async create(@Req() req: CoreRequest, @Body() viewModel: T) {
    viewModel.code = generateCode(this.tag);
    while (
      (await this.entityRepo.findBycode(viewModel.code, {
        accessPermissions: req.accessPermissions
      })) !== null
    ) {
      viewModel.code = generateCode(this.tag);
    }
    const entity = this.entityRepo.createObject(viewModel);
    return this.entityRepo.create(entity, {
      accessPermissions: req.accessPermissions
    });
  }

  @Put()
  @ApiBearerAuth()
  @Authorization([new RoleAuthCheck(Roles.staffAdmin)])
  public async update(@Req() req: CoreRequest, @Body() viewModel: T) {
    const entity = this.entityRepo.createObject(viewModel);
    return this.entityRepo.update(entity, {
      accessPermissions: req.accessPermissions
    });
  }
  /*
        @Patch()
        @Authorization([new RoleAuthCheck(Roles.staffAdmin)])
        public async partialUpdate(@Req() req: CoreRequest, @Body() viewModel: Partial<T>) {
            return this.entityRepo.patch(entity, { accessPermissions: req.accessPermissions });
        }
    */

  @Delete(':code')
  @ApiBearerAuth()
  @ApiImplicitParam({ name: 'code', type: String })
  @Authorization([new RoleAuthCheck(Roles.staffAdmin)])
  public async delete(@Req() req: CoreRequest, @Param('code') code: string) {
    let viewModel: M = await this.entityRepo.findBycode(code, {
      accessPermissions: req.accessPermissions
    });
    return this.entityRepo.deletePermanently(viewModel._id.toHexString(), {
      accessPermissions: req.accessPermissions
    });
  }
}
