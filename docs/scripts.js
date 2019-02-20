import { Autocomplete, search } from './autocomplete.js';
"use strict"

const DEV = false;
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
    comparisons.populate(data);
    comparisons.register(data);
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

var comparisons = {
  html: classes("comparisons")[0].children,
  data: {},
  populate: function (data,c=0) {
    for (let i of [0,1,2]) {
      let el = this.html[i];
      let d  = this.data;
      let longname = data["related-to"][i+c].longname;
      el.innerHTML = longname;
      search(longname, {url: db_url})
        .then(
          function resolve(data) {
            d[longname] = data[0];
            el.onclick = function () {
              let price;
              try {
                price = data[0].pricing.priceInUSD;
              } catch(e) {
                // Set Random For Demo Purposes
                price = Math.floor(Math.random()*1000);
                data[0].pricing = {priceInUSD: price}
              }
              calculator.perPerson = price;
            }
          }
        );
    }
  },
  register: function (data) {
    let t = this;
    this.html[3].onclick = function() {
      let c = 3;
      function update() {
        try { 
          t.populate(data,c);
          c = c + 3;
        } catch(e) {
          c = 0;
          update();
        }
      }
      return update
    }()
  }
}

let organisations = {
  html: classes("organisation-type")[0].children,
  active: {'Non Profit': false, 'For Profit': false, 'Academic': false},
  set_active: function (code) {
    this.active[code] = true;
    Object.keys(this.active)
      .forEach((el,i,arr) => {
        if (el != code) {
          this.active[el] = false;
        }
      });
    this.update()
  },
  update: function () {
    Array.from(this.html).forEach((el,i,arr) => {
      if(this.active[el.innerHTML]) {
        el.style['background-color'] = '#bbb';
      } else {
        el.style['background-color'] = '#f6f6f6';
      }
    });
  },
  register: function () {
    Array.from(this.html).forEach((el,i,arr) => {
      el.onclick = function () {
        this.set_active(el.innerHTML)
        switch (el.innerHTML) {
          case "For Profit":
            calculator.multiplier = 1.0;
            break;
          case "Non Profit":
            calculator.multiplier = 0.5;
            break;
          case "Academic":
            calculator.multiplier = 0.8;
            break;
        }
      }.bind(this);
    });
  }
}

let calculator = new Proxy(
  {
    html: document.getElementById('result'),
    value: 1000,
    perPerson: 100,
    numPeople: 1,
    multiplier: 1,
  },
  {
    set: function (obj, prop, newval) {
      obj[prop] = newval;
      obj.value = obj.perPerson * obj.numPeople * obj.multiplier;
      obj.html.innerHTML = '$' + Math.floor(obj.value);
      return true
    }
  }
);

let slider = {
  html: id("people"),
  report: id("people-report"),
  onchange: function () {
    switch (this.html.value) {
      case "1": 
        this.report.innerHTML = "Just 1 Person";
        break;
      case "100":
        this.report.innerHTML = "More than 100 people";
        break;
      default:
        this.report.innerHTML = this.html.value + " people";
    }
    calculator.numPeople = this.html.value;
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
organisations.register();

function setup() {
  if(DEV) {
    console.log("Dev mode on.");
    db_url = 'http://localhost:3000';
    search_bar.onchange()
  } else {
    db_url = 'https://meta-open-db.com';
  }
}
