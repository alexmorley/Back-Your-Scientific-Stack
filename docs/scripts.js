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

let backButtons = {
  html: classes("back-options")[0].children,
  report: classes("output-text")[0],
  active: {},
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
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  },
  register: function () {
    Array.from(this.html).forEach((el,i,arr) => {
      el.onclick = function () {
        this.set_active(el.innerHTML);
        let text
        switch(el.innerHTML) {
          case 'Donate directly':
            text = `
              You can support Python by becoming a member of the <a href='https://www.python.org/psf/'> Python Software Foundation</a> or <a href='https://numfocus.org/'>NumFocus.
              `;
            break;
          case 'Include them in your next grant':
            text = `
            <h2>How to include software donations in your grant</h2>
              Some funding agencies will accept donations as part of grant money if they feel that it will provide value to your project. Some example for justifying this is given below. Other agencies or foundations are not prepared to do this, in such a case check out the alternative methods.
            <h2>Sample Text for Justification</h2>
              We estimate we are saving $${calculator.value} from license fees by using Python. In order to support the reliability of the software we are using in this project we propose to use this amount to provide financial backing to the organisation responsible for development and maintenance.
            <h2>Alternatives</h2>
              Instead of donating money directly it is possible to provide financial support in other ways such as hiring a developer to spend X% of their time on the project - this can often help prioritise areas that might not otherwise get attention - or purchasing a support contract.
              `;
            break;
          case 'Find out more':
            text = `
            You can find out more about Python and related packages at <a href='https://www.python.org/psf/'>their website</a>.
            `;
            break;
          case 'Contribute':
            text = `
              Python is developed <a href='https://github.com/python/cpython'>on github.
            `;
            break;
        }
        this.report.innerHTML = text; 
      }.bind(this);
    });
  }
}

let organisations = {
  html: classes("organisation-type")[0].children,
  active: {'Non Profit': false, 'For Profit': true, 'Academic': false},
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
        el.classList.add("active");
      } else {
        el.classList.remove("active");
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

var comparisons = {
  html: classes("comparisons")[0].children,
  data: {},
  active: {},
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
        el.classList.add("active");
      } else {
        el.classList.remove("active");
      }
    });
  },
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
            el.onclick = () => {
              this.set_active(el.innerHTML);
              let price;
              try {
                price = data[0].pricing.priceInUSD;
              } catch(e) {
                // Set Random For Demo Purposes
                if (!(data[0])) {
                  data = [{}];
                }
                switch(el.innerHTML) {
                  case 'MATLAB':
                    price = 2150;
                    break;
                  case 'SPSS':
                    price = 1300;
                    break;
                  case 'Stata':
                    price = 1700;
                    break;
                  default:
                    price = Math.floor(Math.random()*1000);
                }
                data[0].pricing = {priceInUSD: price}
              }
              calculator.perPerson = price;
            }
            if(i==0) {
              el.onclick();
            }
          }.bind(this)
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
organisations.update();
backButtons.register();

function setup() {
  if(DEV) {
    console.log("Dev mode on.");
    db_url = 'http://localhost:3000';
    search_bar.onchange()
  } else {
    db_url = 'https://meta-open-db.com';
  }
}
