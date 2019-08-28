import 'automapper-ts/dist/automapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MapperService {
  mapper: AutoMapperJs.AutoMapper;

  private static configure(config: AutoMapperJs.IConfiguration): void {
    config
      .createMap('UserModel', 'LocalRegisterMv')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('code', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Todo', 'TodoVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Todo[]', 'TodoVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Client', 'ClientVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Client[]', 'ClientVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Writer', 'WriterVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Writer[]', 'WriterVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Language', 'LanguageVm')
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Language[]', 'LanguageVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Language', 'LanguageResponse')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('updatedAt', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('BaseModel', 'CommunResponse')
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('updatedAt', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Theme', 'ThemeVm')
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Theme[]', 'ThemeVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Avatar', 'AvatarVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Avatar[]', 'AvatarVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Tone', 'ToneVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Tone[]', 'ToneVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Tone', 'ToneResponse')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Criterion', 'CriterionVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Criterion[]', 'CriterionVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Target', 'TargetVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Target[]', 'TargetVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Target', 'TargetResponse')
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('updatedAt', opts => opts.ignore())
      .forSourceMember('createdAt', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Topic', 'TopicVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Topic[]', 'TopicVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Service', 'ServiceVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Service[]', 'ServiceVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Format', 'FormatVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Format[]', 'FormatVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Project', 'ProjectVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Project[]', 'ProjectVm[]')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Bid', 'BidVm')
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore())
      .forSourceMember('isDeleted', opts => opts.ignore());

    config
      .createMap('Bid[]', 'BidVm[]')
      .forSourceMember('isDeleted', opts => opts.ignore())
      .forSourceMember('_id', opts => opts.ignore())
      .forSourceMember('id', opts => opts.ignore());

  }
  constructor() {
    this.mapper = automapper;
    this.initializeMapper();
  }
  private initializeMapper(): void {
    this.mapper.initialize(MapperService.configure);
  }
}
