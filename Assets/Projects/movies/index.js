const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster; //ternary expression to check if image is N/A or not
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
            `;
    },
    inputValue(movie) { // takes a movie, and after user clicks on the option and return value should show inside the input 
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: { // this objects gets turned into a string and appendded into the axios url 
                apikey: 'ce38f3c0', // my api key i got unpon siging up to the website
                s: searchTerm //the search input user types in
            }
        });

        if (response.data.Error) {
            return [];
        }
        return response.data.Search; // getiing an array of different movies fetched
    }

};
//creating instance of autocomplete widget
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async(movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: { // this objects gets turned into a string and appendded into the axios url 
            apikey: 'ce38f3c0', // my api key i got unpon siging up to the website
            i: movie.imdbID //the search input user types in
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data); //displaying movie detail into the dom
    //checking which side the search is being made from
    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }
    // checking if both movies are defined
    if (leftMovie && rightMovie) {
        runComparison();
    }
};

//accessing both sides to compare value
const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
}

// getting movie detail after a movie is selected from search
const movieTemplate = (movieDetail) => {
    const dollars = parseInt( //turning string to int for comparsion
        movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
    );


    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));


    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);
    console.log(awards)

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image"> 
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media.content> 
                <div class="content"> 
                    <h1> ${movieDetail.Title}</h1>
                    <h4> ${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};