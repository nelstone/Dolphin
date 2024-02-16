import express from 'express';
import morgan from 'morgan';
import { getActivity, getAllBookings, getSingleBooking, newBooking, deleteBooking, getSchedule } from './data/database.js';
import nodemailer from "nodemailer";
import session from 'express-session';
import bodyParser from 'body-parser';

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

app.post('/Dolphin-Cove/save-booking', async (req,res) =>{
  const bookingObject = new Object();

  bookingObject.first_nm = req.body.first_nm
  bookingObject.last_nm = req.body.last_nm
  bookingObject.email = req.body.email
  bookingObject.morning_sess_1 = req.body.schedule
  bookingObject.activities = req.body.name

  bookingObject.adlt_px = req.body.adlt_px
  bookingObject.child_px = req.body.child_px
  
  bookingObject.activity_dt = req.body.activity_dt

  const results = await newBooking(bookingObject);
  res.redirect('/Dolphin-Cove');
})



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



  var mailOptions = {
    from: firstname + ' ' + lastname,
    to: 'glassesdaniel@gmail.com',
    subject: `Booking for ${date} by ${firstname} ${lastname}`,
    text: `This is to confirm that ${firstname} is paying for a total of \n ${adults} Adults and ${children} Children. Activity chosen is ${activity} and is booked
          for ${schedule} on ${date}. See attachment below for receipt.`
  }
transporter.sendMail(mailOptions, function(error, info){
  if(error){
    console.log(error)
  }else{
    console.log("Email send: " + info.response)
  }
  res.redirect('/Dolphin-Cove');
})


});



// app.get('/', async(req, res) =>{
//     const results = await getAllJobs();
//     res.render('index', {data: results});
// });

// app.get('/job-view/:id', async (req,res)=>{
//     const id = req.params.id;
//     const result = await getSingleJob(id);
//     res.status(200).render("view-job", {data: result});
//     });

// //Route to display the form needed to create a new Job
// app.get('/create-job', async (req, res)=>{
//     const vTypes = await getVehicleTypes();
//     const vMakes = await getVehicleMakes();
//     res.render('create-job', {data: vTypes, make: vMakes});
// });

// app.get('/job-edit/:id', async(req, res)=>{
    
//     const id = req.params.id;
//     const vTypes = await getVehicleTypes();
//     const vMakes = await getVehicleMakes();
//     const result = await getSingleJob(id);

//     console.log(result.date)
//     //Convert DB Date to HTML Date
//     let vDate = new Date(result.date);
//     result.date = vDate.toISOString().split('T')[0];
    
//     res.render('edit-job', {data: result, v_type: vTypes, v_make: vMakes});
// });
// app.get('/job-delete/:id', async(req, res)=>{
    
//     const id = req.params.id;
//     const vTypes = await getVehicleTypes();
//     const vMakes = await getVehicleMakes();
//     const result = await getSingleJob(id);

//     console.log(result.date)
//     //Convert DB Date to HTML Date
//     let vDate = new Date(result.date);
//     result.date = vDate.toISOString().split('T')[0];
    
//     res.render('delete-job', {data: result, v_type: vTypes, v_make: vMakes});
// });


// //==================================================
// //          D B    A C T I O N S 
// //==================================================

// app.post('/save-job', async (req, res) =>{
   
//     const oJob = new Object();
//     oJob.name = req.body.name;
//     oJob.phone_nbr = req.body.phone_nbr;
//     oJob.license_nbr = req.body.license_nbr;
//     oJob.vehicle_type_id = req.body.vehicle_desc;
//     oJob.make_id = req.body.make_name;
//     oJob.model = req.body.model;
//     oJob.color = req.body.color;
//     oJob.date = new Date(req.body.date);

//     const result = await createJob(oJob);
//     res.redirect('/');
// });

// app.post('/update-job', async (req, res) =>{
//     const oJob = new Object();
//     oJob.name = req.body.name;
//     oJob.phone_nbr = req.body.phone_nbr;
//     oJob.license_nbr = req.body.license_nbr;
//     oJob.vehicle_type_id = req.body.vehicle_desc;
//     oJob.make_id = req.body.make_name;
//     oJob.model = req.body.model;
//     oJob.color = req.body.color;
//     oJob.date = new Date(req.body.date);
//     oJob.id = req.body.id;

//     const result = await updateJob(oJob);
//     res.redirect('/');
// });

// app.post('/delete-job', async (req, res) =>{
//     const id = req.body.id;
//     const retVal= await deleteJob(id);
//     res.redirect('/');
  
//   });


app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})