const search_input = document.querySelector('input#search_input')
const search_triggered = document.querySelector('section.search_triggered')
const radio_value = document.querySelector('#radio_value')
const searchInputURL = "http://127.0.0.1:5000/"
const radio = document.querySelectorAll('label')
const body = document.querySelector('div.body')


radio.forEach((item, i) => {
  item.addEventListener('click', ()=>{
    radio_value.innerText =  item.innerText
  })
})


search_input.addEventListener('input', async (e)=>{
  body.style.height = "80vh"
  search_triggered.innerHTML = ""
  // console.log(search_input.value)
  let url = searchInputURL + radio_value.innerText.toLowerCase() + "/" + search_input.value
  console.log(url)
  if (search_input.value =="") return false
  let response = await fetch(url, {
    method: "GET",
    headers: {
        "Content-type": "application/json charset=UTF-8",
        "Access-Control-Allow-Origin" : "*"
    }
  })
  let data = await response.json()
  console.log(data)
  if (radio_value.innerText.toLowerCase() == "song"){
    data.forEach((item, i) => {
      let card = search_card(item["_source"])
      // console.log(card)
      search_triggered.appendChild(card)
    })
  }
  else if (radio_value.innerText.toLowerCase() == "lyrics") {
    data.forEach((item, i) => {
      let card = lyrics_card(item["_source"])
      // console.log(card)
      search_triggered.appendChild(card)
    })
  }


})



function search_card(item){
  let card = document.createElement('article')
  card.setAttribute('class', 'search_result')
  card.innerHTML = `
      <p class="search_head">
        <span><a href="https://www.youtube.com/results?search_query=${item["Artist"] + item["Song"]}" target="_blank"> ${item["Song"]} </a></span>
      </p>
      <p>
      artiste: ${item["Artist"]} - album : ${item["Album"]} - genre: ${item["Genres"]} - duree: ${item["Duration"]}
      </p>
      <hr>
  `
  return card
}


function lyrics_card(item){
  let card = document.createElement('a')
  card.setAttribute('href', item['Lyrics_URL'])
  card.setAttribute('class', '_alink')

  card.innerHTML = `
      <article class="lyrics_card">
        <p class="lyrics_head">
        <span class="song_title">${item["Song_Title"]}</span> - <span class="artist_name">${item["Artist_Name"]}</span> - <span class="year">${item["Year"]}</span>
        </p>
        <p class="lyrics_display">
          ${item["Lyrics"].substring(0, 200)}
        </p>
        <hr>
      </article>
  `
  return card
}

// animations

function randomData(){
  data = new Array()
  for(let i=1; i<101; i++){
    data.push(Math.ceil(Math.random() * 100))
  }
  return data
}

// Animation with d3js
var colorScale = d3.scaleLinear()
      .domain([0, 100])
      .range(['#7DE2D1', '#FEC514', '#F04E98'])


let svg = d3.select('body')
          .append('svg')
          .attr('position', 'relative')
          .attr('top','0')
          .attr('width', '100%')
          .attr('height', '100vh')


let circles = svg.selectAll('circle')
          .data(randomData())
          .enter()
            .append('circle')
            .attr('cy', function(value, ind){
              return Math.random() * value * ind
            })
            .attr('cx', function(value, ind){
              return Math.random() * value * 10
            })
            .attr('r', function(value, ind){
              return Math.random() * value * ind
            })
            .attr('fill', function(value){
              return colorScale(value)
            })
            .attr('opacity', '0.6')

function mouve(){
  circles.transition()
    .duration(2200)
    .attr('r', function(value, i){
        return value * Math.random() * 2
      })
      .attr('cy', function(value, i){
        return Math.random() * value * i
      })
      .attr('cx', function(value, i){
        return Math.random() * value * i
      })
      .attr('opacity', function(value){
        return value * 0.006
      })
      .attr('fill', function(value){
        return colorScale(value * Math.random() * 2)
      })
}

setInterval(mouve, 2000)
setInterval(()=>{
  if(search_input.value ==""){
    body.style.height = "0vh"
    return false
  }
}, 10000)
