import { Response } from 'express';
import hotelService from '@/services/hotels-service';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';

export async function getAllHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const hotel = await hotelService.getAllHotels(userId);

    res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === 'PaymentRequired') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params.hotelId);

  if (!hotelId || isNaN(hotelId)) return res.sendStatus(httpStatus.BAD_REQUEST);
  try {
    const rooms = await hotelService.getRoomsByHotelId(userId, hotelId);
    res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === 'PaymentRequired') {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
