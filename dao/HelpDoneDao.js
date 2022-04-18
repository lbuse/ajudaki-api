'use strict'

import CampaignHelpDoneModel from "../models/CampaignHelpDoneModel";

class HelpDoneDao {
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  /**
   * Consulta ajudas de uma campanha.
   *
   * @param {number} campaignId ID da campanha
   * @returns Retorna uma lista de ajudas realizadas
   */
  async findAll(campaignId) {
    let db = await this.databaseHelper.connect();
    let rows = []
    let helpDoneList = []

    try {
      rows = await db.query(
        `SELECT
          ar.id,
          ar.id_ajuda_pedido,
          ar.id_forma,
          af.descricao AS forma_descricao,
          ar.log_doacao
        FROM ajuda_realizada AS ar
          INNER JOIN ajuda_formas af
              ON ar.id_forma = af.id
        WHERE ar.id_ajuda_pedido = ?`,
        [campaignId]
      )
    } finally {
      db.end()
    }

    for (var i = 0; i < rows.length; i++) {
      const row = rows[i];
      helpDoneList.push(new CampaignHelpDoneModel({
        id: row.id.toString(),
        idCampaign: row.id_ajuda_pedido.toString(),
        idMethod: row.id_forma.toString(),
        methodDescription: row.forma_descricao,
        logDonation: row.log_doacao
      }))
    }

    return helpDoneList
  }

  /**
   * Consulta detalhes de uma ajuda realizada.
   *
   * @param {number} id ID da ajuda realizada
   * @returns Retorna um `CampaignHelpDone` ou `null`
   */
  async findOne(id) {
    let db = await this.databaseHelper.connect();
    let rows = []

    try {
      rows = await db.query(
        `SELECT
          ar.id,
          ar.id_ajuda_pedido,
          ar.id_forma,
          af.descricao AS forma_descricao,
          ar.log_doacao
        FROM ajuda_realizada AS ar
          INNER JOIN ajuda_formas af
              ON ar.id_forma = af.id
        WHERE ar.id = ?`,
        [id]
      )
    } finally {
      db.end()
    }

    if (rows.length === 0) {
      return null
    }

    const row = rows[0]
    return new CampaignHelpDoneModel({
      id: row.id.toString(),
      idCampaign: row.id_ajuda_pedido.toString(),
      idMethod: row.id_forma.toString(),
      methodDescription: row.forma_descricao,
      logDonation: row.log_doacao
    })
  }

  /**
   * Insere uma ajuda efetuada no banco de dados.
   *
   * @param {CampaignHelpDone} helpDone Ajuda realizada
   * @returns Retorna o ID da ajuda inserida
   */
  async insertOne(helpDone) {
    let db = await this.databaseHelper.connect();
    let result = {}

    try {
      result = await db.query(
        `INSERT INTO ajuda_realizada (id_ajuda_pedido, id_forma, log_doacao) VALUES (?, ?, ?)`,
        [helpDone.idCampaign, helpDone.idMethod, helpDone.logDonation]
      )
    } finally {
      db.end()
    }

    return result.insertId.toString()
  }

  /**
   * Deleta uma ajuda realizada.
   * @param {number} campaignId ID da ajuda
   * @returns Retorna o numero de linhas afetadas
   */
  async deleteOne(id) {
    let db = await this.databaseHelper.connect();
    let result = {}

    try {
      result = await db.query(
        `DELETE FROM ajuda_realizada WHERE id = ?`,
        [id]
      )
    } finally {
      db.end()
    }

    return result.affectedRows
  }

}

export default HelpDoneDao
