import Ingredient from './Ingredient'

export default interface Recipe {
  id: number;
  title: string;
  description: string
  created: string
  modified: string
  ingredients: [Ingredient]
}