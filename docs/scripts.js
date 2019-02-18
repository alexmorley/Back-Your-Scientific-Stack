import { Autocomplete } from '/autocomplete.js';
"use strict"

const DEV = true;
var classes = document.getElementsByClassName.bind(document);
var tags = document.getElementsByTagName.bind(document);
var id = document.getElementById.bind(document);
var db_url;

setup();

let searchBar = {
  html: id("search"),
  populate_main: function (data) {
    views.back.hide();
    views.landing.hide();
    views.options.show();

    // Save Date from Request
    this.data = data;

    // Populate Main with Data from Request
    this.html.value = data.name;
    id("back-it-text")
      .innerHTML = "Back " + data.name;

    // Populate the related-software buttons
    let comparisons = classes("comparisons")[0].children
    for (let i of [0,1,2]) {
      comparisons[i].innerHTML = data["related-to"][i].longname
    }
    comparisons[3].onclick = function() {
      let c = 3;
      function update() {
        try { 
          for (let i of [0,1,2]) {
            comparisons[i].innerHTML = data["related-to"][i+c].longname;
          }
          c = c + 3;
        } catch(e) {
          c = 0;
          update();
        }
      }
      return update
    }()
  },
  data: null,
  autocomplete: null,
  register: function () {
    this.autocomplete = Autocomplete(this.html, {
      onclick: this.populate_main.bind(this),
      url: db_url
    });
    this.html.addEventListener("keyup",this.autocomplete.update);
  }
}


let slider = {
  html: id("people"),
  report: id("people-report"),
  onchange: function () {
    switch (this.html.value) {
      case "1": 
        this.report.innerHTML = "Just 1 Person";
        break;
      case "1000":
        this.report.innerHTML = "More than 1000 people";
        break;
      default:
        this.report.innerHTML = this.html.value + " people";
    }
  },
  register: function () {
    this.html.onchange = this.onchange.bind(this);
  }
}

let backButton = {
  html: classes("back")[0],
  onclick: function () {
    views.options.hide();
    views.back.show();
  },
  register: function () {
    this.html.onclick = this.onclick
  }
}

let views = {
  landing: {
    hide: function hide() {
      // Hide Title and Dropdown
      id("title")
        .style.display = "none";
      id("dropdown")
        .innerHTML = "";
    },
    show: function () {
    }
  },
  options: {
    hide: function () {
      tags("main")[0]
        .style.display = "none";
    },
    show: function () {
      tags("main")[0]
        .style.display = "block";
    }
  },
  back: {
    hide: function () {
      tags("main")[1]
        .style.display = "none";
    },
    show: function () {
      tags("main")[1]
        .style.display = "block";
    }
  }
}


searchBar.register();
slider.register();
backButton.register();

function setup() {
  if(DEV) {
    console.log("Dev mode on.");
    db_url = 'http://localhost:3000';
    //search_bar.onchange()
  } else {
    db_url = 'https://meta-open-db.com';
  }
}
