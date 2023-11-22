//AQUI VAN LOS ENDPOINT

const { request, response } = require('express');
const conBreaking = require('../models/users')
const pool = require('../db');

//ENDPOINT PARA VER TODOS LOS DATOS LISTO GET
const listallB = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();

        const epi = await conn.query(conBreaking.getAll, (err) =>{
            if(err){
                throw err
            }
        });
        
        res.json(epi);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}
/////////////////////////////////////////////////////////////////////


//ENDPOINT PARA VER UN USUARIO EN ESPECIFICO LISTO GET
const ListOnly = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)){
        res.status(404).json({msg: 'Invalid ID'});
        return;
    }

    let conn;

    if(!id || id.is_active===0){
        res.status(404).json({msg: 'Episode not found'})
        return;
    }

    try {
        conn = await pool.getConnection();

        const [episode] = await conn.query(conBreaking.getByID, [id], (err) =>{
            if(err){
                throw err
            }
        });

        if (!episode){
            res.status(404).json({msg:'User not found'});
            return;
        }
        res.json(episode);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}


//ENDPOINT PARA AGREGAR UN CAMPO LISTO PUT
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

    const episode = [Temporada, Episodio, Titulo, Dirijido, Escrito, Duracion, Sipnosis, Rating, Vista,is_active];

    let conn;

    try{
        conn = await pool.getConnection();


        const epiAdded = await conn.query(conBreaking.addEpisodios, [...episode], (err) => {
            if(err) throw err;
        });

        if (epiAdded.affecteRows === 0) throw new Error({message: 'Failed to add episode'});
        res.json({msg: 'Episode added successfully'});

    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally {
        if(conn) conn.end();
    }
    
}
////////////////////////////////////////////////////////////////////////////////////////////////


//ESTE ENDPOINT ES PARA ACTUALIZAR UN CAMPO PATCH
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
            res.status(404).json({msg: 'Episode not found'})
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
                throw new Error('Episode not updated');
            }
            res.json({msg:'Episode updated successfully'});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
        } finally {
            if (conn) conn.end();
        }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////12/10/2023

//END POINT PARA ELIMINAR LISTO DELETE
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
            res.status(404).json({msg: 'Episodio not found'});
            return;
        }
    
        const borrarEpi = await conn.query(
            conBreaking.deleteEPI,
            [id],
            (err) => {if (err) throw err;}
    
        )
        if(borrarEpi.affecteRows === 0){
            throw new Error({message: 'Failed to delete episode'})
        };

        res.json({msg: 'Delete deleted successfully'});

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