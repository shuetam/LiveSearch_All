
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

        let field =
        <div class="fieldAct firstField">
        Witaj w 
        <span style={{ color: "rgba(231, 173, 64, 0.637)" }}> Live<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>S</span>earch </span> 
       - portalu który wizualizuje najnowsze i najpopularniejsze zasoby internetowe prezentując je w postaci ikon. Dzięki <span style={{ color: "rgba(231, 173, 64, 0.637)" }}> Live<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>S</span>earch </span> 
       będziesz zawsze na bieżąco, odkryjesz, zapiszesz i udostępnisz swoje ulubione filmy, utwory muzyczne, zdjęcia, książki itp.
       <p/>
       Wizualizacja którą aktualnie widzisz prezentuje najpopularniejsze ikony z powyższych działów:
       <span style={{ color: "rgba(255, 255, 255, 0.8)"}}><i class="icon-note"/>Muzyka,&nbsp;&nbsp;<i class="icon-video-alt"/>Film
            &nbsp;i&nbsp;<i class="icon-book"/>Literatura</span>, czyli najpopularniejsze utwory grane obecnie w stacjach radiowych, zwiastuny najlepszych filmów, które zostaną niebawem wyemitowane w TV <br/>oraz okładki aktualnych książkowych bestsellerów. <p/>Portal posiada trzy sekcje: 
            <span style={{ color: "rgba(255, 255, 255, 0.8)"}}><i class="icon-fire"/>Aktualności, <i class="icon-search"/> Eksploruj i <i class="icon-doc-landscape"/> Mój pulpit</span>  - aby przełączać się pomiędzy nimi użyj ikony:<span style={{fontSize: "19px", color: "rgba(255, 255, 255, 0.8)"}}><i class="icon-down-open"/></span> w lewym górnym rogu ekranu. W tym momencie znajdujesz się <br/>w <i class="icon-fire"/>Aktualnościach, w sekcji <i class="icon-search"/>Eksploruj odnajdziesz interesujące Cię ikony przeszukując wszystkie obecne i historyczne zasoby portalu. <i class="icon-doc-landscape"/>Mój pulpit to Twoja indywidualna przestrzeń na której możesz
            zapisywać i segregować wszystkie interesujące Cię ikony, jak również tworzyć swoje własne.
            <p/>
    <span style={{ fontSize: "13px"}}> Po dwukrotnym kliknięciu na wybranej ikonie jej zawartość zostanie wyświetlona w tym polu - jeżeli ikona posiada tagi, zostaną one pokazane powyżej. Tytuł ikony wyświetlany jest pod tym polem po najechaniu na nią kursorem. Wszelkie dodatkowe informacje znajdziesz w poszczególnych sekcjach pod znakami &#9432;info oraz w dziale "Informacje i pomoc".</span>

            </div>;


let field1 = this.props.fromFolder?
(<div class="fieldAct"><span style={{fontSize: "20px", color: "rgba(255, 255, 255, 0.801)"}}>Nie posiadasz jeszcze ikon w tym folderze.</span><p/>
    Upuść nad folderem wybrane ikony na pulpicie głównym
    <br/>lub naciśnij <span  class="addOwn" > &#43; </span>
    w prawym dolnym rogu ekranu aby dodać nowe ikony.
    </div>)
