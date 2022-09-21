/// <reference types="cypress" />
var faker = require('faker');
import contrato from '../contracts/usuarios.contracts'

describe('Testes da Funcionalidade Usuários', () => {

     let token
     before(() => {
          cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
     });

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
           }) 
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'http://localhost:3000/usuarios'
          }).then((response) => {
                    expect(response.body.usuarios[0].nome).to.equal('Fulano da Silva')
                    expect(response.status).to.equal(200)
                    expect(response.body).to.have.property('usuarios')
                    expect(response.duration).to.be.lessThan(40)
               })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          let nomefaker = faker.name.firstName()
          let emailfaker = faker.internet.email(nomefaker)
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": nomefaker,
                    "email": emailfaker,
                    "password": "teste",
                    "administrador": 'true'
               },

               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })

     });

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuário(token, 'Lucas', '@123', "teste", 'true')
               .then((response) => {
                    expect(response.status).to.equal(400)
                    expect(response.body.email).to.equal("email deve ser um email válido")
               })
     });

     it('Deve editar um usuário previamente cadastrado', () => {
          let nomefaker = faker.name.firstName()
          let emailfaker = faker.internet.email(nomefaker)

          cy.cadastrarUsuário(token, nomefaker, emailfaker, "teste", 'true')
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": nomefaker,
                              "email": emailfaker,
                              "password": "teste",
                              "administrador": 'true'
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })

     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          let nomefaker = faker.name.firstName()
          let emailfaker = faker.internet.email(nomefaker)

          cy.cadastrarUsuário(token, nomefaker, emailfaker, "teste", 'true')
               .then(response => {
                    let id = response.body._id

                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`,
                         headers: { authorization: token }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })
     });

});