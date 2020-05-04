/**
*
* Milestone 1:
*Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film.
*Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
*Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 
*Titolo
*Titolo Originale
*Lingua Originale
*Voto (media)
*Utilizzare un template Handlebars per mostrare ogni singolo film trovato.
*  
*/

//Chiave API :f8d027bbf340b6b3bbe32c9525262297

$(document).ready(function () {

    //Ref
    var inputSearch = $('.search-bar');
    var button = $('.search-btn');
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    // Ricerca film con click su bottone
    button.click(function() {
        var searchTitle = inputSearch.val().trim();
        apiSearchMovie(searchTitle, template);
    });

}); // end doc ready

//functions

// Ajax 
function apiSearchMovie(search, template) {
    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie",
        method: 'GET',
        data: {
            api_key: 'f8d027bbf340b6b3bbe32c9525262297',
            query: search,
            language: 'it-IT'
        },
        success: function (response) {
            // pulizia input
            $('.movie-list').html('');
            for (var i = 0; i < response.results.length; i++) {
                var movie = response.results[i];
                visualTemplate(movie, template);
            }
        },
        error: function() {
            console.log('ERROR API');
        }
    });
};

// Funzione per visualizzare il template
function visualTemplate(item, template) {
    var context = {
        title: 'Titolo: ' + item.title,
        originalTitle:'Titolo originale: ' + item.original_title,
        language: 'Lingua originale: ' + item.original_language,
        averageVote: 'Voto: ' +  item.vote_average
    }

    var outputMovie = template(context);
    $('.movie-list').append(outputMovie);
};