:
(<div class="fieldAct">
<span style={{fontSize: "25px", color: "rgba(255, 255, 255, 0.801)"}}>Twój pulpit</span>
<p/>
<span style={{fontSize: "20px", color: "rgba(255, 255, 255, 0.801)"}}>Nie posiadasz jeszcze ikon na głównym pulpicie.</span><p/>
    Naciśnij <span class="addIconInfo">&#43;
    </span> przy wybranej ikonie w sekcji <i class="icon-fire"/>Aktualności lub <i class="icon-search"/>Eksploruj 
    <br/>lub<span class="addOwnInfo" > &#43; </span>
    w lewym górnym rogu ekranu, aby dodać nowe ikony.
    <div> W celu usunięcia ikony z pulpitu naciśnij przy niej <div class="removeEntityInfo">&#43;</div>. 
    <br/>Ikony znajdujące się już na Twoim pulpicie mogą być z niego usuwane również w sekcjach <i class="icon-fire"/>Aktualności lub <i class="icon-search"/>Eksploruj.
<br/>Wszelkie dodatkowe informacje znajdziesz pod znakami &#9432;info oraz w dziale "Informacje i pomoc".
     </div>
    </div>)



 
        let info = (<div className="mainContent">
        <p style={{fontSize: '15px'}}>
        <span style={{ fontSize: "16px", color: "rgba(231, 173, 64, 0.87)" }}>Live<span style={{ color: "rgba(255, 255, 255, 0.8)" }}>S</span>earch </span> 
         jest portalem, który
         wizualizuje dane w postaci ikon i umożliwia ich gromadzenie,
         przeszukiwanie oraz dzielenie się nimi pomiędzy użytkownikami.</p> 
         <p/>
         Portal posiada trzy sekcje: 
            <span style={{ color: "rgba(255, 255, 255, 0.8)"}}><i class="icon-fire"/>Aktualności, <i class="icon-search"/> Eksploruj i <i class="icon-doc-landscape"/> Mój pulpit</span>  - aby przełączać się pomiędzy nimi użyj ikony:<span style={{fontSize: "19px", color: "rgba(255, 255, 255, 0.8)"}}><i class="icon-down-open"/></span> w lewym górnym rogu ekranu.
            <p/> 
            <span style={{color: 'white', textDecoration: 'underline'}}><i class="icon-fire"/>Aktualności:</span>
            <br/>
            W tej sekcji znajdują się wizualizacje aktualnych danych internetowych dotyczących muzyki, filmów i literatury. W dziale 'Muzyka' znajdziesz ikony prezentujące linki do utworów muzycznych zagranych w ostatnich 12 godzinach w wymienionych stacjach radiowych.
            W jednym czasie możesz wizualizować dane z maksymalnie 3 stacji, a w przypadku braku zaznaczenia jakiegokolwiek radia utwory zostaną zaprezentowane w sposób losowy. Wielkości ikon zależne są od ich aktualnej popularności, czyli sumarycznej ilości pojawienia się utworu w wybranych stacjach radiowych.<br/> Dział 'Filmy' to wizualizacje zwiastunów filmowych. Aktualnie w dziale tym odnajdziesz zwiastuny produkcji, które zostaną wyemitowane w najbliższych 24 godzinach w stacjach talewizji naziemnej czyli: TVP1, TVP2, TVN, Polsat, TVN7, TV4, Tv Puls, Stopklatka, Focus TV, Nowa TV, Metro, WP1 oraz Zoom TV. Wielkości ikon odzwierciedlają ocenę danego filmu w serwisie filmweb.pl.<br/>
            'Literatura' jest wizualizacją która prezentuje okładki książek, które aktualnie znajdują się na listach bestsellerów w największych księgarniach internetowych.
            <br/>W dziale 'Top' wyświetlane są najpopularniejsze ikony z powyżej omówionych działów
            czyli najczęściej zagrane utwory, najwyżej ocenione filmy oraz najlepiej sprzedające się pozycje książkowe.

             <p/> 
            <span style={{color: 'white', textDecoration: 'underline'}}><i class="icon-search"/>Eksploruj:</span>
            <br/>
            Sekcja 'Eksploruj' umożliwia wyszukiwanie ikon wśród wszytskich zasobów portalu - w tym w indywidualnych kolekcjach ikon znajdujących się na Pulpitach Użytkowników. Wpisana fraza wyszukiwana jest w tytułach oraz tagach ikon.

               <p/> 
            <span style={{color: 'white', textDecoration: 'underline'}}><i class="icon-doc-landscape"/>Mój pulpit:</span>
            <br/>
            Pulpit jest indywidualnym miejscem gdzie zapisywane są ikony dodawane przez zalogowanego
            użytkownika.<br/> W celu zapisania wybranej ikony na swoim pulpicie w sekcji 'Eksploruj' lub 'Aktulaności' kliknij przy niej znaczek <span class="addIconInfo">&#43;</span> - ikona zostanie zapisana na Twoim pulpicie i pojawi się na nim w miejscu w którym znajdowała się podczas dodawania.<br/>Każdą ikonę możesz usunąć ze swojego pulpitu w dowolnym momencie klikając w <span class="removeEntityInfo">&#43;</span>.<br/> Chcąc wyszukać i dodać własne ikony w sekcji Mój pulpit kliknij w znak plus u góry ekranu. Zostanie wyświetlone pole w którym należy wkleić link do źródła z którego zostaną wyszukane ikony. Wklejając adres strony internetowej lub link do postu na Instagramie, zostaną wyszukane zdjęcia znajdujące się na wpisanej stronie. Wklejając link do filmu YouTube, który chcemy umieścić na naszym pulpicie pojawi się ikona reprezentująca dany film. Istnieje również możliwość umieszczenia na pulpicie ikony linkującej do utworów, artystów i albumów w serwisie Spotify. Możesz to zrobić w łatwy sposób kopiując i wklejając kod osadzenia w opcjach udostępniania w serwisie Spotify.<br/>
            Po dodaniu wyszukanej ikony do pulpitu zostaną wyświetlone pola w których możesz nadać ikonie tytuł oraz tagi - jeżeli zależy Ci na tym aby Twoja ikona została łatwo wyszukana w sekcji Eksploruj przez innych Użytkowników nadaj jej tytuł oraz tagi najbardziej pasujące do zawartości.<br/>
            Swoją kolekcję ikon możesz dowolnie segregować umieszczając ikony w folderach. Aby to zrobić kliknij w znaczek reprezentującą folder u góry ekranu i nadaj folderowi tytuł.<br/>
            Lokalizacje ikon na pulpicie możesz dowolnie zmieniać, lecz aby zapamietać bieżące ulokowanie, tak aby było ono dostępne w interesującej Cię formie po ponownym uruchomieniu strony, należy kliknąć w znak  <i class="icon-floppy" />.


        <p><span style={{color: 'white', textDecoration: 'underline'}}>Ogólne porady dotyczące wizualizacji i obsługi serwisu:</span>
            <ul>
                <li>Wszystkie ważne informacje wyświetlane są na bieżąco i dostępne pod znakami &#9432;info.</li>
                <li>Zalecane jest użytkowanie serwisu w trybie pełnego ekranu.</li>
                <li>Aktywna ikona podświetlana jest na czerwono a jej zawartość wyświetlana w centrum strony. Kolor żółty oznacza, iż ikona została już otwarta podczas bieżącego przeglądania wizualizacji.</li>
                <li>W przypadku gdy aktywna ikona posiada tagi, są one wyświetlane nad polem zeprezentującym jej zawartość. Klikając w dowolny tag zostaną wyszukane i zaprezentowane ikony które się do niego odnoszą.</li>
                <li>Dane w dowolnej wizualizacji mogą być filtrowane za pomocą pola "Wyszukaj..." w prawym dolnym rogu ekranu. Zostają ukryte ikony które nie zawierają w swoim tytule wpisanej frazy.</li>
                <li>Filmy Youtube w wizualizacjach uruchamiane są automatycznie - po zakończeniu odtwarzania bieżącego wideo, system uruchamia następny film, który wybierany jest losowo.</li>
                <li>W celu udostępnienia poszczególnej ikony na zewnątrz serwisu, możesz skopiować do schowka jej indywidualny link i przekazać go gdziekolwiek zechcesz.</li>
    
                   
            </ul>   


        </p>
        
        <p><span style={{color: 'white', textDecoration: 'underline'}}>Dane wyświetlane w Aktualnościach serwisu:</span><br/>
            
            Wszystkie prezentowane dane w sekcjach Muzyka, Film i Literatura aktualizowane są
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

            <p/>
            <p/>
        </div>)


            return info;   


    }
}

export default withRouter(Information);