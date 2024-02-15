import express from 'express';
import { getAllBookings, getSingleBooking, newBooking } from '../data/database.js';
export const bookingRoute = express.Router();


bookingRoute.get('/Bookings',async(req,res) =>{
    const results = await getAllBookings();
    res.render('booking/booking-view', {data: results, title: "All Booking"});
});
