import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class EditField extends Component {

    constructor(props) {
        super(props);


        this.state = {
            editedTitle: "",
            editedDesc: "",
            titleLength: 20,
  
            titleNum: false,
            descLength: 500,
            descNum: false,
            shared: this.props.shared
        }
    }


    editTitle = (value) => {

            if(value.length>20) {
                document.getElementById("editTitleFolder").value = this.state.editedTitle;
             
            }
            else {
                this.setState({editedTitle: value})
                this.setState({titleLength: 20 - value.length})
            }
    }

    editDesc = (value) => {

        if(value.length>500) {
            document.getElementById("editDescFolder").value = this.state.editedDesc;
         
        }
        else {
            this.setState({editedDesc: value})
            this.setState({descLength: 500 - value.length})
        }
    }

    shareHandler = () => {
        this.setState({shared: !this.state.shared});
    }


    render() {
 

let titleEditor =
<span   class="fieldEditorInput">
<input id="editTitleFolder" type="text"
autofocus="true"
onFocus={e =>   this.setState({titleNum: true})}
onBlur= { e => this.setState({titleNum: false})}
placeholder =  "Wpisz tytuł dla folderu"

 onChange={e => this.editTitle(e.target.value)} 
 value={this.state.editedTitle} /> 
 </span>


let descriptionEditor =
<div   class="fieldEditorInput">
<textarea id="editDescFolder" type="text"
autofocus="true"
onFocus={e =>   this.setState({descNum: true})}
onBlur= { e => this.setState({descNum: false})}
placeholder =  "Opisz czego dotyczy ten folder i poinformuj użytkowników o jego zawartości"

 onChange={e => this.editDesc(e.target.value)} 
 value={this.state.editedDesc} /> 
 </div>

let titleNum = this.state.titleNum?  this.state.titleLength : "";
let descNum = this.state.descNum?  this.state.descLength : "";

var shareIcon = this.state.shared? <div id={this.props.id}   className="lockIconF openIconF"><i  class="icon-lock-open-alt"/>
<span style={{fontSize: "15px"}}>Publiczny</span></div> 
: <div className="lockIconF" ><i id={this.props.id} class="icon-lock"/>
 <span style={{fontSize: "15px"}}>Prywatny</span></div>;

 var shareButton = this.state.shared? <button class="titleButton privateButton" onClick={this.shareHandler} style={{fontSize: 12, width: "150px",  padding: "5px", marginLeft: "15px"}}>
 Ustaw jako prywatny</button> :<div><button class="titleButton" onClick={this.shareHandler} style={{fontSize: 14, width: "200px",  padding: "5px", marginLeft: "15px"}}>
 Udostępnij folder  </button> <div  className="lockIconF" style={{fontSize: "12px", padding: "5px", color: "rgba(255, 255, 255, 0.501)"}}>Udostępnij folder aby umożliwić innym użytkownikom jego przeglądanie,
      obserwowanie i zapisywanie zawartych w nim ikon na swoich pulpitach. Użytkownicy nie będą mieli możliwości 
      edytowania i usuwania ikon w tym folderze.</div></div>

var shareButton = <div>
    {shareIcon} 
    {shareButton}
</div>

var deleteButton = <button class="titleButton deleteButton" onClick={this.editFolderDelete} 
 style={{fontSize: 13, padding: "3px",  width: '90px'}}>Usuń folder</button>


var handlerButtons =  <div className="editHandler">
<button class="titleButton" onClick={this.editFolderHandler} style={{fontSize: 15, padding: "3px",  width: '100px'}}>Zapisz</button>
&nbsp;
<button class="titleButton privateButton" onClick={this.editFolderCancel}  style={{fontSize: 13, padding: "3px",  width: '80px'}}>Anuluj</button>
</div>

        let editor = 
    (<div class="fieldAct fieldEditor"><span style={{fontSize: "17px"}}>
        Tytuł: {titleEditor}</span><span style={{fontSize: "12px", position: "absolute", top: "28px", left: "407px"}}>
            {titleNum}</span><p/>
            <div className={!this.state.shared? "disable": ""}>
            Publiczny opis:
            {descriptionEditor}
            </div>
            <span style={{fontSize: "12px", position: "absolute", top: "180px", left: "590px"}}>
            {descNum}</span>
            {shareButton}
            {handlerButtons}
            {deleteButton}
            </div>)

      
            return editor;
     
    }
}

export default withRouter(EditField);