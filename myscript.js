
function create(htmlStr) {
  const frag = document.createDocumentFragment();
  const temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}
// this get function is short for the getElementById function
function get(x) {
  return document.getElementById(x);
}


var dict_country = {}
var dict_date = {}
var num_date = 0
var num_country = 0
var itr = 0

function getData(){
  fetch("https://pomber.github.io/covid19/timeseries.json")
  .then(response => response.json())
  .then(data => {
    num_date = 0
    for(country in data){
      // console.log(i);
      num_country ++
      dict_country[country] = {}
      for(date_entry in data[country]){
        // console.log(data[country][date_entry])

        var date = data[country][date_entry]["date"]
        var confirmed = data[country][date_entry]["confirmed"]
        var deaths = data[country][date_entry]["deaths"]
        var recovered = data[country][date_entry]["recovered"]
        // console.log(country+": date: "+date+" /confirmed: "+confirmed+" /deaths: "+deaths+" /recovered: "+recovered)
        dict_country[country][date] = confirmed + "." + deaths + "." + recovered
        if(dict_date[date] == undefined){
          dict_date[date] = {}
        }
        if(dict_date[date][country] == undefined){
          dict_date[date][country] = {}
        }
        dict_date[date][country]["confirmed"] = confirmed
        dict_date[date][country]["deaths"] = deaths
        dict_date[date][country]["recovered"] = recovered
        // dict_date[date][country] = confirmed + "." + deaths + "." + recovered
      }

    }
    num_date = Object.keys(dict_country[Object.keys(dict_country)[0]]).length
    num_country = Object.keys(dict_country).length
    console.log(dict_date)
    console.log("num_date:" + num_date)
    console.log("num_country:" + num_country)

    var i = 0
    for(date in dict_date){
      doSetTimeOut(date, i)

      i++
    }

  })
}
function doSetTimeOut(date, i){
  setTimeout(function(){
    plotData(date)
  },i * 200)
}


function plotData(date){
  get('left').innerHTML = ""
  get('middle').innerHTML = ""
  var total_confirmed = 0
  var max_confirmed = 0
  // const date_txt = create(`<p id ="date"></p>`)
  // get('left').appendChild(date_txt)
  get("date").innerHTML = date

  var arr_date = []

  for (var country in dict_date[date]) {
    if (dict_date[date].hasOwnProperty(country)) {
        arr_date.push( [ country, dict_date[date][country] ] )
        if(country!= "China"){
          total_confirmed += dict_date[date][country].confirmed
          if( dict_date[date][country].confirmed > max_confirmed){
            max_confirmed =  dict_date[date][country].confirmed
          }
        }

    }
  }
  arr_date.sort(function(first, second) {
    return second[1].confirmed - first[1].confirmed
  })

  for(var i = 0 ; i <= 20 ; i++){

    // console.log(arr_date[i])
    var country = arr_date[i][0]
    var confirmed = arr_date[i][1].confirmed
    var deaths = arr_date[i][1].deaths
    var recovered = arr_date[i][1].recovered
    const country_txt = create(`<p id ="country-${country}"></p>`)
    const country_bar = create(`
    <div id = "bar-container">
      <div id ="country_tag">${country} </div>
      <div id ="bar">
        <div id="myProgress-${country}">
          ${confirmed}
          <div id="myBar-${country}">
            ${recovered}
          </div>
        </div>
      </div>
    </div>`
  )

      if(i == 0){
        console.log("hi")
        get('left').appendChild(country_txt)
        get('left').appendChild(country_bar)
        // get(`country-${country}`).innerHTML = country+": confirmed: "+confirmed+" /deaths: "+deaths+" /recovered: "+recovered
        get(`myProgress-${country}`).style.width = confirmed * window.innerWidth /1000 + "px"
        get(`myBar-${country}`).style.width = recovered /confirmed * get(`myProgress-${country}`).style.width + "px"
      }
      else if(i <= 10){
        get('left').appendChild(country_txt)
        get('left').appendChild(country_bar)
        // get(`country-${country}`).innerHTML = country+": confirmed: "+confirmed+" /deaths: "+deaths+" /recovered: "+recovered
        get(`myProgress-${country}`).style.width = (confirmed/max_confirmed) * window.innerWidth *0.4  + "px"
        get(`myBar-${country}`).style.width = recovered /max_confirmed * window.innerWidth *0.4 + "px"
      }
      else{
        get('middle').appendChild(country_txt)
        get('middle').appendChild(country_bar)
        // get(`country-${country}`).innerHTML = country+": confirmed: "+confirmed+" /deaths: "+deaths+" /recovered: "+recovered
        get(`myProgress-${country}`).style.width = (confirmed/max_confirmed) * window.innerWidth *0.4 + "px"
        get(`myBar-${country}`).style.width = recovered /max_confirmed * window.innerWidth *0.4 + "px"
      }


  }
}

getData()

// module.exports = {
//   getData,plotData
// };

//https://www.worldometers.info/world-population/population-by-country/
