const api = require('./api.bcb');
const axios = require('axios');

// indicamos que o axios será falso, será a versão mock.
jest.mock('axios');

// describe('api.bcb', () => {
  test('it should get currency from BCB', () => {
    const res = {
      data: {
        value: [
          {
            cotacaoVenda: 3.90
          }
        ]
      }
    }

    // definimos, que ao acionar o metodo get, a resposta será o objeto res, que 
    // criamos acima
    axios.get.mockResolvedValue(res);

    api.getCotacaoAPI('url')
      .then(resp => {
        // verificamos se o objeto resp, recebido no then, é igual ao nosso objeto
        // res. O res é a resposta que definimos, lá no mockResolvedValue
        expect(resp).toEqual(res);

        // verificamos se a função get foi acionada com a nossa url como parâmetro
        expect(axios.get.mock.calls[0][0]).toEqual('url');
      })
  });

  test('should extract data from BCB', () => {
    const cotacao = api.extractCotacao({
      data: {
        value: [
          {
            cotacaoVenda: 3.90
          }
        ]
      }
    });

    expect(cotacao).toEqual(3.90);
  })
// })

describe('getToday', () => {
  const RealDate = Date;

  // cria função para sobrescrita da classe original.
  function mockDate(date){
    global.Date = class extends RealDate {
      constructor(){
        return new RealDate(date);
      }
    }
  }

  afterEach(() => {
    global.Date = RealDate;
  })

  it('should test getToday', () => {
    mockDate('2019-01-01T12:00:00z');
    const today = api.getToday();
    expect(today).toBe('1-1-2019');
  })
})

it('should test getUrl', () => {
  const url = api.getUrl('MINHA-DATA');

  expect(url).toBe("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='MINHA-DATA'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao");
})

it('should test getCotacao working', () => {
  const res = {
    data: {
      value: [
        {
          cotacaoVenda: 3.90
        }
      ]
    }
  }

  const getToday = jest.fn();
  //mockReturnValue serve para retorno de algo de forma sincronina
  getToday.mockReturnValue('01-01-2019');

  const getUrl = jest.fn();
  //mockReturnValue serve para retorno de algo de forma sincronina
  getUrl.mockReturnValue('url');

  const getCotacaoAPI = jest.fn();
  //mockResolvedValue serve para retorno de algo assincrono.
  getCotacaoAPI.mockResolvedValue(res)

  const extractCotacao = jest.fn();
  //mockReturnValue serve para retorno de algo de forma sincronina
  extractCotacao.mockReturnValue(3.9);

  api.pure.getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao })()
    .then(res => {
      expect(res).toBe(3.9)
    })
})

it('should test getCotacao not working', () => {
  const res = {}

  const getToday = jest.fn();
  //mockReturnValue serve para retorno de algo de forma sincronina
  getToday.mockReturnValue('01-01-2019');

  const getUrl = jest.fn();
  //mockReturnValue serve para retorno de algo de forma sincronina
  getUrl.mockReturnValue('url');

  const getCotacaoAPI = jest.fn();
  //mockResolvedValue serve para retorno de algo assincrono.
  getCotacaoAPI.mockResolvedValue(Promise.reject('err'));

  const extractCotacao = jest.fn();
  extractCotacao.mockReturnValue(3.9);

  api.pure
    .getCotacao({ getToday, getUrl, getCotacaoAPI, extractCotacao })()
    .then(res => {
      expect(res).toBe(0)
    })
})