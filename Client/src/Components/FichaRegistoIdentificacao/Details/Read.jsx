import React, { Component } from "react";
import AlertMsg from '../../AlertMsg';
import LoadingAnimation from '../../LoadingAnimation';

class Read extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      alert: false,
    };
  }

  componentDidMount(){
    this.getFichaRI(this.props.id);
  }

  async getFichaRI(id) {

    //Enviar pedido
    const response = await fetch(`/api/fichaRegistoIdentificacao/${this.props.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": sessionStorage.getItem("token")
      }
    });

    //Aguardar API
    await response.json().then(resp => {
      let status = resp.stat;
      switch (status) {
        case "Authenticated":
          this.setState({ data: resp.resposta, loading: false });
          break;
        default:
          console.log("A API ESTÁ A ARDER, DARIOOOOOOOOOOOOOOOOOOOOOO");
      }
    }).catch( resp => {
      this.setState({
        error: true,
        loading: true,
        alertText: 'Não existe conexão com o servidor.',
        alertisNotVisible: false,
        alertColor: 'danger'
      })
    });
  }

  render() {
    if (sessionStorage.getItem("token") == null) {
      window.location = "/";
    } else {
      if (!this.state.loading) {
          return (
            <div className="container">
              <AlertMsg text={this.state.alertText} isNotVisible={this.state.alertisNotVisible} alertColor={this.state.alertColor} />
              <div className="row">
                <div className="col-md-12 mb-3">
                  <div className="text-center">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg"
                      id="imgPrev"
                      className="rounded img-thumbnail"
                      alt="Imagem"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 order-md-1">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="font-weight-bold">Designação do Objeto</label>
                      <input
                        type="text"
                        className="form-control"
                        id="dObjeto"
                        value={this.state.data.designacao}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="font-weight-bold">Processo LCRM</label>
                      <input
                        type="text"
                        className="form-control"
                        id="procLCRM"
                        value={this.state.data.processoLCRM}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="font-weight-bold">Processo CEARC</label>
                      <input
                        type="text"
                        className="form-control"
                        id="procCEARC"
                        value={this.state.data.processoCEARC}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="font-weight-bold">Data de Entrada</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateEntrada"
                        value={this.state.data.dataEntrada!=null? this.state.data.dataEntrada.substring(0,10) : ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="font-weight-bold">Data de Conclusão</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateConclusão"
                        value={this.state.data.dataConclusao!=null? this.state.data.dataConclusao.substring(0,10) : ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="font-weight-bold">Data de Entrega</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateEntrega"
                        value={this.state.data.dataEntrega!=null? this.state.data.dataEntrega.substring(0,10) : ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="font-weight-bold">Coordenação</label>
                      <input
                        type="text"
                        className="form-control"
                        id="coord"
                        value={this.state.data.coordenacao}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="font-weight-bold">Direção Técnica</label>
                      <input
                        type="text"
                        className="form-control"
                        id="dirTecn"
                        value={this.state.data.direcaoTecnica}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="font-weight-bold">Técnico(s) Responsável(eis)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tecResp"
                        value='1'
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="font-weight-bold">Endereço Postal | Localidade</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="endPostLocal" 
                        value={this.state.data.localidade}
                        readOnly
                        />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
      } else {
        return (
          <div className="container">
            <div className="py-3 text-center">
              <h2>Detalhes da Ficha de Registo e Identificação</h2>
            </div>
            {this.state.alert? 
                <AlertMsg text={this.state.alertText} isNotVisible={this.state.alertisNotVisible} alertColor={this.state.alertColor} /> 
              : 
                <LoadingAnimation height="6rem" width="6em" />
            }
          </div>
        );
      }
    };
  }
}

export default Read;