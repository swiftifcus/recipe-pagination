import Unit from './Unit'

export default interface Ingredient {
  name: string;
  amount?: number;
  unit?: Unit
}