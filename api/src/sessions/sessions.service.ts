import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';

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
    if (this.getCurrentSession() === null) {
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
      const date = new Date();
      const maxAge =
        24 * 60 * 60 * 1000 -
        (date.getHours() * 60 * 60 * 1000 +
          date.getMinutes() * 60 * 1000 +
          date.getSeconds() * 1000);
      const cookie = `sessionId=${newSession.id}; HttpOnly; Max-Age=${maxAge}; Path=/; SameSite=None; Secure`;

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
    const headersReq = this.request.rawHeaders;
    const indexCookie = headersReq.findIndex((item) => item === 'Cookie');
    const tokenArr = headersReq[indexCookie + 1]
      .split(';')
      .map((item) => item.split('='));
    const indexSessionId = tokenArr.findIndex(
      (item) => item[0].trim() === 'sessionId',
    );

    // if have sessionId in cookie then return it
    if (tokenArr[indexSessionId][1]) {
      // check tokenArr in bd
      const existSession = await this.sessionRepository.findOne({
        where: { id: tokenArr[indexSessionId][1] },
      });
      if (!existSession) {
        return null;
      }
      return tokenArr[indexSessionId][1];
    }

    return null;

    // return this.sessionRepository.findOne(sessionId);
  }
}
