import React, { Component } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Create from "../../Components/FichaRegistoIdentificacao/Create";

class CreateFichaTecnica extends Component {
  render() {
    return (
      <div className="CreateRIPage">
        <Header />
        <Create />
        <Footer />
      </div>
    );
  }
}

export default CreateFichaTecnica;
