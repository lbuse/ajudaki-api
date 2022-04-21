'use strict'
import CampaignModel from '../models/CampaignModel';
import Validators from '../utils/Validators';

class CampaignDao {
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  /**
   * Consulta todas as campanhas cadastradas
   * @returns Retorna uma lista com zero ou mais `CampaignModel`
   */
  async findAll({ searchText, filters }) {
    let db = await this.databaseHelper.connect();
    let rows = []

    let whereString = ''
    let whereParams = []

    if(!Validators.isBlank(searchText)) {
      whereString = 'WHERE ap.titulo LIKE ? OR ap.descricao LIKE ?'
      whereParams = ['%' + searchText + '%', '%' + searchText + '%']
    }

    if(Array.isArray(filters) && filters.length > 0) {
      whereString += whereString.length > 0 ? ' AND ' : 'WHERE '

      whereString += '('
      for(let i = 0; i < filters.length; i++) {
        whereString += 'apf.id_forma = ?'
        if(i < filters.length - 1) {
          whereString += ' OR '
        }
      }
      whereString += ')'
      whereParams.push(...filters)
    }

    try {
      rows = await db.query(
        `SELECT
          ap.id,
          ap.titulo,
          ap.descricao,
          ap.contato,
          af.id AS id_forma_ajuda,
          af.descricao AS descricao_forma_ajuda
        FROM ajuda_pedido AS ap
          LEFT JOIN ajuda_pedido_formas AS apf
              ON apf.id_ajuda_pedido = ap.id
            INNER JOIN ajuda_formas AS af
              ON af.id = apf.id_forma ${whereString}`,
        whereParams
      )
    } finally {
      db.end()
    }

    let campaigns = []
    for (var i = 0; i < rows.length; i++) {
      const row = rows[i];
      let addedCampaign = campaigns.find(c => c.id === row.id.toString())

      if (addedCampaign === undefined) {
        campaigns.push(new CampaignModel({
          id: row.id.toString(),
          title: row.titulo,
          description: row.descricao,
          contact: row.contato,
          helpMethods: [
            {
              id: row.id_forma_ajuda,
              description: row.descricao_forma_ajuda
            }
          ]
        }))
      } else {
        addedCampaign.helpMethods.push({
          id: row.id_forma_ajuda,
          description: row.descricao_forma_ajuda
        })
      }
    }

    return campaigns
  }

  /**
   * Consulta pedidos de ajuda de um usuário
   *
   * @param {number} userId ID do usuário
   * @returns Retorna uma lista com zero ou mais `CampaignModel`
   */
  async findByUser(userId) {
    let db = await this.databaseHelper.connect();
    let rows = []

    try {
      rows = await db.query(
        `SELECT
          ap.id,
          ap.titulo,
          ap.descricao,
          ap.contato,
          af.id AS id_forma_ajuda,
          af.descricao AS descricao_forma_ajuda
        FROM ajuda_pedido AS ap
          LEFT JOIN ajuda_pedido_formas AS apf
              ON apf.id_ajuda_pedido = ap.id
            INNER JOIN ajuda_formas AS af
              ON af.id = apf.id_forma
        WHERE ap.id_usuario = ?`,
        [userId]
      )
    } finally {
      db.end()
    }

    let campaigns = []
    for (var i = 0; i < rows.length; i++) {
      const row = rows[i];
      let addedCampaign = campaigns.find(c => c.id === row.id.toString())

      if (addedCampaign === undefined) {
        campaigns.push(new CampaignModel({
          id: row.id.toString(),
          title: row.titulo,
          description: row.descricao,
          contact: row.contato,
          helpMethods: [
            {
              id: row.id_forma_ajuda,
              description: row.descricao_forma_ajuda
            }
          ]
        }))
      } else {
        addedCampaign.helpMethods.push({
          id: row.id_forma_ajuda,
          description: row.descricao_forma_ajuda
        })
      }
    }

    return campaigns
  }

