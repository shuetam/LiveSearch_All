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
            hasIcons: false,
            titleNum: false,
            descLength: 500,
            descNum: false,
            shared: false,
            privText: false,
            folderId: ""
        }
    }

    componentDidMount() {
        var folder = this.props.folder;
        debugger;
        if(folder) {
            this.setState({editedTitle: folder.title}); 
            this.setState({folderId: folder.id});
            this.setState({editedDesc: folder.shareDescription});
            this.setState({shared: folder.shared});
            this.setState({hasIcons: folder.hasIcons});
            if(folder.title)
                this.setState({titleLength: 20-folder.title.length});
            if(folder.shareDescription)
                this.setState({descLength: 500-folder.shareDescription.length});
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
        //var folder = this.props.folder;
        //debugger;
        //this.setState({editedDesc: ""});
        //this.setState({descLength: 500});
        this.setState({shared: true});
    }

    privateHandler = () => {
        this.setState({shared: false});
    }
    editFolderCancel = () => {
        this.props.saveFolder(null);
    }

    saveFolderHandler = () => {

    
        var folder = {
            Id: this.state.folderId,
            title: this.state.editedTitle,
            description: this.state.editedDesc,
            shared: this.state.shared
        }
debugger;
        this.props.saveFolder(folder);
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

var shareText = this.state.hasIcons? <div  className="lockIconF" style={{fontSize: "12px", padding: "5px", color: "rgba(255, 255, 255, 0.501)"}}>
Udostępnij folder aby umożliwić innym użytkownikom jego przeglądanie,
 obserwowanie i zapisywanie zawartych w nim ikon na swoich pulpitach. 
 Użytkownicy nie będą mieli możliwości 
 edytowania i usuwania ikon w Twoim folderze.</div> : 
 <div  className="lockIconF" style={{fontSize: "12px", padding: "5px", color: "rgba(255, 255, 255, 0.501)"}}>
Folder jest pusty. Dodaj do niego ikony aby móc udostępniać jego zawartość użytkownikom serwisu.</div>

var privateText = this.state.privText?  <div  className="lockIconF" style={{fontSize: "12px", padding: "5px", color: "rgba(255, 27, 27, 0.73)"}}>
Po zapisaniu folderu jako prywatny, wszystkie statystyki folderu zostaną wyzerowane.</div> : "";


let titleNum = this.state.titleNum?  this.state.titleLength : "";
let descNum = this.state.descNum?  this.state.descLength : "";

var shareIcon = this.state.shared? <div id={this.props.id}   className="lockIconF openIconF"><i  class="icon-lock-open-alt"/>
<span style={{fontSize: "15px"}}>Publiczny</span></div> 
: <div className="lockIconF" ><i class="icon-lock"/>
 <span style={{fontSize: "15px"}}>Prywatny</span></div>;

 var shareButton = this.state.shared?<div> <button  class="titleButton privateButton" onMouseLeave={() => this.setState({privText: false})}   onMouseOver={() => this.setState({privText: true})}   onClick={this.privateHandler} style={{fontSize: 12, width: "150px",  padding: "5px"}}>
 <i class="icon-lock"/>Ustaw jako prywatny</button> {privateText} </div> :<div><button class= {this.state.hasIcons? "titleButton" : "disable" } onClick={this.shareHandler} style={{fontSize: 14, width: "200px",  padding: "5px"}}>
    <i  class="icon-lock-open-alt"/>Udostępnij folder</button> {shareText}</div>

var shareButton = <div>
    {shareButton}</div>

var deleteButton = <button class="titleButton deleteButton" onClick={this.editFolderDelete} 
 style={{fontSize: 13, padding: "3px",  width: '90px'}}>Usuń folder</button>


var handlerButtons =  <div className="editHandler">
<button class="titleButton" onClick={this.saveFolderHandler} style={{fontSize: 15, padding: "3px",  width: '100px'}}>Zapisz</button>
&nbsp;
<button class="titleButton privateButton" onClick={this.editFolderCancel}  style={{fontSize: 13, padding: "3px",  width: '80px'}}>Anuluj</button>
</div>

    let editor = 
    (<div class="fieldAct fieldEditor"> {shareIcon} <span style={{fontSize: "17px"}}>
        Tytuł: {titleEditor}</span><span style={{fontSize: "12px", position: "absolute", top: "52px", left: "407px"}}>
            {titleNum}</span><p/>
            <div className={!this.state.shared? "disable": ""}>
            Publiczny opis:
            {descriptionEditor}
            </div>
            <span style={{fontSize: "12px", position: "absolute", top: "203px", left: "590px"}}>
            {descNum}</span>
            {shareButton}
            {handlerButtons}
         
            </div>)

      
            return editor;
     
    }
}

export default withRouter(EditField);