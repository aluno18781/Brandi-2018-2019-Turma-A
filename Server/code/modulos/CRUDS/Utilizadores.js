const bcrypt = require("bcrypt");

/**
 * Método para authenticar utilizador
 * @param bd - recebe base de dados para fazer query
 * @param dados -dados para executar query
 * @returns {object} stat: 1 <erro> 0 <sucesso> , resposta <dados do utilizador>
 */
exports.authenticateUser = async (bd, dados) => {
  let resultadofinal = { stat: 1, resposta: {} };
  //verificar se os campos estão preenchidos
  if (dados.login && dados.password) {
    //pesquisar o utilizador na base de dados
    let resposta_bd = await bd.query(
      "Select * from tbl_utilizadores where login = ? and visible = true limit 1",
      [dados.login]
    );
    // verficar se encontrou o utilizador
    if (resposta_bd.stat === 0 && resposta_bd.resposta.length > 0) {
      //gerar uma password
      let password = await bcrypt.hash(
        dados.password,
        resposta_bd.resposta[0].salt
      );
      //comparar se as passwords são iguais
      if (password === resposta_bd.resposta[0].password) {
        //nao ocorreu nenhum erro
        resultadofinal.stat = 0;
        //nao enviar o campo password
        resposta_bd.resposta[0].password = undefined;
        //não enviar o campo salt
        resposta_bd.resposta[0].salt = undefined;
        //resultado = dados publicos do utilizador
        resultadofinal.resposta = resposta_bd.resposta[0];
      }
    } else {
      // erro de conecao com base de dados
      if (resposta_bd.stat === 1) {
        resultadofinal.resposta = "DBConnectionError";
      } else {
        resultadofinal.resposta = "NotAuthenticated";
      }
    }
  }
  return resultadofinal;
};

/**
 * Método para registar um utilizador na base de dados
 * @param bd - recebe base de dados para fazer query
 * @param dados -dados para executar query
 * @returns {object} stat: 1 <erro> 0 <sucesso> , resposta <dados do utilizador>
 */
exports.registerUser = async (bd, dados) => {
  let resultadofinal = { stat: 1, resposta: {} };
  //auxiliar para descubrir qual e o campo repetido
  let resposta_bd2;
  //gerar salt
  let salt = await bcrypt.genSalt(10);
  //encriptar password
  let password = await bcrypt.hash(dados.password, salt);
  //registar utilizador na base de dados
  let resposta_bd = await bd.query(
    "Insert into tbl_utilizadores(login,email,password, salt,roleFK,visible) values( ?,?,?,?,?,?)",
    [dados.login, dados.email, password, salt, dados.roleFK, dados.visible]
  );
  //campos duplicados
  if (resposta_bd.stat === 2) {
    resposta_bd2 = await bd.query(
      "Select * from tbl_utilizadores where login = ?",
      [dados.login]
    );
    //login ja existente na base de dados
    if (resposta_bd2.resposta.length > 0) {
      resultadofinal.resposta = "Já existe um utilizador com esse login";
    }
    //verificar se já existe algum utilizador com o email
    else {
      resposta_bd2 = await bd.query(
        "Select * from tbl_utilizadores where email = ?",
        [dados.email]
      );
      //emails ja existente na base de dados
      if (resposta_bd2.resposta.length > 0) {
        resultadofinal.resposta = "Já existe um utilizador com esse email";
      }
    }
  }
  //erro na conecao com a base de dados
  else if (resposta_bd.stat === 1) {
    resultadofinal.resposta = "DBConnectionError";
  }
  //Role nao existente
  else if (resposta_bd.stat === 3) {
    resultadofinal.resposta = "UnknowRole";
  }
  //utilizador registado com sucesso
  else {
    resultadofinal.stat = 0;
    resultadofinal.resposta = resposta_bd.resposta;
  }
  return resultadofinal;
};

/**
 * Método para fazer pesquisa de todos os utilizadores a base dados
 * @param bd - recebe base de dados para fazer query
 * @returns {object} stat: 1 <erro> 0 <sucesso> , resposta <dados do utilizador>
 */
exports.getAllUsers = async bd => {
  let resultadofinal = { stat: 1, resposta: {} };
  let resposta_bd = await bd.query(
    "Select * from tbl_utilizadores where visible = true"
  );
  if (resposta_bd.stat === 0) {
    resultadofinal.stat = 0;
    //ocultar os campos salt e password
    for (i = 0; i < resposta_bd.resposta.length; i++) {
      resposta_bd.resposta[i].salt = undefined;
      resposta_bd.resposta[i].password = undefined;
    }
    resultadofinal.resposta = resposta_bd.resposta;
  } else if (resposta_bd.stat === 1) {
    resultadofinal.stat = 1;
    resultadofinal.resposta = "DBConnectionError";
  }
  return resultadofinal;
};

/**
 * Método que permite alterar dados de um utilizador
 */
exports.changeUser = async (bd, dados) => {
  let resultadofinal = { stat: 1, resposta: {} };
  //verificar se os dados estao introduzidos
  if (dados.userID && dados.login && dados.email && dados.roleFK) {
    //query a base de dados
    let resposta_bd = await bd.query(
      "update tbl_utilizadores set login= ? , email = ? , roleFK = ? visible = ?  where userID = ? ",
      [dados.login, dados.email, dados.roleFK, dados.userID, dados.visible]
    );
    //query bem sucedida
    if (resposta_bd.stat === 0) {
      resultadofinal.stat = resposta_bd.stat;
      resultadofinal.resposta = resposta_bd.resposta;
    }
    //erro de role nao existente
    else if (resposta_bd.stat === 3) {
      resultadofinal.resposta = "UnknowRole";
    }
    //erro de camplos duplos na base de dados
    else if (resposta_bd.stat === 2) {
      resultadofinal.resposta = "InvalidField";
    }
    //erro de connecao
    else if (resposta_bd.stat === 1) {
      resultadofinal.resposta = "DBConnectionError";
    }
  }
  //campos vazios
  else {
    resultadofinal.resposta = "MissingFields";
  }
  return resultadofinal;
};
/**
 * Método que permite ir buscar os dados de um utilizador
 */
exports.getUser = async (bd, id) => {
  let resultadofinal = { stat: 1, resposta: {} };
  let resposta_bd = await bd.query(
    "Select * from tbl_utilizadores where userID = ? and visibile = true limit 1",
    [id]
  );
  //encontrou o utilizador
  if (resposta_bd.stat === 0 && resposta_bd.resposta.length > 0) {
    resultadofinal.stat = resposta_bd.stat;
    //nao mostrar o salt
    resposta_bd.resposta[0].salt = undefined;
    //nao mostrar o hash da password
    resposta_bd.resposta[0].password = undefined;
    resultadofinal.resposta = resposta_bd.resposta[0];
  } else if (resposta_bd.stat === 0) {
    resultadofinal.stat = resposta_bd.stat;
    resultadofinal.resposta = "NotVisible";
  }
  //ocorreu algum problema com a base de dados
  else {
    resultadofinal.resposta = resposta_bd.resposta;
  }
  return resultadofinal;
};