  /**
   * Consulta detalhes de uma campanha cadastrada
   *
   * @param {number} campaignId ID da campanha
   * @returns Retorna um objeto `CampaignModel` ou `null`
   */
  async findOne(campaignId) {
    let db = await this.databaseHelper.connect();
    let rows = []

    try {
      rows = await db.query(
        `SELECT
          ap.id,
          ap.titulo,
          ap.descricao,
          ap.contato,
          af.id AS id_forma_ajuda,
          af.descricao AS descricao_forma_ajuda
        FROM ajuda_pedido AS ap
          LEFT JOIN ajuda_pedido_formas AS apf
              ON apf.id_ajuda_pedido = ap.id
            INNER JOIN ajuda_formas AS af
              ON af.id = apf.id_forma
        WHERE ap.id = ?`,
        [campaignId]
      )
    } finally {
      db.end()
    }

    let campaigns = []
    for (var i = 0; i < rows.length; i++) {
      const row = rows[i];
      let addedCampaign = campaigns.find(c => c.id === row.id.toString())

      if (addedCampaign === undefined) {
        campaigns.push(new CampaignModel({
          id: row.id.toString(),
          title: row.titulo,
          description: row.descricao,
          contact: row.contato,
          helpMethods: [
            {
              id: row.id_forma_ajuda,
              description: row.descricao_forma_ajuda
            }
          ]
        }))
      } else {
        addedCampaign.helpMethods.push({
          id: row.id_forma_ajuda,
          description: row.descricao_forma_ajuda
        })
      }
    }

    return campaigns.length > 0 ? campaigns[0] : null
  }

  /**
   * Cria uma nova campanha de ajuda
   *
   * @param {number} userId ID do usuário
   * @param {CampaignModel} campaign Campanha a ser criada
   * @returns Retorna o ID da campanha criada
   */
  async insertOne(userId, campaign) {
    let db = await this.databaseHelper.connect();
    let result = {}

    try {
      await db.beginTransaction()

      // Insere a campanha
      result = await db.query(
        `INSERT INTO ajuda_pedido (id_usuario, titulo, descricao, contato) VALUES (?, ?, ?, ?)`,
        [userId, campaign.title, campaign.description, campaign.contact]
      )

      // Insere as formas de ajuda
      if (campaign.helpMethods !== 'undefined' && campaign.helpMethods.length > 0) {
        for (let helpMethod of campaign.helpMethods) {
          await db.query(
            `INSERT INTO ajuda_pedido_formas (id_ajuda_pedido, id_forma) VALUES (?, ?)`,
            [result.insertId, helpMethod.id]
          )
        }
      }

      await db.commit()
    } catch (error) {
      await db.rollback()
      throw error
    } finally {
      db.end()
    }

    return result.insertId.toString()
  }

  /**
   * Atualiza uma campanha de ajuda
   *
   * @param {CampaignModel} campaign Campanha a ser criada
   * @returns Retorna o numero de linhas afetadas
   */
  async updateOne(campaign) {
    let db = await this.databaseHelper.connect();
    let result = {}

    try {
      await db.beginTransaction()

      // Atualiza a campanha
      result = await db.query(
        `UPDATE ajuda_pedido SET titulo = ?, descricao = ?, contato = ? WHERE id = ?`,
        [campaign.title, campaign.description, campaign.contact, campaign.id]
      )

      // Deleta as formas de ajuda para inserir as atualizadas
      await db.query(
        `DELETE FROM ajuda_pedido_formas WHERE id_ajuda_pedido = ?`,
        [campaign.id]
      )

      // Insere as formas de ajuda
      if (campaign.helpMethods !== 'undefined' && campaign.helpMethods.length > 0) {
        for (let helpMethod of campaign.helpMethods) {
          await db.query(
            `INSERT INTO ajuda_pedido_formas (id_ajuda_pedido, id_forma) VALUES (?, ?)`,
            [campaign.id, helpMethod.id]
          )
        }
      }

      await db.commit()
    } catch (error) {
      await db.rollback()
      throw error
    } finally {
      db.end()
    }

    return result.affectedRows
  }

  /**
   * Deleta uma campanha.
   * @param {number} campaignId ID da campanha
   * @returns Retorna o numero de linhas afetadas
   */
  async deleteOne(campaignId) {
    let db = await this.databaseHelper.connect();
    let result = {}

    try {
      result = await db.query(
        `DELETE FROM ajuda_pedido WHERE id = ?`,
        [campaignId]
      )
    } finally {
      db.end()
    }

    return result.affectedRows
  }

}

export default CampaignDao
