import React from 'react';


//------------components------------------
const Button = (props) => {
  return (
    <input type="submit" value={props.name} />
  );
}

const CityForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <label>
        Search by city:&nbsp;<br />
        <input type="text" value={props.value} onChange={props.onChange} />
      </label>
      &nbsp;<Button name="Search" />
    </form>
  );
};

const CityCardHolder = (props) => {
  return (
    <div id="city-card-holder">{props.value}</div>
  );
}

class CityWeather extends React.Component {
  constructor(props) {
    //learning note: pass props to the parent class in constructor to use `this` properly
    super(props);
    this.state = {
      userCity : "", //holds whatever value the user has typed
      cityCard : "" //slot will hold the weather info or error
    };

    //learning note: bind `this` here so that props can be used properly outside the constructor function
    this.autocompleter = this.autocompleter.bind(this);
    this.populateCityCard = this.populateCityCard.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  //learning note: never set state directly. use the setter
  //also! don't pass this.setState to a component directly. use a wrapper functions like these.
  autocompleter(e) {
    //TODO: if i have time, try offering suggestions as user types
    this.setState({userCity: e.target.value});
  }

  populateCityCard(value) {
    this.setState({cityCard : value});
  }

  searchHandler(e) {
    //TODO: add more input validation?

    //don't let user submit an empty city
    if(this.state.userCity.length === 0) {
      this.populateCityCard(<section>Please type a city to search for</section>);
    }
    else {
      //when user presses Search, initiate api call series
      //and pass the CityCard setter function so it can actually render something
      this.props.fetcher("city", this.state.userCity, "locationNamePlaceholder", this.populateCityCard);
      //in the meantime, show a pending message, only really seen if the network is slow
      this.populateCityCard(<section>Identifying city...</section>);
    }
    e.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <CityForm value={this.state.userCity} onChange={this.autocompleter} onSubmit={this.searchHandler} />
        <CityCardHolder value={this.state.cityCard} />
      </React.Fragment>
    );
  }
}

export { CityWeather };
