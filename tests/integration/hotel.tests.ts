import app, { init } from '@/app';
import { disconnectDB } from '@/config';
import faker from '@faker-js/faker';
import { TicketStatus, TicketType } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createUser,
  createEnrollmentWithAddress,
  createTicket,
  createTicketTypeWithParams,
  createHotel,
  createTicketType,
  createRoom,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
