// AQUI VAN LAS CONSULTAS A LA BASE DE DATOS
const conBreaking = {
    getAll: `SELECT * FROM breaking_bad`,

    getByID: `SELECT * FROM breaking_bad WHERE id = ?`,

    addEpisodios: `
        INSERT INTO 
            breaking_bad(
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
            ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    updateByID:`
        UPDATE breaking_bad
        SET 
        Temporada=?,
        Episodio=?,
        Titulo=?,
        Dirijido=?,
        Escrito=?,
        Duracion=?,
        Sipnosis=?,
        Rating=?,
        Vista=?,
        is_active=?
        WHERE id=?
        `,

    deleteRow: `
        UPDATE
            breaking_bad
        SET
            is_active=0
        WHERE
            id= ?
    `,
}

module.exports = conBreaking;