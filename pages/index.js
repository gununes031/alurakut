import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'


function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}



export default function Home() {
  const [ongs, setOngs] = React.useState([]);

  
  
  // 0 - Pegar o array de dados do github 
  React.useEffect(function() {
    // API GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '42448b27cf9a1e5e8927425be92209',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ "query": `query{
        allOngs{
          id
          nome    
          desc
          cidade
          endereco
        }
      }` })
    })
    .then((response) => response.json()) // Pega o retorno do response.json() e já retorna
    .then((respostaCompleta) => {
      const OngsDato = respostaCompleta.data.allOngs;
      console.log(OngsDato)
      setOngs(OngsDato)
    })
    // .then(function (response) {
    //   return response.json()
    // })

  }, [])

  

  // 1 - Criar um box que vai ter um map, baseado nos items do array
  // que pegamos do GitHub

  return (
    <>
      <MainGrid>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h2 className="subTitle">Cadastro Ongs</h2>
            <form onSubmit={function handleCriaOng(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target);

                console.log('Campo: ', dadosDoForm.get('nome'));
                console.log('Campo: ', dadosDoForm.get('desc'));
                console.log('Campo: ', dadosDoForm.get('endereco'));
                console.log('Campo: ', dadosDoForm.get('cidade'));

                const ong = {
                  nome: dadosDoForm.get('nome'),
                  desc: dadosDoForm.get('desc'),
                  endereco: dadosDoForm.get('endereco'),
                  cidade: dadosDoForm.get('cidade')
                }

                fetch('/api/ongs', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  },
                  body: JSON.stringify(ong)
                })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const ong = dados.registroCriado;
                  const ongsAtualizadas = [...ongs, ong];
                  setOngs(ongsAtualizadas)
                })
            }}>
              <div>
                <input
                  placeholder="Nome"
                  name="nome"
                  aria-label="Nome"
                  type="text"
                  />
              </div>
              <div>
                <input
                  placeholder="Descrição"
                  name="desc"
                  aria-label="Descrição"
                />
              </div>
              <div>
                <input
                  placeholder="Endereço"
                  name="endereco"
                  aria-label="Endereço"
                  type="text"
                  />
              </div>
              <div>
                <input
                  placeholder="Cidade"
                  name="cidade"
                  aria-label="Cidade"
                  type="text"
                  />
              </div>

              <button>
                Confirmar
              </button>
            </form>
          </Box>
          <Box>
            <h2 className="subTitle">Listagem de Ongs</h2>
            <Box>
            <ul>
              {ongs.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <div style={{ flexGrow: '2' }}>
                      <span>{itemAtual.nome}</span>
                      <p>{itemAtual.desc}</p>
                      <p>{itemAtual.endereco}</p>
                      
                    </div>
                  </li>
                );
              })}
            </ul>
            </Box>
          </Box>
        </div>
      </MainGrid>
    </>
  )
}