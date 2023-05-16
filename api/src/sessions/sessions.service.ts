import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class SessionsService {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  /**
   * create new session or retrieve session id in cookie
   * @returns sessionId
   */
  async createOrRetrieve() {
    // if not have session id in cookie then create new session
    if ((await this.getCurrentSession()) === null) {
      const headersReq = this.request.rawHeaders;
      const newCreateSession = new Session();
      const indexUserAgent = headersReq.findIndex(
        (item) => item === 'User-Agent',
      );
      newCreateSession.browser = headersReq[indexUserAgent + 1];
      newCreateSession.createdAt = new Date();
      newCreateSession.updatedAt = new Date();
      const newSession = await this.sessionRepository.save(newCreateSession);

      // create a cookie http only and max age is left hour of that day with the session id and return it

      const getSecondFromNowToMidnight = () => {
        const now = new Date();
        const midnight = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
          0,
          0,
          0,
        );
        return Math.floor((midnight.getTime() - now.getTime()) / 1000);
      };

      const cookie = `sessionId=${newSession.id}; HttpOnly; Max-Age=${getSecondFromNowToMidnight}; Secure SameSite=None; Path=/; Domain=${process.env.DOMAIN}`;

      // set cookie to response
      this.request.res.setHeader('Set-Cookie', cookie);
      return newSession.id;
    } else {
      return this.getCurrentSession();
    }
  }

  // findAll() {
  //   return `This action returns all sessions`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} session`;
  // }

  // update(id: number, updateSessionDto: UpdateSessionDto) {
  //   return `This action updates a #${id} session`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} session`;
  // }

  /**
   *
   * @returns sessionId or null
   */
  private async getCurrentSession() {
    // get sessionId in header request

    if (this.request.cookies) {
      const tokenObj = this.request.cookies as any;
      if (tokenObj.sessionId) {
        // if have sessionId in cookie then return it

        // check tokenArr in bd
        const existSession = await this.sessionRepository.findOne({
          where: { id: tokenObj.sessionId },
        });
        if (!existSession) {
          return null;
        }
        return tokenObj.sessionId;
      }
    }

    return null;

    // return this.sessionRepository.findOne(sessionId);
  }
}
