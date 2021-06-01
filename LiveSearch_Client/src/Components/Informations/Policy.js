
import React, { Component } from 'react';
import './Style.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class Policy extends Component {

    constructor(props) {
        super(props);

        this.state = {  
        }
    }

    goTo = (event) => {
        window.open(event.target.id);
       // this.props.history.push(event.target.id);
    }

    render() {
 
        let policy = (<div className="mainContent">
        <p style={{color: "rgba(255, 255, 255, 0.719)"}}>Poniższa polityka prywatności portalu <span style={{ color: "rgba(231, 173, 64, 0.836)" }}>Live<span style={{ color: "rgba(255, 255, 255, 0.6)" }}>S</span>earch</span>.pl wyjaśnia zasady oraz cele przetwarzania Twoich danych osobowych. 
              <br/>Przedstawia również działanie plików cookies (tzw. "ciasteczek") używanych na stronie.</p>
        <br/>
        <p style={{color: "rgba(255, 255, 255, 0.719)"}}>Administrator danych osobowych:</p>
        Właścicielem i twórcą serwisu oraz administratorem Waszych danych osobowych jest Mateusz Bieda zam. ul. Barska 61 Kraków - kontakt email: admin@livesearch.pl.
        <br/>
        <br/>
        <br/>
        <p style={{color: "rgba(255, 255, 255, 0.719)"}}>Jakie dane osobowe przetwarzamy i w jaki sposób się to odbywa?</p>

        W celu usprawnienia użytkownikom procesu rejestracji a przy tym zapewnienia maksimum bezpieczeństwa, portal livesearch.pl wykorzystuje mechanizm zewnętrznego uwierzytelnienia. 
        Logowanie do serwisu odbywa się za pośrednictwem Twojego konta Google lub Facebook. 
        Podczas rejestracji (tj. pierwszego logowania) pobierane są następujące dane:
        <br/>
        adres email, nazwa użytkownika oraz link do zdjęcia profilowego
        <br/>
        Dane te używane są do założenia konta a następnie jego identyfikacji w bazie danych portalu livesearch. 
        Nie udostępniamy nikomu Twoich danych ani nie wysyłamy jakichkolwiek maili marketingowych. 
        <br/> 
        Google i Facebook nie udostępniają nam żadnych poufnych danych oraz nie dają nam jakichkolwiek uprawnień do edytowania i publikowania treści na Twoich kontach.
        Aby dowiedzieć się więcej zapoznaj się z politykami prywatności Google oraz Facebooka oraz informacjami dotyczącymi zewnętrznej autoryzacji:
        <br/>
        <div onClick={this.goTo} class="switchHref"  id="https://www.facebook.com/privacy/explanation">Polityka prywatności - Facebook</div>
        <div onClick={this.goTo} class="switchHref" id="https://policies.google.com/privacy?hl=pl">Polityka prywatności - Google</div>
        <div onClick={this.goTo} class="switchHref" id="https://www.facebook.com/help/223184117694507?helpref=related">Logowanie Facebook</div>
        <div onClick={this.goTo} class="switchHref" id="https://support.google.com/accounts/answer/112802?hl=pl&ref_topic=7188760">Logowanie Google</div>
        <br/>
        <br/>
        <p style={{color: "rgba(255, 255, 255, 0.719)"}}>Jakie przysługują Ci prawa wobec Twoich danych?</p>
        W każdej chwili masz prawo do żądania dostępu do Twoich danych, ich sprostowania, ograniczenia przetwarzania oraz usunięcia, jak również do wniesienia skargi do organu nadzorczego w związku z nieprawidłowym przetwarzaniem danych osobowych.
        <br/>
        <br/>
        <p style={{color: "rgba(255, 255, 255, 0.719)"}}>Polityka plików "cookies":</p>
        Pliki "cookies" to niewielkie pliki tekstowe, przechowywane w przeglądarce internetowej Użytkownika. Pliki te zawierają między innymi nazwę strony internetowej z której pochodzą, unikalny identyfikator oraz informacje o czasie ich wygaśniecia. Używamy cookies do utrzymywania sesji po zalogowaniu się, zapamiętywania Twoich indywidualnych ustawień i dostosowywania wyświetlanych treści do indywidualnych preferencji.<br/>
        Zewnętrzne pliki cookies:
        <br/>
        W serwisie wykorzystywane są wtyczki społecznościowe Facebook oraz Google, jak również kody osadzenia filmów Youtube i utworów Spotify. Sprawia to, że podczas użytkowania serwisu, mogą zostać zapisywane pliki cookies pochodzące od: Google, Facebooka, Youtube oraz Spotify. Szczegółowe informacje o plikach cookies wykorzystywanych przez te serwisy znajdziesz na ich oficjalnych stronach.
        W każdej chwili możesz dostosować lub usunąć mechanizm zapisywania plików cookies w ustawianiach swojej przeglądarki internetowej. Jednocześnie informujemy, że wyłączenie cookies na naszej stronie może spowodować błędne działanie niektórych funkcji.
        Szczegółowe informacje na temat zarządzania plikami cookie, zależnie od przeglądarki dostępne są pod linkami:
        <br/>
        <div onClick={this.goTo} class="switchHref"  id="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=pl">Cookies w Chrome</div>
        <div onClick={this.goTo} class="switchHref"  id="https://support.mozilla.org/pl/kb/usuwanie-ciasteczek-i-danych-stron-firefox?redirectlocale=pl&redirectslug=usuwanie-ciasteczek">Cookies w Firefox</div>
        <div onClick={this.goTo} class="switchHref"  id="https://support.apple.com/pl-pl/guide/safari/sfri11471/mac">Cookies w Safari</div>
        <div onClick={this.goTo} class="switchHref"  id="https://blogs.opera.com/news/2015/08/how-to-manage-cookies-in-opera/">Cookies w Opera</div>
        <div onClick={this.goTo} class="switchHref"  id="https://support.microsoft.com/pl-pl/help/4027947/microsoft-edge-delete-cookies">Cookies w Edge</div>
        <br/>
        <br/>
        <br/>
        </div>)


            return policy;   


    }
}

export default withRouter(Policy);