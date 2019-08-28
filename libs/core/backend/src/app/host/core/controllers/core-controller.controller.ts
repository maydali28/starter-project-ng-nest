import { Body, Delete, Get, Param, Post, Put, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { BaseService } from '../../../domain/core/repo/repo.base';
import { ScopedEntityAuthCheck } from '../../../../shared/authchecks/scoped-entity.authcheck';
import { Authorization } from '../decorators/authorization.decorator';
import { CoreRequest } from '../types/core-request.contract';
import { BaseModelVm, BaseModel } from '@starter-project-ng-nest/core/global-contracts';
import { ApiBearerAuth, ApiResponse, ApiImplicitParam } from '@nestjs/swagger';
/*
  Domain Service Hosted Endpoints are RESTful, with the following best-practice structure
  GET /items - Retrieves a list of items
  GET /items/12 - Retrieves a specific item
  POST /items - Creates a new item
  PUT /items/12 - Updates item #12
  PATCH /items/12 - Partially updates item #12
  DELETE /items/12 - Deletes item #12
*/

export abstract class DomainControllerBase<T extends BaseModelVm, M extends BaseModel<M>> {

    constructor(private readonly entityRepo: BaseService<M>) {

    }

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
        const entity = await this.entityRepo.findAll(body || {}, { accessPermissions: req.accessPermissions, skipCache: true });
        return this.entityRepo.map<T[]>(entity.map(ent => ent.toJSON()));
    }

    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: `get Item by code`
    })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiImplicitParam({ name: 'id', type: String })
    @Get(':id')
    @ApiBearerAuth()
    @Authorization([new ScopedEntityAuthCheck()])
    public async getItem(@Req() req: CoreRequest, @Param('id') id: string): Promise<T> {
        const entity = await this.entityRepo.findById(id, { accessPermissions: req.accessPermissions });
        return this.entityRepo.map<T>(entity.toJSON());
    }

    @Post()
    @ApiBearerAuth()
    @Authorization([new ScopedEntityAuthCheck()])
    public async create(@Req() req: CoreRequest, @Body() viewModel: T) {
        const entity = this.entityRepo.createObject(viewModel);
        return this.entityRepo.create(entity, { accessPermissions: req.accessPermissions });
    }

    @Put()
    @ApiBearerAuth()
    @Authorization([new ScopedEntityAuthCheck()])
    public async update(@Req() req: CoreRequest, @Body() viewModel: T) {
        const entity = this.entityRepo.createObject(viewModel);
        return this.entityRepo.update(entity, { accessPermissions: req.accessPermissions });
    }
    /*
        @Patch()
        @Authorization([new ScopedEntityAuthCheck()])
        public async partialUpdate(@Req() req: CoreRequest, @Body() viewModel: Partial<T>) {
            return this.entityRepo.patch(entity, { accessPermissions: req.accessPermissions });
        }
    */

    @Delete()
    @ApiBearerAuth()
    @Authorization([new ScopedEntityAuthCheck()])
    public async delete(@Req() req: CoreRequest, @Param('id') id) {
        return this.entityRepo.deletePermanently(id, { accessPermissions: req.accessPermissions });
    }
}
