
import React, { Component } from 'react';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class FirstField extends Component {

    constructor(props) {
        super(props);
       
        this.state = {  
        }
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
        &nbsp;i&nbsp;<i class="icon-book"/>Literatura</span>, czyli najpopularniejsze utwory grane obecnie w stacjach radiowych, zwiastuny najlepszych filmów, które zostaną niebawem wyemitowane w TV oraz okładki aktualnych książkowych bestsellerów. <p/>Portal posiada naspępujace sekcje: 
        <span style={{ color: "rgba(255, 255, 255, 0.8)"}}><i class="icon-fire"/>Aktualności, <i class="icon-doc-landscape"/> Mój pulpit <i class="icon-folder-open"/> Obserwowane foldery, <br/><i class="icon-group"/> Foldery użytkowników i <i class="icon-search"/> Eksploruj</span>. 
        W tym momencie znajdujesz się 'Aktualnościach', 
        'Mój pulpit' to Twoja indywidualna przestrzeń na której możesz
        zapisywać wszystkie interesujące Cię ikony, jak również tworzyć swoje własne i grupować je w foldery. 'Foldery użytkowników' jest pulpitem zawierającym
        wszystkie publiczne foldery udostępnione przez społeczność portalu. Chcąc być na bieżąco z zawartością interesujących Cię folderów, możesz je obserwować dodając je tym samym 
        do swojej indywidualnej sekcji 'Obserwowane foldery'. 
        W sekcji  Eksploruj odnajdziesz interesujące Cię ikony przeszukując wszystkie obecne i historyczne zasoby portalu.<p/>
<span style={{ fontSize: "12px"}}> Po dwukrotnym kliknięciu na wybranej ikonie jej zawartość zostanie wyświetlona w tym polu - 
jeżeli ikona posiada tagi, zostaną one pokazane powyżej. Tytuł ikony wyświetlany jest pod tym polem po 
najechaniu na nią kursorem.
Wielkość ikon możesz zmieniać scrollując myszką.
 Wszelkie dodatkowe informacje znajdziesz w poszczególnych sekcjach pod znakami &#9432;info oraz w dziale "Informacje i pomoc".</span>
        </div>;


            return field;   
        

    }
}

export default withRouter(FirstField);