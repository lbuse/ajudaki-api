'use strict'

class CampaignHelpMethodDao {
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  // TODO: adicionar validações

  /**
   * Consulta uma forma de ajuda
   *
   * @param {number} id ID da forma de ajuda
   * @returns Retorna uma forma de ajuda
   */
  async findOne(id) {
    let db = await this.databaseHelper.connect();
    let rows = []
    let helpMethod = null

    try {
      rows = await db.query(
        `SELECT
          id,
          descricao
        FROM ajuda_pedido_formas
        WHERE id = ?
        LIMIT 1`,
        [id]
      )
    } finally {
      db.end()
    }

    for (let row in rows) {
      helpMethod = new CampaignHelpMethodModel({
        id: row.id,
        description: row.descricao
      })
      break
    }

    return helpMethod
  }

  /**
   * Consulta a lista de formas de ajuda disponíveis na plataforma
   *
   * @returns Retorna uma lista com zero ou mais `CampaignHelpMethod`
   */
  async findAll() {
    let db = await this.databaseHelper.connect();
    let rows = []
    let helpMethods = []

    try {
      rows = await db.query(`SELECT id, descricao FROM ajuda_pedido_formas`)
    } finally {
      db.end()
    }

    for (let row in rows) {
      helpMethods.push(new CampaignHelpMethod({
        id: row.id,
        description: row.descricao
      }))
    }

    return helpMethods
  }

  /**
   * Insere uma nova forma de ajuda
   *
   * @param {CampaignHelpMethodModel} helpMethod Forma de ajuda
   * @returns Retorna o ID da forma de ajuda inserida
   */
  async insertOne(helpMethod) {
    let db = await this.databaseHelper.connect();
    let result = {}

    try {
      result = await db.query(
        `INSERT INTO ajuda_pedido_formas (descricao) VALUES (?)`,
        [helpMethod.description]
      )
    } finally {
      db.end()
    }

    return result.insertId
  }

  /**
   * Atualizar uma forma de ajuda
   *
   * @param {CampaignHelpMethodModel} helpeMethod Forma de ajuda
   * @returns Retorna o numero de linhas afetadas
   */
  async updateOne(helpMethod) {
    let db = await this.databaseHelper.connect();
    let result = {}

    try {
      result = await db.query(
        `UPDATE ajuda_pedido_formas SET descricao = ? WHERE id = ?`,
        [helpMethod.description, helpMethod.id]
      )
    } finally {
      db.end()
    }

    return result.affectedRows
  }

  /**
   * Deleta uma forma de ajuda
   *
   * @param {number} id ID da forma de ajuda
   * @returns Retorna o numero de linhas afetadas
   */
  async deleteOne(id) {
    let db = await this.databaseHelper.connect();
    let result = {}

    try {
      result = await db.query(
        `DELETE FROM ajuda_pedido_formas WHERE id = ?`,
        [id]
      )
    } finally {
      db.end()
    }

    return result.affectedRows
  }
}

export default CampaignHelpMethodDao
