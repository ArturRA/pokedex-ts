import { Pokemon } from "../models/pokemon";

export class PokemonService {

  selecionarPokemonPorNome(nome: string): Promise<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${nome}`;

    return fetch(url)
      .then((res: Response): Promise<any> => this.processarResposta(res))
      .then((obj: any): Pokemon => this.mapearPokemon(obj));
  }
  
  private mapearPokemon(obj: any): Pokemon {
    return {
      id: obj.id,
      nome: obj.name,
      spriteUrl: obj.sprites.front_default
    };
  }

  selecionarPokemons(): Promise<Pokemon[]> {
    const url = `https://pokeapi.co/api/v2/pokemon/`;

    return fetch(url)
      .then((res: Response): Promise<any> => this.processarResposta(res))
      .then((obj: any): Promise<Pokemon[]> => this.mapearListaPokemons(obj.results));
  }

  private mapearListaPokemons(objetos: any[]): any {
    const pokemons = 
    objetos.map(obj => this.selecionarPokemonPorNome(obj.name));
    
    return Promise.all(pokemons);
  }

  private processarResposta(resposta: Response): Promise<any> {
    if (resposta.ok)
      return resposta.json();

    throw new Error('Pokémon não encontrado!');
  }
}