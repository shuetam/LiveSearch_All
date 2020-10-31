import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';
import { URL, PATHES } from '../../environment';

class TagsField extends Component {

    constructor(props) {
        super(props);

        this.state = {
           tags: [
        ]
        }
    }

    setTags = () => {
        this.props.setTags(this.props.id,"ICON");
    }


searchTagItem = (item) => {
   this.props.searchTag(item.target.innerText);
   // this.props.history.push(PATHES.explore + "?q="+ item.target.innerText);
}
scrollRight = (item) => {

var  container = document.getElementById('tagsFieldId');

var scrollAmount = 0;
var slideTimer = setInterval(function(){
    container.scrollLeft += 10;
    scrollAmount += 10;
    if(scrollAmount >= 100){
        window.clearInterval(slideTimer);
    }
}, 25);

}

scrollLeft = (item) => {
    var  container = document.getElementById('tagsFieldId');

    var scrollAmount = 0;
    var slideTimer = setInterval(function(){
        container.scrollLeft -= 10;
        scrollAmount += 10;
        if(scrollAmount >= 100){
            window.clearInterval(slideTimer);
        }
    }, 25);
}


    render() {

var props = this.props;
let tagsList = "";
if(this.props.fromDesk) {
    tagsList = <label onClick={this.setTags} class="singleTag noTag"> Dodaj tagi dla tej ikony</label>
}


if(this.props.tags) {

    if(this.props.tags.length>0) {

     tagsList = 
    this.props.tags.map(item => {
        return <label onClick={this.searchTagItem} title={"Wyszukaj: "+item} class="singleTag"> {unescape(item)} </label>;
      });
    }
}

let tags = "";

if(!this.props.noIcons && this.props.fieldType != "FOLDER") {


    tags =   <div div className="tagsField" id="tagsFieldId">  
    <span id="tagsLeft" class="clickElem"  onClick = {this.scrollLeft}><i class="icon-left-open"/></span> 
            <label style={{marginTop: '2px'}}>Tagi:</label>
             {tagsList} <span id="tagsRight" class="clickElem"  onClick = {this.scrollRight} ><i class="icon-right-open"/></span>  
              </div> ;
}
     
            return tags;
     
    }
}

export default withRouter(TagsField);