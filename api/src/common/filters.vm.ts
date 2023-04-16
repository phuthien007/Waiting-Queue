// mapping object with entity

import {
  Equal,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
} from 'typeorm';
import { OperatorQueryEnum } from './enum';
import { IsNotIn, NotEquals } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class FilterOperator {
  @ApiPropertyOptional()
  @Optional()
  eq: string[];

  @ApiPropertyOptional()
  @Optional()
  ne: string[];
  @ApiPropertyOptional()
  @Optional()
  gt: string[];
  @ApiPropertyOptional()
  @Optional()
  gte: string[];
  @ApiPropertyOptional()
  @Optional()
  lt: string[];
  @ApiPropertyOptional()
  @Optional()
  lte: string[];
  @ApiPropertyOptional()
  @Optional()
  in: string[];
  @ApiPropertyOptional()
  @Optional()
  notIn: string[];

  @ApiPropertyOptional()
  @Optional()
  like: string[];
  @ApiPropertyOptional()
  @Optional()
  notLike: string[];

  constructor() {
    this.eq = [];
    this.ne = [];
    this.gt = [];
    this.gte = [];
    this.lt = [];
    this.lte = [];
    this.in = [];
    this.notIn = [];
    this.like = [];
    this.notLike = [];
  }

  public transformToQuery() {
    const query = {};
    if (this.eq.length > 0) {
      this.eq.forEach((item) => {
        // split value to key and value with the first character is ':'
        const [key, value] = item.split(':');
        query[key] = Equal(value);
      });
    }

    if (this.ne.length > 0) {
      this.ne.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = NotEquals(value);
      });
    }

    // transform all operator to query

    if (this.gt.length > 0) {
      this.gt.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = MoreThan(value);
      });
    }

    if (this.gte.length > 0) {
      this.gte.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = MoreThanOrEqual(value);
      });
    }

    if (this.lt.length > 0) {
      this.lt.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = LessThan(value);
      });
    }

    if (this.lte.length > 0) {
      this.lte.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = LessThanOrEqual(value);
      });
    }

    if (this.in.length > 0) {
      this.in.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = In([...value.split(',')]);
      });
    }

    if (this.notIn.length > 0) {
      this.notIn.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = IsNotIn([...value.split(',')]);
      });
    }

    if (this.like.length > 0) {
      this.like.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = Like(`%${value}%`);
      });
    }

    if (this.notLike.length > 0) {
      this.notLike.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = ILike([Like(`%${value}%`)]);
      });
    }

    return query;
  }

  public addOperator(operator: string, value: string) {
    switch (operator) {
      case OperatorQueryEnum.eq:
        this.eq.push(value);
        break;
      case OperatorQueryEnum.ne:
        this.ne.push(value);
        break;
      case OperatorQueryEnum.gt:
        this.gt.push(value);
        break;
      case OperatorQueryEnum.gte:
        this.gte.push(value);
        break;
      case OperatorQueryEnum.lt:
        this.lt.push(value);
        break;
      case OperatorQueryEnum.lte:
        this.lte.push(value);
        break;
      case OperatorQueryEnum.in:
        this.in.push(value);
        break;
      case OperatorQueryEnum.notIn:
        this.notIn.push(value);
        break;

      case OperatorQueryEnum.like:
        this.like.push(value);
        break;
      case OperatorQueryEnum.notLike:
        this.notLike.push(value);
        break;
      default:
        break;
    }
  }

  //   public getOperator(operator: string) {
  //     switch (operator) {
  //       case OperatorQueryEnum.eq:
  //         return this.eq;
  //       case OperatorQueryEnum.ne:
  //         return this.ne;
  //       case OperatorQueryEnum.gt:
  //         return this.gt;
  //       case OperatorQueryEnum.gte:
  //         return this.gte;
  //       case OperatorQueryEnum.lt:
  //         return this.lt;
  //       case OperatorQueryEnum.lte:
  //         return this.lte;
  //       case OperatorQueryEnum.in:
  //         return this.in;
  //       case OperatorQueryEnum.notIn:
  //         return this.notIn;
  //       case OperatorQueryEnum.isNull:
  //         return this.isNull;
  //       case OperatorQueryEnum.isNotNull:
  //         return this.isNotNull;
  //       case OperatorQueryEnum.like:
  //         return this.like;
  //       case OperatorQueryEnum.notLike:
  //         return this.notLike;
  //       default:
  //         break;
  //     }
  //   }
}
