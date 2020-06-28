
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
        &nbsp;i&nbsp;<i class="icon-book"/>Literatura</span>, czyli najpopularniejsze utwory grane obecnie w stacjach radiowych, zwiastuny najlepszych filmów, które zostaną niebawem wyemitowane w TV <br/>oraz okładki aktualnych książkowych bestsellerów. <p/>Portal posiada trzy sekcje: 
        <span style={{ color: "rgba(255, 255, 255, 0.8)"}}><i class="icon-fire"/>Aktualności, <i class="icon-search"/> Eksploruj i <i class="icon-doc-landscape"/> Mój pulpit</span>  - aby przełączać się pomiędzy nimi użyj ikony:<span style={{fontSize: "19px", color: "rgba(255, 255, 255, 0.8)"}}><i class="icon-down-open"/></span> w lewym górnym rogu ekranu. W tym momencie znajdujesz się <br/>w <i class="icon-fire"/>Aktualnościach, w sekcji <i class="icon-search"/>Eksploruj odnajdziesz interesujące Cię ikony przeszukując wszystkie obecne i historyczne zasoby portalu. <i class="icon-doc-landscape"/>Mój pulpit to Twoja indywidualna przestrzeń na której możesz
        zapisywać i segregować wszystkie interesujące Cię ikony, jak również tworzyć swoje własne.
        <p/>
<span style={{ fontSize: "13px"}}> Po dwukrotnym kliknięciu na wybranej ikonie jej zawartość zostanie wyświetlona w tym polu - jeżeli ikona posiada tagi, zostaną one pokazane powyżej. Tytuł ikony wyświetlany jest pod tym polem po najechaniu na nią kursorem. Wszelkie dodatkowe informacje znajdziesz w poszczególnych sekcjach pod znakami &#9432;info oraz w dziale "Informacje i pomoc".</span>

   {/*  <span style={{fontSize: "20px", color: "rgba(255, 255, 255, 0.801)"}}>Nie posiadasz ikon na głównym pulpicie.</span><p/>
        Naciśnij <span class="addIconInfo">&#43;
        </span> przy wybranej ikonie w publicznych wizualizacjach:<br/>
        <span style={{color: "rgba(255, 255, 255, 0.801)"}}><i class="icon-popup"/>Eksploruj&nbsp;/&nbsp;<i class="icon-note"/>Muzyka&nbsp;/&nbsp;<i class="icon-video-alt"/>Film
        &nbsp;/&nbsp;<i class="icon-video"/>Seriale&nbsp;/&nbsp;<i class="icon-book"/>Literatura 
        &nbsp;/&nbsp;<i class="icon-calendar-empty"/>Wydarzenia</span>
        <br/>lub <span  class="addOwn" > &#43; </span>
        w prawym dolnym rogu ekranu, aby dodać nowe ikony.
        <div> W celu usunięcia ikony z pulpitu naciśnij przy niej <div class="removeEntityInfo">&#43;</div>. 
        Ikony znajdujące się już na Twoim pulpicie mogą być z niego usuwane również z poziomu publicznych wizualizacji. 

         </div>*/}
        </div>;


            return field;   
        

    }
}

export default withRouter(FirstField);