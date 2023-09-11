import { Pokemon } from "../../models/pokemon";
import { PokemonService } from "../../services/pokemon.service";
import './pokemon-detalhes.css';

export class PokemonDetalhes {
  formPrincipal: HTMLFormElement;
  txtPesquisa: HTMLInputElement;
  btnVoltar: HTMLButtonElement;
  pnlConteudo: HTMLDivElement;
  private pokemonService: PokemonService;

  constructor() {
    this.pokemonService = new PokemonService();


    this.registrarElementos();
    this.registrarEventos();

    const uRLSearchParams = new URLSearchParams(window.location.search);

    const nome = uRLSearchParams.get('nome') as string;

    this.pesquisarPokemonPorNome(nome);
  }

  registrarElementos(): void {
    this.formPrincipal = document.getElementById("formPrincipal") as HTMLFormElement;
    this.txtPesquisa = document.getElementById("txtPesquisa") as HTMLInputElement;
    this.btnVoltar = document.getElementById("btnVoltar") as HTMLButtonElement;
    this.pnlConteudo = document.getElementById("pnlConteudo") as HTMLDivElement;
  }
  registrarEventos(): void {
    this.formPrincipal
      .addEventListener("submit", (e) => this.buscar(e));
    this.btnVoltar
      .addEventListener('click', () => window.location.href = 'index.html');
  }

  buscar(sender: Event) {
    sender.preventDefault();

    this.limparCard();

    if (!this.txtPesquisa?.value)
      return;

    this.pesquisarPokemonPorNome(this.txtPesquisa.value);
    this.txtPesquisa.value = "";
  }

  private pesquisarPokemonPorNome(nome: string): void {
    this.pokemonService.selecionarPokemonPorNome(nome)
      .then(poke => this.gerarCard(poke))
      .catch((erro: Error) => this.exibirNotificacao(erro));
  }

  private exibirNotificacao(erro: Error): void {
    const divNotificacao = document.createElement('div');

    divNotificacao.textContent = erro.message;
    divNotificacao.classList.add('notificacao');

    divNotificacao
      .addEventListener('click', (sender: Event) => {
        (sender.target as HTMLElement).remove()
      });

    document.body.appendChild(divNotificacao);

    setTimeout(() => {
      divNotificacao.remove();
    }, 5000);
  }

  limparCard() {
    this.pnlConteudo.querySelector('.card-pokemon')?.remove();
  }

  private gerarCard(pokemon: Pokemon): void {
    const lblId = document.createElement("p");
    const imgSprite = document.createElement("img");
    const lblNome = document.createElement("p");

    lblId.textContent = pokemon.id.toString();
    lblNome.textContent = pokemon.nome;
    imgSprite.src = pokemon.spriteUrl;

    const pnlPokemon = document.createElement('div');
    pnlPokemon.classList.add('card-pokemon');

    pnlPokemon.appendChild(lblId);
    pnlPokemon.appendChild(imgSprite);
    pnlPokemon.appendChild(lblNome);

    this.pnlConteudo.appendChild(pnlPokemon);
  }

}

window.addEventListener('load', () => new PokemonDetalhes());