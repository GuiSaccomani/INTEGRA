   // obterDados.js
const API_URL = "http://localhost:3000";

 

async function carregarVendas() {
  try {
    const response = await fetch(API_URL + "/api/vendas");
    if (!response.ok) throw new Error(`Erro: ${response.status}`);

    const vendas = await response.json(); // armazena na variável global
    console.log(vendas)

    return vendas; //Retorna no html
  } catch (err) {
    console.error("Falha na consulta: " + err.message);
    return [];
  }
}

//carregarVendas()------------

// agora 'vendas' vai estar preenchido assim que o fetch terminar
// mas lembre-se: qualquer uso logo após esta linha ainda pode ver '[]' se o fetch não terminou


async function sincronizarMaterial(material) {
  try {
    const response = await fetch(API_URL + "/api/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(material)
    });

    if (!response.ok) throw new Error(`Erro: ${response.status}`);

    const result = await response.json();
    console.log("Material cadastrado:", result);
    return result; // Retorna o resultado para usar no HTML
  } catch (err) {
    console.error("Falha ao cadastrar material: " + err.message);
    return null;
  }
}

// Exemplo de uso:
const novoMaterial = {
  "productName": "Camiseta Polo",
  "productPrice": 79.90,
  "quantity": 2,
  "totalAmount": 159.80,
  "paymentMethod": "Cartão de Crédito",
  "storeCode": "LOJA001",
  "dashboardSaleId": "A1B2C3D4E5F607182930ABCD12345678"
};

//sincronizarMaterial(novoMaterial);---------------

//CSV
//npm install node-fetch form-data - necessários

const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");

const csvFilePath = path.join("C:/Users/Gui/Downloads", "csv.txt");

async function enviarCSV() {
  if (!fs.existsSync(csvFilePath)) {
    console.error("Arquivo não encontrado:", csvFilePath);
    return;
  }

  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(csvFilePath)); // deve bater com Multer

    const response = await fetch(API_URL + "/api/upload", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    if (!response.ok) throw new Error(`Erro: ${response.status}`);

    const result = await response.json();
    console.log("Upload concluído:", result);
  } catch (err) {
    console.error("Falha ao enviar CSV:", err.message);
  }
}

enviarCSV();

