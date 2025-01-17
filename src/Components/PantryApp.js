import React from 'react';
import RecipeList from './RecipeList';

const PantryApp = props => {
    const [recipes, setRecipes] = React.useState([]);
    const ingredients = ['apples', 'flour', 'sugar'];

    const getIngredientData = () =>
        fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=2&ignorePantry=true&apiKey=e7e8a1d91f9b4f46bbb75f039569e610`
        )
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                response.json().then(data => {
                    const recipeIDs = data.map(item => item.id);
                    getAndSetRecipeData(recipeIDs, data);
                });
            })
            .catch(err => {
                console.log('Fetch Error :-S', err);
            });

    const getAndSetRecipeData = (ids, recipesData) => {
        const recipeTargetURL = `https://api.spoonacular.com/recipes/informationBulk?ids=${ids}&apiKey=e7e8a1d91f9b4f46bbb75f039569e610`;

        fetch(recipeTargetURL)
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }

                response.json().then(data => {
                    const updatedRecipes = data.map(item => {
                        const matchingRecipe = recipesData.find(recipe => recipe.id === item.id);

                        if ('undefined' !== matchingRecipe) {
                            return { ...matchingRecipe, sourceUrl: item.sourceUrl };
                        }
                    });

                    setRecipes(updatedRecipes);
                });
            })
            .catch(err => {
                console.log('Fetch Error :-S', err);
            });
    };

    const getRecords = async () => {
        const ingredientData = await getIngredientData();
        console.log("TCL: getRecords -> ingredientData", ingredientData)
        console.log("TCL: getRecords -> recipes", recipes)
    };

    return (
        <div>
            <h1>Welcome to the pantry!</h1>
            {recipes && <RecipeList recipes={recipes} />}
            <button type="button" onClick={getRecords}>
                Get recipes
            </button>
            {/* IngredientsForm */}
        </div>
    );
};

export default PantryApp;
