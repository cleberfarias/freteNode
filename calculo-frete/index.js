const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 8080; // Porta 8080

// Middleware para aceitar JSON
app.use(express.json());

// Rota básica
app.get('/', (req, res) => {
    res.send('API de Cálculo de Frete');
});

// Rota para calcular o frete
app.post('/calcular-frete', async (req, res) => {
    const { from, to, package: pacote } = req.body;

    if (!from || !to || !pacote) {
        return res.status(400).json({ error: 'Campos from, to e package são obrigatórios.' });
    }

    try {
        const response = await axios.post('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
            from: { postal_code: from.postal_code },
            to: { postal_code: to.postal_code },
            package: pacote,
            options: {
                receipt: false,
                own_hand: false
            },
            services: '1,2,3,4,7,11' // Exemplos de IDs de serviços
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMDVlZDIwMzA2ZWRiODMzYTcxMDhhNDYzZWEwNGE4OTc2ZDQxYzcwNGJkOGE1ZjAzOWFjNDE5MGQ4Yzg5NzFmMGVhNjg1MjZjZWZkOTk5MDUiLCJpYXQiOjE3MjYzMjIzMDUuNDg1MTQ4LCJuYmYiOjE3MjYzMjIzMDUuNDg1MTQ5LCJleHAiOjE3NTc4NTgzMDUuNDcyNjY4LCJzdWIiOiI5Y2QzYTllOC1iYzcwLTRhMDctYTMyZS0wMjgyZDVlODM1ZmEiLCJzY29wZXMiOlsiY2FydC1yZWFkIiwiY2FydC13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiY29tcGFuaWVzLXdyaXRlIiwiY291cG9ucy1yZWFkIiwiY291cG9ucy13cml0ZSIsIm5vdGlmaWNhdGlvbnMtcmVhZCIsIm9yZGVycy1yZWFkIiwicHJvZHVjdHMtcmVhZCIsInByb2R1Y3RzLWRlc3Ryb3kiLCJwcm9kdWN0cy13cml0ZSIsInB1cmNoYXNlcy1yZWFkIiwic2hpcHBpbmctY2FsY3VsYXRlIiwic2hpcHBpbmctY2FuY2VsIiwic2hpcHBpbmctY2hlY2tvdXQiLCJzaGlwcGluZy1jb21wYW5pZXMiLCJzaGlwcGluZy1nZW5lcmF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.N4RUo7VpWl4PbBMNmkr0kjehNdpPMQbQp4rpDVReoC1NExICGcLZK0sPsfiV9LoBaEUS_lk0ZEH97iQu_gdA1E9alFwF8PF_lk3AtSsD60_iQBiU6y-TNExY44o6Fzpg9aDGh0NaAJiXVeWFvHTcg7nJkTKwDca9F_hlZHnp3wvqC_IbJ4rr6km-XAbtkIxOJhQtIN3W9Q9NTLaV6GM6NeMa15-YMUWCRLgPnJFH2j7LRBraQjc0aHmyOJ4IpVQIA4KZj62l3Wlr0uaAWvUh_C0dQfdFxokjIIEr-vsJWyTSCUc8DqhZNbth5ht3oxPrUvvnocrayxef6OCL5v9n6VQlKYgH8JERPrqDoUzNkNE2kB_XyNc_ZxKp-I0A9BkRUXxVuvy0Vs0sFypRDIBGnt6fsrxFRMPOiHPjr9KE-EQceo6392_6Vlhu37iIwfFyg5Id5s2MjqYCfr82dJv1iT6RjvxyMI44NnrVOFlqreI2N88FtBlkC1llXatEf2pHAM4dvKXpsjfc0jYtj2-ucfPPTRYd4yMu8YZEtNIS6yWvOQd_4La7YJBC3tjBzFl_iqxgRmYaxnScFNoQEcwzEBqpUMXcEUhpPvmiI7UxTZXXqMpgAPRu_LZYXOGaQvE5HkoWXTc3SPEruVD3U9gHeW7Ubxh-MYrpp5Xh-xZMGRQ`, // Use variável de ambiente para a chave
                'Content-Type': 'application/json',
                'User-Agent': 'Aplicação cleber.fdelgado@gmail.com'
            }
        });

        // Log da resposta para verificar a estrutura
        console.log('Resposta da API:', response.data);

        // Verificar se a resposta contém serviços de entrega
        if (Array.isArray(response.data) && response.data.length > 0) {
            // Retornar todos os serviços disponíveis
            const opcoesFrete = response.data.map(servico => ({
                empresa: servico.company.name,
                servico: servico.name,
                prazo: servico.delivery_time,
                valor: servico.price,
                id: servico.company.id
            }));

            res.json({ opcoesFrete });
        } else {
            console.error('Resposta da API não é um array ou está vazia.');
            res.status(500).json({ error: 'Nenhuma opção de frete disponível.' });
        }

    } catch (error) {
        if (error.response) {
            console.error('Erro na resposta da API:', error.response.data);
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            console.error('Erro na requisição à API:', error.request);
            res.status(500).json({ error: 'Nenhuma resposta da API.' });
        } else {
            console.error('Erro desconhecido:', error.message);
            res.status(500).json({ error: 'Erro ao calcular o frete.' });
        }
    }
});
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});