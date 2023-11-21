//AQUI VAN LOS ENDPOINT

const { request, response } = require('express');
const conBreaking = require('../models/users')
const pool = require('../db');

//ENDPOINT PARA VER TODOS LOS DATOS LISTO
const listallB = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const users = await conn.query(conBreaking.getAll, (err) =>{
            if(err){
                throw err
            }
        });
        
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}
/////////////////////////////////////////////////////////////////////


//ENDPOINT PARA VER UN USUARIO EN ESPECIFICO LISTO
const ListOnly = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)){
        res.status(404).json({msg: 'Invalid ID'});
        return;
    }

    let conn;

    if(!id || id.is_active===0){
        res.status(404).json({msg: 'Episodio not found'})
        return;
    }

    try {
        conn = await pool.getConnection();

        const [user] = await conn.query(conBreaking.getByID, [id], (err) =>{
            if(err){
                throw err
            }
        });

        if (!user){
            res.status(404).json({msg:'User not found'});
            return;
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}


//ENDPOINT PARA AGREGAR UN CAMPO LISTO
const addEpi = async (req = request, res = response) => {
    const {
        Temporada,
        Episodio,
        Titulo,
        Dirijido,
        Escrito,
        Duracion,
        Sipnosis,
        Rating,
        Vista,
        is_active = 1
    } = req.body;

    if(!Temporada || !Episodio || !Titulo || !Duracion || !Sipnosis){
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const user = [Temporada, Episodio, Titulo, Dirijido, Escrito, Duracion, Sipnosis, Rating, Vista,is_active];

    let conn;

    try{
        conn = await pool.getConnection();


        const userAdded = await conn.query(conBreaking.addEpisodios, [...user], (err) => {
            if(err) throw err;
        });

        if (userAdded.affecteRows === 0) throw new Error({message: 'Failed to add user'});
        res.json({msg: 'User added successfully'});

    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally {
        if(conn) conn.end();
    }
    
}
////////////////////////////////////////////////////////////////////////////////////////////////


//ESTE ENDPOINT ES PARA ACTUALIZAR UN CAMPO
const updateEpi =async (req =request, res= response) =>{
    const {id} = req.params;// Captura el ID de los parámetros en la URL
    const {
            Temporada, 
            Episodio, 
            Titulo, 
            Dirijido, 
            Escrito,
            Duracion,
            Sipnosis,
            Rating,
            Vista,
            is_active
    } =req.body; //Extrae los datos


    let epi = [
        Temporada, 
        Episodio, 
        Titulo, 
        Dirijido, 
        Escrito,
        Duracion,
        Sipnosis,
        Rating,
        Vista,
        is_active
    ];
    
    let conn;

    try{
        conn = await pool.getConnection();

        const [EpiExists] = await conn.query(
            conBreaking.getByID,
            [id],
            (err)=> {throw err;}
        )
        
        if (!EpiExists || EpiExists.is_active===0) {
            res.status(404).json({msg: 'User not found'})
            return;
        }

        let oldEpi = [
            EpiExists.Temporada, 
            EpiExists.Episodio, 
            EpiExists.Titulo, 
            EpiExists.Dirijido, 
            EpiExists.Escrito,
            EpiExists.Duracion,
            EpiExists.Sipnosis,
            EpiExists.Rating,
            EpiExists.Vista,
            EpiExists.is_active]
        
            epi.forEach((epiData, index)=>{
                if (!epiData) {
                    epi[index] = oldEpi[index]
                };
            })

            const epiUpdated = conn.query(
                conBreaking.updateByID, 
                [...epi, id],
                (err) => {
                    throw err;
                }
                )
            if (epiUpdated.affectedRows===0){
                throw new Error('User not updated');
            }
            res.json({msg:'Userd updated successfully'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
        } finally {
            if (conn) conn.end();
        }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////12/10/2023

//END POINT PARA ELIMINAR LISTO 
const deleteEpi = async(req = request, res = response) =>{
    let conn;
    const {id} = req.params;

    try{
        conn = await pool.getConnection();

        const [EpiExists] = await conn.query(
            conBreaking.getByID,
            [id],
            (err) => { throw err; }
        )
        if (!EpiExists || EpiExists.is_active === 0){
            res.status(404).json({msg: 'User not found'});
            return;
        }
    
        const borrarEpi = await conn.query(
            conBreaking.deleteRow,
            [id],
            (err) => {if (err) throw err;}
    
        )
        if(borrarEpi.affecteRows === 0){
            throw new Error({message: 'Failed to delete user'})
        };

        res.json({msg: 'User deleted successfully'});

    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if(conn) conn.end();
    }
}




module.exports = { 
    listallB, 
    ListOnly, 
    addEpi, 
    deleteEpi, 
    updateEpi
};