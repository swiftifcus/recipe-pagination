import React, {useState, useEffect, ChangeEvent} from 'react';
import logo from './logo.svg';
import axios from 'axios'
import './App.css';
import './components/pagination.css'

import Recipe from './shared/Recipe'
import RecipeList from './shared/RecipeList'
import Post from './components/Post'



function App() {
  const api = 'http://localhost:8081'
  const [recipeList, setRecipeList] = useState<RecipeList>({} as RecipeList)
  const [filteredList, setFilteredList] = useState({} as Array<Recipe>)
  const [searchText, setSearchText] = useState('')
  const [pages, setPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const pageLimit = 3
  const dataLimit = 5

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${api}/recipes?pageSize=25`)
        const data = await res.data
        setRecipeList(data)
        setPages(Math.ceil(data.recipes.length / dataLimit))
      } catch (error) {
        console.error(error)
      }
    }
    fetchData();
  }, [])

  const goToNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1)
  }
  const goToPreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1)
  }
  const changePage = (e: React.MouseEvent) => {
    setCurrentPage(Number(e.currentTarget.textContent))
  }

  const getFilteredData = () => {
    const start = currentPage * dataLimit - dataLimit
    const end = start + dataLimit
    return filteredList.slice(start, end)
  }

  const getPaginatedData = () => {
    const start = currentPage * dataLimit - dataLimit
    const end = start + dataLimit
    return recipeList.recipes.slice(start, end)
  }
  const getPaginationGroup = () => {
    let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit
    let num: number;
    if (searchText.length === 0) {
      num = Math.ceil(recipeList.recipes.length / dataLimit)
    } else {
      num = Math.ceil(filteredList.length / dataLimit)
    }
    
    return new Array(num).fill(0).map((_, i) => start + i + 1)
  }

  const filterRecipes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    if (searchText.length === 0) {
      setFilteredList({} as Array<Recipe>)
    } 
    const { recipes, ...rest } = recipeList
    let newRecipes: Array<Recipe> = []
    for (let i = 0; i < recipes.length; i++) {
      if (recipes[i].title.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1) {
        newRecipes.push(recipes[i])
      }
    }
    setFilteredList(newRecipes)

    console.log(newRecipes)
    
  }

  const deleteRecipe = async (recipe: any, index: any) => {
    try {
      const res = await axios.delete(`${api}/recipes/${recipe.id}`)
      console.log(recipe)
      console.log(res)
      setRecipeList(prevRecipes => {
        const { recipes, ...rest } = prevRecipes
        const newRecipes = recipes.filter(r => r.id !== recipe.id)
        return {
          ...rest,
          recipes: newRecipes
        }
      })
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="App">
      <h1 className="header-text" >Recipes overview</h1>
      <label htmlFor="filter">Filter</label>
      <input className="filter" type="text" name="filter" onChange={filterRecipes} />
      <div>
        {searchText.length > 0 ?
          getFilteredData().map((d, idx) => (
          <Post key={idx} recipe={d} idx={idx} onDelete={deleteRecipe} />
        )) :  
          recipeList.recipes && getPaginatedData().map((d, idx) => (
          <Post key={idx} recipe={d} idx={idx} onDelete={deleteRecipe} />
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={goToPreviousPage}
          className={`prev ${currentPage === 1 ? 'disabled' : ''}`}
        >
          prev
        </button>
        {recipeList.recipes && getPaginationGroup().map((item, index) => (
          <button
            key={index}
            onClick={changePage}
            className={`paginationItem ${currentPage === item ? 'active' : null}`}
          >
            <span>{item}</span>
          </button>
        ))}
        <button
          onClick={goToNextPage}
          className={`next ${currentPage === pages ? 'disabled' : ''}`}
        >
          next
        </button>
        
        </div>
      </div>
  );
}

export default App;
