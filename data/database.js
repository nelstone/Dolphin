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
export const getAllJobs = async() =>{
    const result = await pool.query(`
    SELECT  jb.id, jb.name, jb.phone_nbr, jb.license_nbr, vt.vehicle_desc, mk.name as make_name, 
    jb.model, jb. color, jb.date
    FROM JOBS jb, VEHICLE_TYPES vt, MAKE mk
    WHERE jb. vehicle_type_id  = vt.id
    AND jb.make_id = mk.id
    `);
    const rows = result[0];
    return rows;
}

//Retrieves one single Job given an ID
export const getSingleJob = async (id) =>{
    const result = await pool.query(`
    SELECT  jb.id, jb.name, jb.phone_nbr, jb.license_nbr, jb.vehicle_type_id, 
    vt.vehicle_desc, jb.make_id, mk.name as make_name, jb.model, jb. color, jb.date
    FROM JOBS jb, VEHICLE_TYPES vt, MAKE mk
    WHERE jb. vehicle_type_id  = vt.id
    AND jb.make_id = mk.id
    AND jb.id = ?
    `,[id]);
    const rows = result[0];
    return rows[0];
}

export const createJob = async(oJob) =>{
    const result = await pool.query(`
    INSERT INTO JOBS (name, phone_nbr, license_nbr, 
        vehicle_type_id, make_id, model, color, date)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `,[oJob.name, oJob.phone_nbr, oJob.license_nbr,
        oJob.vehicle_type_id, oJob.make_id, oJob.model, 
        oJob.color, oJob.date]);
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