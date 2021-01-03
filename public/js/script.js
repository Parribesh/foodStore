function submitClick(){
  let fName = document.getElementById('fname').val();
  let lName = document.getElementById('lname').val;
  let country = document.getElementById('country').val;
  let subject = document.getElementById('subject').val;
  console.log(fName + " "+ lName +" "+ country + " " + " " + subject + " " + "Submitted!")
  alert(fName + " "+ lName +" "+ country + " " + " " + subject + " " + "Submitted!")
}
/*
API IS FULLY COMPLETE, WE JUST NEED TO ADD CSS TO THE PAGE
*/
let url = "https://www.themealdb.com/api/json/v1/1/random.php";
function retrieveData(){
document.getElementById('ta').hidden = false;
document.getElementById('tab').hidden = false;

var query = document.getElementById('fInput').value;

//AJAX TO COMPLETE A GET REQUEST FROM API BACKEND SERVER
$.ajax({
    method: 'GET',
    url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
    headers: { 'X-Api-Key': 'b5nx0QE2fS1FvXwCpL5vqQ==h9882FuYDxt3eRUv'},
    contentType: 'application/json',
    success: function(result) {
       if(typeof (result.items[0].sugar_g) == 'undefined') {
       alert("No such item found in DataBase");
       } else {
         console.log(result);
        document.getElementById("t2").innerHTML = result.items[0].sugar_g;
        document.getElementById("t3").innerHTML = result.items[0].fiber_g;
        document.getElementById("t4").innerHTML =result.items[0].serving_size_g;
        document.getElementById("t5").innerHTML = result.items[0].sodium_mg;
        document.getElementById("t1").innerHTML = result.items[0].name;
        document.getElementById("t6").innerHTML = result.items[0].potassium_mg;
        document.getElementById("t7").innerHTML = result.items[0].fat_saturated_g;
        document.getElementById("t8").innerHTML = result.items[0].fat_total_g;
        document.getElementById("t9").innerHTML = result.items[0].calories;
        document.getElementById("t10").innerHTML = result.items[0].cholesterol_mg;
        document.getElementById("t11").innerHTML = result.items[0].protein_g;
        document.getElementById("t12").innerHTML = result.items[0].carbohydrates_total_g;

       }

    },
    //if failed print error out to the user, atm its returning to the console we can add a alert which is provided below
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
        alert(jqXHR.responseText);
    }
});
}



 async function retrieveRandomMeal(){
   document.getElementById('rMeal').hidden = false;
   let response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
   let data = await response.json();
   console.log(data);
    document.getElementById("strArea").innerHTML = "Origin: " + data.meals[0].strArea;
    document.getElementById("strCategory").innerHTML = "Category: " +  data.meals[0].strCategory;
    document.getElementById("strI1").innerHTML = "Ingredient 1: " + data.meals[0].strIngredient1;
    document.getElementById("strI2").innerHTML = "Ingredient 2: " +data.meals[0].strIngredient2;
    document.getElementById("strI3").innerHTML = "Ingredient 3: " +data.meals[0].strIngredient3;
    document.getElementById("strI4").innerHTML = "Ingredient 4: " +data.meals[0].strIngredient4;
    if(data.meals[0].strIngredient5 != "" && data.meals[0].strIngredient5 != null){
      document.getElementById("strI5").innerHTML = "Ingredient 5: " +data.meals[0].strIngredient5;
      document.getElementById("strI6").innerHTML = "Ingredient 6: " +data.meals[0].strIngredient6;
      document.getElementById("strI7").innerHTML = "Ingredient 7: " +data.meals[0].strIngredient7;
      document.getElementById("strI8").innerHTML = "Ingredient 8: " +data.meals[0].strIngredient8;
      if(data.meals[0].strIngredient9 == "" || data.meals[0].strIngredient9 == null){
          document.getElementById("strI9").innerHTML = "Ingredient 9: N/A";
      } else {
      document.getElementById("strI9").innerHTML = "Ingredient 9: " +data.meals[0].strIngredient9;
      
        if(data.meals[0].strIngredient10 == "" || data.meals[0].strIngredient10 == null){
        document.getElementById("strI10").innerHTML = "Ingredient 10: N/A" ;
        } else {
          document.getElementById("strI10").innerHTML = "Ingredient 10:"+ data.meals[0].strIngredient10;
        }
        document.getElementById("strP").innerHTML = "Instructions: " +data.meals[0].strInstructions;
        document.getElementById("strM").innerHTML = "Meal: " +data.meals[0].strMeal;
         if(data.meals[0].strTags == null){
            document.getElementById("strT").innerHTML = "Tags: N/A" ;
          } else{
          document.getElementById("strT").innerHTML = "Tags: " + data.meals[0].strTags;
          }   
      }
    }
 }