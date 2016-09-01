var canvas = $('canvas')[0];
var context = canvas.getContext('2d');

var Dots = [];
var ID = 0;
var colors = ['#FF9900', '#424242', '#BCBCBC', '#3299BB', '#B9D3B0', '#81BDA4', '#F88F79', '#F6AA93'];
var maximum = 100;

function Dot() {
    this.active = true;
    this.id = ID; ID++;

    this.diameter = 2 + Math.random() * 7;

    this.x = Math.round(Math.random() * canvas.width);
    this.y = Math.round(Math.random() * canvas.height);

    this.velocity = {
        x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.4,
        y: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 0.4
    };

    this.alpha = 0.1;
    this.maxAlpha = this.diameter < 5 ? 0.3 : 0.8;
    this.hex = colors[Math.round(Math.random() * 7)];
    this.color = HexToRGBA(this.hex, this.alpha);
}

Dot.prototype = {
Update: function() {
    if(this.alpha <= this.maxAlpha) {
      this.alpha += 0.005;
      this.color = HexToRGBA(this.hex, this.alpha);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if(this.x > canvas.width + 5 || this.x < 0 - 5 || this.y > canvas.height + 5 || this.y < 0 - 5) {
      this.active = false;
    }
},
Draw: function() {
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.save();
    context.beginPath();
    context.translate(this.x, this.y);
    context.moveTo(0, -this.diameter);

    for (var i = 0; i < 7; i++)
    {
      context.rotate(Math.PI / 7);
      context.lineTo(0, -(this.diameter / 2));
      context.rotate(Math.PI / 7);
      context.lineTo(0, -this.diameter);
    }

    if(this.id % 2 == 0) {
      context.stroke();
    } else {
      context.fill();
    }

    context.closePath();
    context.restore();
}
}

function Update() {
    GenerateDots();

    Dots.forEach(function(Dot) {
    Dot.Update();
    });

    Dots = Dots.filter(function(Dot) {
    return Dot.active;
    });

    Render();
    requestAnimationFrame(Update);
}

function Render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    Dots.forEach(function(Dot) {
    Dot.Draw();
    });
}

function GenerateDots() {
    if(Dots.length < maximum) {
        for(var i = Dots.length; i < maximum; i++) {
          Dots.push(new Dot());
        }
    }

    return false;
}

function HexToRGBA(hex, alpha) {
    var red = parseInt((TrimHex(hex)).substring(0, 2), 16);
    var green = parseInt((TrimHex(hex)).substring(2, 4), 16);
    var blue = parseInt((TrimHex(hex)).substring(4, 6), 16);

    return 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
}

function TrimHex(hex) {
    return (hex.charAt(0) == "#") ? hex.substring(1, 7) : hex;
}

function WindowSize(width, height) {
    if(width != null) { canvas.width = width; } else { canvas.width = window.innerWidth; }
    if(height != null) { canvas.height = height; } else { canvas.height = window.innerHeight; }
}

$(window).resize(function() {
    Dots = [];
    WindowSize();
});

WindowSize();
GenerateDots();
Update();


//////////////

var RestsBox = React.createClass({
  loadRestsFromServer: function(queryString){
      console.log(queryString);
      // Get data from filesystem
    //   $.ajax({
    //         url: this.props.url,
    //         dataType: 'json',
    //         cache: false,
    //         success: function(data) {
    //           this.setState({data: data});
    // $(".searchBox").removeClass("disabled");
    // $(".searchBox").prop( "disabled", false );
    //$(".loading").css( "display", "none" );
    //         }.bind(this),
    //         error: function(xhr, status, err) {
    //           console.error(this.props.url, status, err.toString());
    // $(".searchBox").removeClass("disabled");
    // $(".searchBox").prop( "disabled", false );
    //$(".loading").css( "display", "none" );
    //         }.bind(this)
    //       });

      // Get data from external API
      $.ajax({
        url: this.props.url,
        method: "POST",
        data: JSON.stringify({
                type: 'search',
                filter: {distributorId: 'food.co.il'},
                query: queryString
                }),
        // dataType: 'json',
        cache: false,
        contentType: "application/json",
        success: function(data) {
            $(".searchBox").removeClass("disabled");
            $(".searchTerm").prop( "disabled", false );
            $(".loading").css( "display", "none" );
            WindowSize();
            if(data.value)
                this.setState({data: data.value.results});
        }.bind(this),
        error: function(xhr, status, err) {
            $(".searchBox").removeClass("disabled");
            $(".searchTerm").prop( "disabled", false );
            $(".loading").css( "display", "none" );
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
      this.loadRestsFromServer("");
  },
  render: function() {
    return (
      <div className="restsBox">
        <header>
            <img src="images/fast-food.png"/>
            <h1>Wix Restaurants</h1>
            <SearchBox onSearch={this.loadRestsFromServer}/>
        </header>
        <RestList data={this.state.data}/>
      </div>
    );
  }
});

var SearchBox = React.createClass({
  getInitialState: function() {
    return {searchQuery: ''};
    $(".searchTerm").prop( "disabled", true );
  },
  handleKeyUp:function(e){
    if(e.keyCode == 13){
        this.performSearch(e);
    }
  },
  handleQueryChange: function(e) {
    this.setState({searchQuery: e.target.value});
  },
  performSearch: function(e) {
      e.preventDefault();
      $(".loading").css( "display", "block" );
      $(".searchTerm").prop( "disabled", true );
      $(".searchBox").addClass("disabled");
      var searchQuery = this.state.searchQuery.trim();
      this.props.onSearch(searchQuery);
    },
  render: function() {
    return (
      <div className="searchBox disabled">
         <div className="search">
            <input type="text" className="searchTerm" placeholder="What are you looking for?" value={this.state.searchQuery} onChange={this.handleQueryChange} onKeyUp={this.handleKeyUp}></input>
            <button type="submit" className="searchButton" onClick={this.performSearch} >
              <i className="fa fa-search"></i>
           </button>
         </div>
      </div>
    );
  }
});

function formatPhone(phonenum) {
    phonenum = phonenum.substring(4);
    if(phonenum[0] !== "1")
    {
        phonenum = "0" + phonenum;
        var position = 3;
        if(phonenum.length === 9)
        {
            position = 2;
        }
        return [phonenum.slice(0, position), "-", phonenum.slice(position)].join('');
    }
    else {
        return [phonenum.slice(0, 1), "-", phonenum.slice(1, 4), "-", phonenum.slice(4, 7), "-", phonenum.slice(7)].join('');

    }

}

var RestList = React.createClass({
  render: function() {
    //   if(this.props.data.value)
     var restsNodes = this.props.data.map(function(rest) {
      return (
        <RestItem title={rest.title.he_IL} phone={formatPhone(rest.contact.phone)} picture={rest.picture} rank={rest.rank} key={rest.id}>
        //   {rest.title}
        </RestItem>
      );
    });
    return (
      <div className="restList row">
        {restsNodes}
      </div>
    );
  }
});


var RestItem = React.createClass({
  render: function() {
    return (
      <div className="restItem col-md-3 col-xs-3">
        <img src={this.props.picture} className="rest-img"/>
        <div className="rest-text">
            <h1 className="rest-name">{this.props.title}</h1>
            <h2 className="rest-phone">{this.props.phone}</h2>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
   // URL for external API
  <RestsBox url="https://api.openrest.com/v1.1" />,
  // URL for local file
   // <RestsBox url="/api/rests" />,
  document.getElementById('content')
);
