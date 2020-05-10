/**
* Milestone 1:
*Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film.
*Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
*Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 
*Titolo
*Titolo Originale
*Lingua Originale
*Voto (media)
*Utilizzare un template Handlebars per mostrare ogni singolo film trovato.
*/

/**
* Milestone 2:
* Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, 
* così da permetterci di stampare a schermo un numero di stelle piene 
* che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
* Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene
* Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, 
* gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API.
* Allarghiamo poi la ricerca anche alle serie tv.
*/

/**
* Milestone 3:
*In questa milestone come prima cosa  faremo un refactor delle chiamate ajax creando un’unica funzione
*alla quale passeremo la url, la apy key, la query, il type, ecc… 
*In questo modo potremo chiamare la ricerca sia con il keypress su enter che con il click.
*Poi, aggiungiamo la copertina del film o della serie al nostro elenco.
*Ci viene passata dall’API solo la parte finale dell’URL,
*questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
*/

/**
*Milestone 4:
*Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp, creando un layout completo simil-Netflix:
*Un header che contiene logo e search bar
*Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma di “card” 
*in cui lo sfondo è rappresentato dall’immagine di copertina (consiglio la poster_path con w342)
*Andando con il mouse sopra una card (on hover), appaiono le informazioni aggiuntive già prese nei punti precedenti più la overview
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
        console.log(searchTitle);
        
        //apiSearchMovie(searchTitle, template);
        //apiSearchTvSeries(searchTitle, template, 'tv');

        $('.movie-list').html('');
        apiSearch(searchTitle, template, 'tv');
        apiSearch(searchTitle, template, 'movie');
    });

    // Ricerca film con tasto enter
    inputSearch.keypress(function(e) {
        
        if(e.which === 13 || e.keyCode === 13) {
            var searchTitle = inputSearch.val().trim();
            $('.movie-list').html('');
            apiSearch(searchTitle, template, 'tv');
            apiSearch(searchTitle, template, 'movie');
        }
    });   

    
    // mostra dettagli film in hover su immagine
    $('body').on('mouseenter', '.movie', function() {
        $(this).children('.movie-list-details').fadeIn();
        $(this).children('.movie-poster').addClass('active');
    }).on('mouseleave', '.movie', function() {
        $(this).children('.movie-list-details').fadeOut();
        $(this).children('.movie-poster').removeClass('active');
    });
 

}); // end doc ready

//functions

// Ajax movie e tv
function apiSearch(search, template, type) {
    $.ajax({
        url: "https://api.themoviedb.org/3/search/" + type,
        method: 'GET',
        data: {
            api_key: 'f8d027bbf340b6b3bbe32c9525262297',
            query: search,
            language: 'it-IT'
        },
        success: function (response) {
            // pulizia input
            for (var i = 0; i < response.results.length; i++) {
                var movie = response.results[i];
                visualTemplate(movie, template, type);
            }
        },
        error: function() {
            console.log('ERROR API');
        }
    });
};

// Funzione per visualizzare il template
function visualTemplate(item, template, type) {

    //aggiunta locandina
    var posterPath = {
        url: 'https://image.tmdb.org/t/p/',
        posterSize: 'w342',
        imageUrl: item.poster_path
    };

    var poster = finalPoster(posterPath);  
    //  var poster = posterPath.url + posterPath.posterSize + posterPath.imageUrl;

    var context;
    if(type === 'movie'){

        context = {
            title: 'Titolo: ' + item.title,
            originalTitle:'Titolo originale: ' + item.original_title,
            language: 'Lingua originale: ' +  languageFlag(item.original_language),
            averageVote: 'Voto: ' +  voteStars(item.vote_average),
            type: 'Categoria: ' + type,
            overview: 'Overview: ' + item.overview.substr(0, 500) + '...',
            poster: poster
        }
    } else {
        context = {
            title: 'Titolo: ' + item.name,
            originalTitle:'Titolo originale: ' + item.original_name,
            language: 'Lingua originale: ' +  languageFlag(item.original_language),
            averageVote: 'Voto: ' +  voteStars(item.vote_average),
            type: 'Categoria: ' + type,
            overview: 'Overview: ' + item.overview.substr(0, 500) + '...',
            poster: poster
        }
       
    }

    var outputMovie = template(context);
    $('.movie-list').append(outputMovie);
};

//In caso di mancata locandina sostituisce con un 'no image'
function finalPoster(posterPath) {
    if(posterPath.imageUrl !== null){
        return  posterPath.url + posterPath.posterSize + posterPath.imageUrl;
    } else {
        return 'img/no-poster.png'
    }

}



// trasforma votazione da num. decimale ad intero e lo sostituisce con le stars
function voteStars(number){
    
    var value = Math.ceil(number/2);

    var stars = " ";
    for(var i = 1; i <= 5; i++){
        if(i <= value){
            stars += '<i class="fas fa-star"></i>';
        }else{
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// cambio lingua testuale con img bandiera
function languageFlag(language) {
    var res = '';
    switch (language) {
        case 'it':
            res = '<img class="flag" src="img/it.svg" alt="IT">';
            break;
        case 'en':
            res = '<img class="flag" src="img/en.svg" alt="EN">';
            break;
        default:
            res = language;
            break;
    };
    return res;
}