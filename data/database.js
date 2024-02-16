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
    FROM activities act, bookings bo
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
    FROM activities act, bookings bo
    WHERE bo.activity_id = act.id
    AND bo.id = ?
    `,[id]);
    const rows = result[0];
    return rows[0];
}

export const newBooking = async(oBooking) =>{
    const result = await pool.query(`
    INSERT INTO bookings 
    (first_nm, last_nm, email, activity_id, activity_dt, adlt_px, child_px, adlt_cost, child_cost)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,[oBooking.first_nm, oBooking.last_nm, oBooking.activity_id,
    oBooking.activity_dt, oBooking.adlt_px, oBooking.child_px, 
    oBooking.adlt_cost, oBooking.child_cost ]);
    return result;       
}

export const updateBooking = async(oJob) =>{
    const result = await pool.query(`
    UPDATE bookings 
    SET first_nm = ?, last_nm = ?, email = ?, 
    activity_dt = ?, adlt_px = ?, child_px = ?, adlt_cost = ?, child_cost
    WHERE id = ?
    `,[oBooking.first_nm, oBooking.last_nm, oBooking.activity_id,
    oBooking.activity_dt, oBooking.adlt_px, oBooking.child_px, 
    oBooking.adlt_cost, oBooking.child_cost, oBooking.id]);
    return result;       
}

export const getActivity = async() =>{
    const result = await pool.query(`
    SELECT act.id, act.name
    FROM activities act
    ORDER BY act.name
    `);
    const rows = result[0];
    return rows;
}
export const getSchedule = async() =>{
    const result = await pool.query(`
    SELECT skd.id, skd.morning_sess_1
    FROM schedule_list skd
    ORDER BY skd.morning_sess_1
    `);
    const rows = result[0];
    return rows;
}

export const deleteBooking = async (id)=>{
    const [rows] = await pool.query(`
    DELETE FROM bookings
    WHERE id = ?;
    
    `,[id]);
    return rows[0];
    }
