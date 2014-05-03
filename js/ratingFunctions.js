var xmldata;

function getName(place) {
    if (place == null) {
        return "Doesn't exist ";
    } else {
        return place.name;
    }
}

function getRating(place) {
    if (place == null || place.rating == null || isNaN(place.rating)) {
        return "";
    }
    else
    {
        return place.rating;
    }
}

function countFourStar(placeArray) {
    if (placeArray == null) {
        return 0.0;
    }

    var total = 0.0;
    for (var i=0; i<placeArray.length; i++) {
        if (placeArray[i].rating != null && placeArray[i].rating >= 4.0) {
            total++;
        } else {
            return total;
        }
    }

    return total;
}

function computeSingle(resultDict) {
    if (success) {
        var barCount = countFourStar(resultDict.bar);
        var cafeCount = countFourStar(resultDict.cafe);
        var foodCount = countFourStar(resultDict.food);
        var movieCount = resultDict.movie_theater.length;
        var clubCount = countFourStar(resultDict.night_club);
        var uniCount = resultDict.university.length;
        var rating = BachelorRating(50000, barCount, cafeCount, foodCount, movieCount, clubCount, uniCount, 0);
        updateScore(rating);
        
        
        var bestBar = getName(resultDict.bar[0]);
        var bestFood = getName(resultDict.food[0]);
        var bestNightClub = getName(resultDict.night_club[0]);
        
        $("#bests").empty();
        $("<tr><td>Bar: " + bestBar + "</td><td>" + getRating(resultDict.bar[0]) + "</td></tr>").appendTo($("#bests"));
        $("<tr><td>Food: " + bestFood + "</td><td>" + getRating(resultDict.food[0]) + "</td></tr>").appendTo($("#bests"));
        $("<tr><td>Night Club: " + bestNightClub + "</td><td>" + getRating(resultDict.night_club[0]) + "</td></tr>").appendTo($("#bests"));
    }
}

function computeFamily(resultDict) {
    if (success) {
        var convenienceCount = resultDict.convenience_store.length;
        var departmentCount = resultDict.department_store.length;
        var restaurantCount = countFourStar(resultDict.restaurant);
        var schoolCount = resultDict.school.length;
        var parkCount = countFourStar(resultDict.park);
        var rating = FamilyRating(50000, convenienceCount, departmentCount, restaurantCount, schoolCount, parkCount, 0);
        updateScore(rating);
        
        
        var bestSchool = getName(resultDict.school[0]);
        var bestPark = getName(resultDict.park[0]);
        var restaurant = getName(resultDict.restaurant[0]);
        
        $("#bests").empty();
        $("<tr><td>School: " + bestSchool + "</td><td>" + getRating(resultDict.school[0]) + "</td></tr>").appendTo($("#bests"));
        $("<tr><td>Park: " + bestPark + "</td><td>" + getRating(resultDict.park[0]) + "</td></tr>").appendTo($("#bests"));
        $("<tr><td>Restaurant: " + restaurant + "</td><td>" + getRating(resultDict.restaurant[0]) + "</td></tr>").appendTo($("#bests"));
    }
}

function startSingleMap(myAddress) {
    specs = {
        address: myAddress,
        placeTypes: ['bar', 'food', 'night_club', 'cafe', 'movie_theater', 'university'],
        icons: {
            bar: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            food: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            night_club: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
        },
        resultCallback: computeSingle
    };

    init(specs);
}

function startFamilyMap(myAddress) {
    specs = {
        address: myAddress,
        placeTypes: ['school', 'park', 'restaurant', 'department_store', 'convenience_store'],
        icons: {
        	school: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        	park: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        	restaurant: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
        },
        resultCallback: computeFamily
    };

    init(specs);
}

function GetZPercent(z) 
  {
    //z == number of standard deviations from the mean

    //if z is greater than 6.5 standard deviations from the mean
    //the number of significant digits will be outside of a reasonable 
    //range
    if ( z < -6.5)
      return 0;
    if( z > 6.5) 
      return 1;

    var factK = 1;
    var sum = 0;
    var term = 1;
    var k = 0;
    var loopStop = Math.exp(-23);
    while(Math.abs(term) > loopStop) 
    {
      term = .3989422804 * Math.pow(-1,k) * Math.pow(z,k) / (2 * k + 1) / Math.pow(2,k) * Math.pow(z,k+1) / factK;
      sum += term;
      k++;
      factK *= k;

    }
    sum += 0.5;

    return sum * 100;
  }

function up_2_6(score)
{
  if(score > 6)
  {
    return 12;
  }
  else
  {
    return 2*score;
  }
}

function up_2_10(score)
{
  if(score > 5)
  {
    return 10;
  }
  else
  {
    return 2*score;
  }
}

function universityRank(univ)
{
  if(univ > 4){
    return 20;
  }
  else
  {
    return univ*5;
  }
}

function GetIncomePercent(income)
{
  return GetZPercent((income-49445)/17200);
}

function BachelorRating(income, bar, cafe, food, movie_thea, night_club, university, sq_foot_ranking)
{
  //At most 20
  var inc_percentile = 0.2*GetIncomePercent(income);
  //at most 60
  var amenity = up_2_6(bar) + up_2_6(cafe) + up_2_6(food) + up_2_6(movie_thea) + up_2_6(night_club);
  //At most 20
  var university = universityRank(university);
  return inc_percentile + amenity + university;
}

function FamilyRating(income, convenience_store, department_store, restaurant, school, park)
{
  //At most 20
  var inc_percentile = 0.5*GetIncomePercent(income);
  //at most 60
  var amenity = up_2_10(convenience_store) + up_2_10(department_store) + up_2_10(restaurant) + up_2_10(school) + up_2_10(park);
  //At most 20
  return Math.round(inc_percentile + amenity);
}

function getZillowDemographics(zip)
{
    $.ajax({
        url: "/ajax/zillowzip.php?zip=" + zip
    }).done(processDemographics);
}

function processDemographics(data, status)
{
    data = $.parseXML(data);
    console.log(data);
    xmldata = data;
}

function getZillowHome(address, zip)
{
    
}