import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotels-repository';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';
import { Ticket, TicketType } from '@prisma/client';

async function getAllHotels(userId: number) {
  const enrollment = await verifyEnrollment(userId);

  const ticket = await verifyTicket(enrollment.id);

  await verifyPayment(ticket.id);
  verifyTicketType(ticket);
  const hotels = await hotelRepository.findHotels();
  return hotels;
}

async function getRoomsByHotelId(userId: number, hotelId: number) {
  const enrollment = await verifyEnrollment(userId);

  const ticket = await verifyTicket(enrollment.id);

  await verifyPayment(ticket.id);
  verifyTicketType(ticket);

  const rooms = hotelRepository.findRoomsByHotelId(hotelId);
  if (!rooms) throw notFoundError();
  return rooms;
}
async function verifyEnrollment(userId: number) {
  const enrollment = enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  return enrollment;
}

async function verifyTicket(enrollmentId: number) {
  const ticket = ticketRepository.findTicketByEnrollmentId(enrollmentId);

  if (!ticket) throw notFoundError();

  return ticket;
}

async function verifyPayment(ticketId: number) {
  const payment = paymentRepository.findPaymentByTicketId(ticketId);

  if (!payment) throw paymentRequiredError();

  return payment;
}

function verifyTicketType(ticket: Tickets) {
  if (ticket.TicketType.isRemote) {
    throw paymentRequiredError();
  }

  if (!ticket.TicketType.includesHotel) {
    throw paymentRequiredError();
  }
}
const hotelService = {
  getAllHotels,
  getRoomsByHotelId,
};
export type Tickets = Ticket & { TicketType: TicketType };
export default hotelService;
