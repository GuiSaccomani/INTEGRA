Listar vendas
    GET -> http://localhost:3000/api/vendas

Cadastrar vendas (sync)
    POST -> http://localhost:3000/api/vendas

    body:
    {
        "productName": "Boné Ajustável",
        "productPrice": 49.50,
        "quantity": 3,
        "totalAmount": 148.50,
        "paymentMethod": "Dinheiro",
        "storeCode": "LOJA003",
        "dashboardSaleId": "C1D2E3F4050617283940CDEF34567890"
    }

Importar CSV
    POST -> http://localhost:3000/api/upload

    form-data -> file (obrigatoriamente nome da have file)
    importar csv.txt
    
exemplo

productName,productPrice,quantity,totalAmount,paymentMethod,storeCode,dashboardSaleId
Boné Ajustável,49.50,3,148.50,Dinheiro,LOJA003,C1D2E3F4050617283940CDEF34567890
Camiseta Preta,79.90,2,159.80,Cartão,LOJA002,B1C2D3E4050617283940CDEF34567890
Tênis Esportivo,199.90,1,199.90,PIX,LOJA001,A1B2C3D4050617283940CDEF34567890
 