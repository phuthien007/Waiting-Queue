import { DataSource, Repository } from 'typeorm';
import { Tenant } from './entities/tenants.entity';
import { Injectable } from '@nestjs/common';

/**
 * TenantsRepository class for tenant repository
 */
@Injectable()
export class TenantsRepository extends Repository<Tenant> {
  constructor(private readonly dataSource: DataSource) {
    super(Tenant, dataSource.createEntityManager());
  }
}
