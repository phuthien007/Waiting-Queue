import { DataSource, Repository } from 'typeorm';
import { Tenant } from './entities/tenants.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantsRepository extends Repository<Tenant> {
  constructor(private readonly dataSource: DataSource) {
    super(Tenant, dataSource.createEntityManager());
  }
}
