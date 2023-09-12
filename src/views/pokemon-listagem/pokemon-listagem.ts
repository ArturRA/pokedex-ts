import { Pokemon } from '../../models/pokemon';
import { PokemonService } from '../../services/pokemon.service';
import './pokemon-listagem.css';

export class PokemonListagem {
  formPrincipal: HTMLFormElement;
  txtPesquisa: HTMLInputElement;

  pnlConteudo: HTMLDivElement;

  private pokemonService: PokemonService;

  constructor() {
    this.pokemonService = new PokemonService();
    this.registrarElementos();
    this.registrarEventos();

    // Gerar grid do index mostrando pokemons
    this.pokemonService.selecionarPokemons()
      .then(pokemons => this.gerarGridPokemons(pokemons));
  }

  private gerarGridPokemons(pokemons: Pokemon[]): any {
    const pnlGrid = document.createElement('div');
    pnlGrid.classList.add('grid-pokemons');

    for (let pokemon of pokemons) {
      const card = this.obterCard(pokemon);

      pnlGrid.appendChild(card);
    }

    this.pnlConteudo.appendChild(pnlGrid);
  }

  private obterCard(pokemon: Pokemon): HTMLDivElement {
    const id = document.createElement("p");
    const imagem = document.createElement("img");
    const nomePokemon = document.createElement("p");

    id.textContent = pokemon.id.toString();
    nomePokemon.textContent = pokemon.nome;
    imagem.src = pokemon.spriteUrl

    const cardPokemon = document.createElement('div');
    cardPokemon.classList.add('card-pokemon');

    cardPokemon.addEventListener('click', (sender) => {
      window.location.href = `pokemon-detalhes.html?nome=${pokemon.nome}`
    })
    
    cardPokemon.appendChild(id);
    cardPokemon.appendChild(imagem);
    cardPokemon.appendChild(nomePokemon);

    return cardPokemon;
  }

  registrarElementos(): void {
    this.formPrincipal = document.getElementById("formPrincipal") as HTMLFormElement;
    this.txtPesquisa = document.getElementById("txtPesquisa") as HTMLInputElement;
    this.pnlConteudo = document.getElementById("pnlConteudo") as HTMLDivElement;
  }

  registrarEventos(): void {
    this.formPrincipal
      .addEventListener('submit', (sender) => this.buscar(sender));
  }

  buscar(sender: Event): void {
    sender.preventDefault();

    if (!this.txtPesquisa.value) return;

    const nome = this.txtPesquisa.value;
    this.txtPesquisa.value = '';

    this.pesquisarPokemonPorNome(nome);
  }

  private pesquisarPokemonPorNome(nome: string): void {
    this.pokemonService.selecionarPokemonPorNome(nome)
      .then(poke => this.redirecionarUsuario(poke.nome))
      .catch((erro: Error) => this.exibirNotificacao(erro));
  }

  private redirecionarUsuario(nome: string): any {
    window.location.href = `pokemon-detalhes.html?nome=${nome}`;
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
}

window.addEventListener('load', () => new PokemonListagem());
