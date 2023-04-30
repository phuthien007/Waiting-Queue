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
import { deepStringToObject } from './common';

// TODO: add pagination
/**
 * Filter operator class for filter operator in query string
 */
export class FilterOperator {
  /**
   * Equal operator (eq)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  eq: string[];

  /**
   * Not equal operator (ne)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  ne: string[];

  /**
   * Greater than operator (gt)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  gt: string[];

  /**
   * Greater than or equal operator (gte)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  gte: string[];

  /**
   * Less than operator (lt)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  lt: string[];

  /**
   * Less than or equal operator (lte)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  lte: string[];

  /**
   * In operator (in)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  in: string[];

  /**
   * Not in operator (notIn)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  notIn: string[];

  /**
   * Like operator (like)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
  like: string[];

  /**
   * Not like operator (notLike)
   */
  @ApiPropertyOptional({ type: [String] })
  // @Optional()
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

  /**
   * Transform filter operator to query object
   * @returns  query object for typeorm query builder
   * @example
   * const filter = new FilterOperator();
   * filter.eq = ['name:John'];
   * filter.gt = ['age:20'];
   * filter.transformToQuery();
   * // return { name: Equal('John'), age: MoreThan('20') }
   *
   */
  public transformToQuery() {
    const query = {};
    // check if eq operator has value then transform to query object
    if (this.eq.length > 0) {
      this.eq.forEach((item) => {
        // split value to key and value with the first character is ':'
        const valuesTransform = deepStringToObject(item, Equal);
        query[Object.keys(valuesTransform)[0]] =
          Object.values(valuesTransform)[0];
      });
    }

    // check if ne operator has value then transform to query object
    if (this.ne.length > 0) {
      this.ne.forEach((item) => {
        const valuesTransform = deepStringToObject(item, NotEquals);
        query[Object.keys(valuesTransform)[0]] =
          Object.values(valuesTransform)[0];
      });
    }

    // check if gt operator has value then transform to query object
    if (this.gt.length > 0) {
      this.gt.forEach((item) => {
        const valuesTransform = deepStringToObject(item, MoreThan);
        query[Object.keys(valuesTransform)[0]] =
          Object.values(valuesTransform)[0];
      });
    }

    // check if gte operator has value then transform to query object
    if (this.gte.length > 0) {
      this.gte.forEach((item) => {
        const valuesTransform = deepStringToObject(item, MoreThanOrEqual);
        query[Object.keys(valuesTransform)[0]] =
          Object.values(valuesTransform)[0];
      });
    }

    // check if lt operator has value then transform to query object
    if (this.lt.length > 0) {
      this.lt.forEach((item) => {
        const valuesTransform = deepStringToObject(item, LessThan);
        query[Object.keys(valuesTransform)[0]] =
          Object.values(valuesTransform)[0];
      });
    }

    // check if lte operator has value then transform to query object
    if (this.lte.length > 0) {
      this.lte.forEach((item) => {
        const valuesTransform = deepStringToObject(item, LessThanOrEqual);
        query[Object.keys(valuesTransform)[0]] =
          Object.values(valuesTransform)[0];
      });
    }

    //  check if in operator has value then transform to query object
    if (this.in.length > 0) {
      this.in.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = In([...value.split(',')]);
      });
    }

    // check if notIn operator has value then transform to query object
    if (this.notIn.length > 0) {
      this.notIn.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = IsNotIn([...value.split(',')]);
      });
    }

    // check if like operator has value then transform to query object
    if (this.like.length > 0) {
      this.like.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = Like(`%${value}%`);
      });
    }

    // check if notLike operator has value then transform to query object
    if (this.notLike.length > 0) {
      this.notLike.forEach((item) => {
        const [key, value] = item.split(':');
        query[key] = ILike([Like(`%${value}%`)]);
      });
    }

    return query;
  }

  /**
   * Add operator to filter operator object
   * @param operator  operator name
   * @param value  value of operator
   * @example
   * const filter = new FilterOperator();
   * filter.addOperator('eq', 'name:John');
   * filter.addOperator('gt', 'age:20');
   * filter.transformToQuery();
   * // return { name: Equal('John'), age: MoreThan('20') }
   */
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
