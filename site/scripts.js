import { Autocomplete } from '/autocomplete.js';
"use strict"

const DEV = true;
var db_url;

setup();

let search_bar = {
  html: document.getElementById("search"),
  populate_main: function (data) {
    // Hide Title and Dropdown
    document.getElementById("title")
      .style.display = "none";
    document.getElementById("dropdown")
      .style.display = "none";

    // Reveal Main
    document.getElementsByTagName("main")[0]
      .style.display = "block";

    // Populate Main with Data from Request
    this.html.value = data.name;
    document.getElementById("back-it-text")
      .innerHTML = "Back " + data.name;
  },
  autocomplete: null,
  register: function () {
    this.autocomplete = Autocomplete(this.html, {
      onclick: this.populate_main.bind(this),
      url: db_url
    }
    );
    this.html.addEventListener("keyup",this.autocomplete.update);
  }
}


let slider = {
  html: document.getElementById("people"),
  report: document.getElementById("people-report"),
  onchange: function () {
    switch (this.html.value) {
      case 1: 
        this.report.innerHTML = "Just 1 Person";
      case 1000:
        this.report.innerHTML = "More than 1000 people";
      default:
        this.report.innerHTML = this.html.value + " people";
    }
  },
  register: function () {
    this.html.onchange = this.onchange.bind(this);
  }
}


search_bar.register();
slider.register();

function setup() {
  if(DEV) {
    console.log("Dev mode on.");
    db_url = 'http://localhost:3000';
    //search_bar.onchange()
  } else {
    db_url = 'https://meta-open-db.com';
  }
}
