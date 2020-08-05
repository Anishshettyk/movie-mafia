const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = "";
            } else {
                link.style.animation = `navLinksFade 0.5s ease forwards ${index /7 +0.3}s`;
            }
        });
        burger.classList.toggle('toggle');
    });


}
navSlide();



const autoCompleteConfig = {
    renderOption(movie) {
        let imageSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
        <img src="${imageSrc}"/>
        ${movie.Title}
        [  ${movie.Year}]
        `;
    },





    inputValue(movie) {
        return movie.Title;
    },


    async fetchData(searchTerm) {
        //only the api url is passed with the help of axios.
        const response = await axios.get("http://www.omdbapi.com/", {
            //api params is used to add the api key to the url.
            params: {
                //apikey is always small letters.
                apikey: "9077dcf7",
                s: searchTerm,
            }
        });
        if (response.data.Error) {
            return [];
        }
        //loging the data got back.
        return response.data.Search;
    }
};

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    },
});
let leftMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        //api params is used to add the api key to the url.
        params: {
            //apikey is always small letters.
            apikey: "9077dcf7",
            i: movie.imdbID,
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === "left") {
        leftMovie = response.data;
    }
};



const movieTemplate = (movieDetail) => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));


    const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);


    return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" alt="">
      </p>
    </figure>
    <div class="media-content">
  <div class="content">
    <h1>${movieDetail.Title}</h1>
    <h4>${movieDetail.Genre}</h4>
    <p>${movieDetail.Plot}</p>
  </div>
</div>
  </article>
  <article class="notification is-primary" data-value=${awards}>
  <p class="title">${movieDetail.Awards}</p>
  <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-primary" data-value=${dollars}>
  <p class="title">${movieDetail.BoxOffice}</p>
  <p class="subtitle">BoxOffice</p>
  </article>
  <article class="notification is-primary" data-value=${metascore}>
  <p class="title">${movieDetail.Metascore}</p>
  <p class="subtitle">Metascore</p>
  </article>
  <article class="notification is-primary" data-value=${imdbRating}>
  <p class="title">${movieDetail.imdbRating}</p>
  <p class="subtitle">IMDB rating</p>
  </article>
  <article class="notification is-primary" data-value=${imdbVotes}>
  <p class="title">${movieDetail.imdbVotes}</p>
  <p class="subtitle">IMDB votes</p>
  </article>
`;
}