import mysql from 'mysql2';
import dotenv from 'dotenv';

//Configure the settings file
dotenv.config({path: './config.env'});

//Setup DB Pool Connection
 const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
}).promise();

//Retrieves all Jobs from database
export const getAllBookings = async() =>{
    const result = await pool.query(`
    SELECT bo.first_nm, bo.last_nm, bo.email, bo.activity_id , bo.activity_dt,
    bo.adlt_px , bo.child_px, bo.adlt_cost, bo.child_cost, act.name
    FROM activites act, bookings bo
    WHERE bo.activity_id = act.id
    `);
    const rows = result[0];
    return rows;
}

//Retrieves one single Job given an ID
export const getSingleBooking = async (id) =>{
    const result = await pool.query(`
    SELECT bo.first_nm, bo.last_nm, bo.email, bo.activity_id , bo.activity_dt,
    bo.adlt_px , bo.child_px, bo.adlt_cost, bo.child_cost, act.name
    FROM activites act, bookings bo
    WHERE bo.activity_id = act.id
    AND bo.id = ?
    `,[id]);
    const rows = result[0];
    return rows[0];
}

export const newBooking = async(oBooking) =>{
    const result = await pool.query(`
    INSERT INTO JOBS 
    (first_nm, last_nm, email, activity_id, activity_dt, adlt_px, child_px, adlt_cost, child_cost)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,[oBooking.first_nm, oBooking.last_nm, oBooking.activity_id,
    oBooking.activity_dt, oBooking.adlt_px, oBooking.child_px, 
    oBooking.adlt_cost, oBooking.child_cost ]);
    return result;       
}

export const updateJob = async(oJob) =>{
    const result = await pool.query(`
    UPDATE JOBS SET name =?, phone_nbr =?, license_nbr = ?, 
        vehicle_type_id = ?, make_id = ?, model =?, color =?, date =?
        WHERE id = ?
    `,[oJob.name, oJob.phone_nbr, oJob.license_nbr,
        oJob.vehicle_type_id, oJob.make_id, oJob.model, 
        oJob.color, oJob.date, oJob.id]);
    return result;       
}

export const getVehicleTypes = async() =>{
    const result = await pool.query(`
    SELECT  * FROM vehicle_types
    `);
    const rows = result[0];
    return rows;
}
export const getVehicleMakes = async() =>{
    const result = await pool.query(`
    SELECT  * FROM make
    `);
    const rows = result[0];
    return rows;
}

export const deleteJob = async (id)=>{
    const [rows] = await pool.query(`
    DELETE FROM JOBS
    WHERE id = ?;
    
    `,[id]);
    return rows[0];
    }
// const ret = await getAllJobs();
// const ret = await getSingleJob(2);
// console.log(ret);