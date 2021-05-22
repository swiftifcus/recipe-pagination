import React from 'react'
import Recipe from '../shared/Recipe'

interface PostProps {
  recipe: Recipe;
  idx: number;
  onDelete: (recipe: Recipe, idx: number) => void;
}

function Post({recipe, idx, onDelete}: PostProps) {
  return (
    <div className="recipe-item" key={idx}>
      <div className="flex">
        <h2>{recipe.title}</h2>
        <p>{recipe.description}</p>
      </div>
      <div>
        <button className="delete-button"
          onClick={() => onDelete(recipe, idx)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default Post