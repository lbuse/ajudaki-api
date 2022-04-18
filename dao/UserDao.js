'use strict'

class UserDao {
  constructor(databaseHelper) {
    this.databaseHelper = databaseHelper
  }

  /**
   * Retorna informações do usuário especificado
   *
   * @param {string} email Email do usuário que deve ser retornado
   * @returns Retorna `JsonArray` com dados do usuário
   */
  async findOne(email) {
    let db = await this.databaseHelper.connect();
    let result = []
    try {
      result = await db.query(
        `SELECT
          id,
          nome,
          sobrenome,
          data_nascimento,
          cep,
          cidade,
          uf,
          email,
          senha,
          tipo_usuario,
          foto,
          foto_documento
        FROM usuario
        WHERE email = ?
        LIMIT 1`,
        [email]
      )
    } finally {
      db.end()
    }

    return result
  }

  /**
   * Insere um novo usuário no banco
   *
   * @param {UserModel} user Usuário que será inserido
   * @returns Retorna o ID do usuário criado
   */
  async insertOne(user) {
    let db = await this.databaseHelper.connect();
    let result = {}
    try {
      result = await db.query(
        `INSERT INTO usuario (nome, sobrenome, data_nascimento, cep, cidade, uf, email, senha, tipo_usuario, foto, foto_documento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.name, user.lastName, user.dateOfBirth, user.zipCode, user.city, user.state, user.email, user.password, user.userType, user.photo, user.photoDocument]
      )
    } finally {
      db.end()
    }

    return result.insertId
  }

  /**
   * Atualiza a senha do usuário
   *
   * @param {string} email Email do usuário que irá modificar a senha
   * @param {string} newPassword Nova senha do usuário
   * @returns Retorna o numero de linhas alteradas
   */
  async updatePassword({ email, newPassword }) {
    let db = await this.databaseHelper.connect();
    let result = {}
    try {
      result = await db.query(
        `UPDATE usuario SET password = ? WHERE email = ?`,
        [newPassword, email]
      )
    } finally {
      db.end()
    }

    return result.affectedRows
  }

  /**
   * Deleta um usuário do banco de dados
   *
   * @param {string} id ID do usuário
   * @returns Retorna o numero de linhas alteradas
   */
  async deleteOne({ id }) {
    let db = await this.databaseHelper.connect();
    let result = {}
    try {
      result = await db.query(
        `DELETE FROM usuario WHERE id = ?`,
        [id]
      )
    } finally {
      db.end()
    }

    return result.affectedRows
  }
}

export default UserDao
