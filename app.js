import express from 'express';
import morgan from 'morgan';
import { getActivity, getAllBookings, getSingleBooking, newBooking, deleteBooking, getSchedule } from './data/database.js';
import nodemailer from "nodemailer";
import Handlebars from 'handlebars';
import session from 'express-session';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
import {bookingRoute} from './routes/bookingRoute.js'
app.use("/Bookings", bookingRoute)


const port = 5555

//Middleware Section
app.use(morgan('dev'));

app.set("view engine", "ejs");

app.use(bodyParser.json());
//Needed to interpret form field values from post
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: "secret key",
  resave: false,
  saveUninitialized: true,
  cookie:{
      maxAge:600000
  }
}));


//==================================================
//          P A G E    V I E W S 
//==================================================

//Default route showing list of Jobs
app.get('/Dolphin-Cove', async(req, res) =>{
  const results = await getActivity();
  const bookings = await getAllBookings();
  const skd = await getSchedule();
  res.render('Dolphin-Cove',{data: results, skdData: skd, bookingData: bookings, title:"DOLPHIN COVE"} );
});


// ========================ACTION ROUTE==========================

// app.post('/Dolphin-Cove/save-booking', async (req,res) =>{
//   const bookingObject = new Object();

//   bookingObject.first_nm = req.body.first_nm
//   bookingObject.last_nm = req.body.last_nm
//   bookingObject.email = req.body.email
//   bookingObject.morning_sess_1 = req.body.schedule
//   bookingObject.activities = req.body.name

//   bookingObject.adlt_px = req.body.adlt_px
//   bookingObject.child_px = req.body.child_px
  
//   bookingObject.activity_dt = req.body.activity_dt

//   const results = await newBooking(bookingObject);
//   res.redirect('/Dolphin-Cove');
// })



// ACTION TO ACCEPT AND SEND EMAIL
app.post('/send_booking', async (req,res) => {

  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let schedule = req.body.schedule;
  let activity = req.body.activity;
  let adults = req.body.totalAdults;
  let children = req.body.totalChildren;
  let date = req.body.date;

  var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "dd3e3f884bfedc",
      pass: "449360dfb638cc"
    }
  });

  const source = fs.readFileSync('email_template.html', 'utf-8').toString();
  const template = Handlebars.compile(source);
  const replacement = {
    fullName: firstname +' '+ lastname,
    email: email,
    schedule: schedule,
    activity: activity,
    adults: adults,
    children: children,
    date: date
  }
  const htmlToSend = template(replacement);
  var mailOptions = {
    from: firstname + ' ' + lastname,
    to: 'glassesdaniel@gmail.com',
    subject: `Booking for ${date} by ${firstname} ${lastname}`,
    text: 'Hello world',
    html: htmlToSend
  }
transporter.sendMail(mailOptions, function(error, info){
  if(error){
    console.log(error)
  }else{
    console.log("Email send: " + info.response)
  }
  res.redirect('/Dolphin-Cove');
})

const bookingObject = new Object();

  bookingObject.first_nm = req.body.firstname
  bookingObject.last_nm = req.body.lastname
  bookingObject.email = req.body.email
  bookingObject.activity_id = req.body.activity 
  bookingObject.morning_sess_1 = req.body.schedule

  bookingObject.adlt_px = req.body.totalAdults
  bookingObject.child_px = req.body.totalChildren
  
  bookingObject.activity_dt = req.body.date

  const results = await newBooking(bookingObject);

});



app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})