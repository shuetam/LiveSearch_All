
import React, { Component } from 'react';
import './Style.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class Information extends Component {

    constructor(props) {
        super(props);

        this.state = {  
        }
    }

    goTo = (event) => {
        window.open(event.target.id);
    }
       

    render() {
 
        let info = (<div className="mainContent">
        <p>
        <span style={{ color: "rgba(231, 173, 64, 0.637)" }}>Live<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>S</span>earch </span> 
         jest portalem, który wizualizuje aktualne dane internetowe i umożliwia ich zapisywanie na własnym wirtualnym 
        pulpicie. Aktualnie dostępne są prezentacje dotyczące muzyki, filmów i literatury - 
        szczegółowe informacje na temat każdej z wizualizacji znajdziesz w poszczególnych 
        sekcjach pod znakiem "&#9432;info". Dane wyświetlane są w postaci ikon reprezentujących 
        film Youtube, zdjęcie lub utwory muzyczne serwisu Spotify.
        </p>
      
        <p>Wszystkie prezentowane dane w sekcjach Muzyka, Film i Literatura aktualizowane są
             na bieżąco i pochodzą z oficjalnych, publicznie dostępnych zasobów internetowych.
              Poniżej znajdują się linki do źródeł dla poszczególnych wizualizacji:</p>
        <p>Muzyka - utwory grane w stacjach radiowych:
        <div style={{fontSize:"12px"}}>
           <a href = "https://www.odsluchane.eu/">https://www.odsluchane.eu/</a><br/>
           <a href = "https://live.rmf.fm/">https://live.rmf.fm/</a><br/>
           <a href =  "https://www.rmfmaxxx.pl/muzyka/playlista">https://www.rmfmaxxx.pl/muzyka/playlista</a><br/>
           <a href =  "https://www.radiozet.pl/Radio/Sprawdz-co-gralismy">https://www.radiozet.pl/Radio/Sprawdz-co-gralismy</a><br/>
           <a href = "http://www.voxfm.pl/co-gralismy">http://www.voxfm.pl/co-gralismy</a><br/>
           <a href =  "https://audycje.zloteprzeboje.tuba.pl/co-gralismy">https://audycje.zloteprzeboje.tuba.pl/co-gralismy</a><br/>
           <a href = "https://www.polskieradio.pl/9,Trojka/33,Playlista">https://www.polskieradio.pl/9,Trojka/33,Playlista</a><br/>
        </div>
        </p>

         <p>Telewizja - filmy emitowane w stacjach naziemnych:
        <div style={{fontSize:"12px"}}>
           <a href = "https://www.telemagazyn.pl/">https://www.telemagazyn.pl/</a><br/>
           <a href = "https://www.tvp.pl/program-tv">https://www.tvp.pl/program-tv</a><br/>
           <a href =  "https://www.tvn.pl/program-tv.html">https://www.tvn.pl/program-tv.html</a><br/>
           <a href =  "https://www.polsat.pl/program-tv/">https://www.polsat.pl/program-tv/</a><br/>
           <a href = "https://stopklatka.pl/program">https://stopklatka.pl/program</a><br/>
           <a href =  "https://www.tvn7.pl/program-tv.html">https://www.tvn7.pl/program-tv.html</a><br/>
           <a href = "https://tv.wp.pl/kanal/tv-puls">https://tv.wp.pl/kanal/tv-puls</a><br/>
        </div>
        </p>

         <p>Literatura - aktualne bestsellery:
        <div style={{fontSize:"12px"}}>
           <a href = "https://www.aros.pl">https://www.aros.pl</a><br/>
           <a href = "https://bonito.pl/bestsellery">https://bonito.pl/bestsellery</a><br/>
           <a href =  "https://czytam.pl/bestsellery.html">https://czytam.pl/bestsellery.html</a><br/>
           <a href =  "https://www.empik.com/bestsellery/ksiazki">https://www.empik.com/bestsellery/ksiazki</a><br/>
           <a href = "https://www.gandalf.com.pl/bestsellery/">https://www.gandalf.com.pl/bestsellery/</a><br/>
           <a href =  "https://www.inbook.pl/bestsellers/list/2">https://www.inbook.pl/bestsellers/list/2</a><br/>
           <a href = "https://livro.pl/bestsellery.html">https://livro.pl/bestsellery.html</a><br/>
           <a href = "https://www.profit24.pl/bestsellery-dzial-ogolny">https://www.profit24.pl/bestsellery-dzial-ogolny</a><br/>
        </div>
        </p>

        <p>Ogólne porady dotyczące wizualizacji i obsługi serwisu:
            <ul>
                <li>Wszystkie ważne informacje wyświetlane są na bieżąco i dostępne pod znakami &#9432;info.</li>
                <li>Zalecane jest użytkowanie serwisu w trybie pełnego ekranu.</li>
                <li>Aktywna ikona podświetlana jest na czerwono a jej zawartość wyświetlana w centrum strony. Kolor żółty oznacza, iż ikona została już otwarta podczas bieżącego przeglądania wizualizacji.</li>
                <li>Filmy Youtube w wizualizacjach uruchamiane są automatycznie - po zakończeniu odtwarzania bieżącego wideo, system uruchamia następny film, który wybierany jest losowo.</li>
                <li>Po zalogowaniu się, użytkownik dostaje możliwość zapisywania ikon na własnym pulpicie. Ikona dodana z poziomu publicznej wizualizacji pojawia się na pulpicie w miejscu w którym znajdowała się na ekranie podczas dodawania. Ikony dodane do pulpitu użytkownika mogą być z niego usuwane zarówno z poziomu pulpitu jak i publicznych wizualizacjach.</li>
              
                
            </ul>   


        </p>
            <p/>
            <p/>
        </div>)


            return info;   


    }
}

export default withRouter(Information);