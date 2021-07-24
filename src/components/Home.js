import React, { Component } from 'react';

class Home extends React.Component {
    state = {
        time: new Date().toLocaleTimeString(),
        clickedTime: 0
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                time: new Date().toLocaleTimeString()
            })
        }, 1000);
    }

    checkAlert(count) {
        console.log("Count: ", count)
        if (count % 15 === 0)
            alert("FizzBuzz")
        if (count % 3 === 0)
            alert("Fizz")
        if (count % 5 === 0)
            alert("Buzz")
    }

    clickGame() {
        this.setState({ clickedTime: this.state.clickedTime + 1 }, () => this.checkAlert((this.state.clickedTime)))
    }

    render() {
        return (
            <div>
                {/* <h1>Welcome to my shop. It is {this.state.time}</h1> */}
                <h1>Welcome to my shop</h1>
                <br />
                {/* <button type="submit" onClick={() => this.clickGame()}>Click Game</button> */}
            </div>
        );
    }
}

export default Home;