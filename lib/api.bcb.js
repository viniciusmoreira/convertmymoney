const axios = require("axios");

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${data}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;
const getCotacaoAPI = url => axios.get(url)
const extractCotacao = (response) => response.data.value[0].cotacaoVenda
const getToday = () => {
  const today = new Date();

  return ((today.getMonth()+1)+"-"+today.getDate()+"-"+today.getFullYear())
}

const getCotacao = ({ getToday, getUrl, getCotacaoAPI, extractCotacao }) => async () => {
  try {
    const today = getToday();
    const url = getUrl(today);
    const response = await getCotacaoAPI(url);
    const cotacao = extractCotacao(response);
    return cotacao
  } catch (err) {
    return 0;
  }
}

module.exports = {
  getCotacaoAPI,
  getCotacao: getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao }),
  extractCotacao,
  getUrl,
  getToday,
  pure: {
    getCotacao
  }
}