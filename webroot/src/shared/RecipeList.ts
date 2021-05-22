import Recipe from './Recipe'

export default interface RecipeList {
  currentPage: number;
  totalPages: number;
  recipes: Array<Recipe>
}