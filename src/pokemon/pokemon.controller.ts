import { Controller, Get, UseGuards } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CongnitoAuthGuard } from 'src/auth/guards/cognito-auth.guard';

@Controller('api/v1/pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @UseGuards(RolesGuard, CongnitoAuthGuard)
  @Get()
  listAllPokemons(): Array<Pokemon> {
    return this.pokemonService.listAllPokemons();
  }
}
