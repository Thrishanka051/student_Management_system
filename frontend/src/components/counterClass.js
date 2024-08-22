import React from "react";

class CounterClass extends React.Component {
    constructor(){
        super();
        this.increment= this.increment.bind(this)
        this.state={
            num :0
        }
    }

    increment(){
        this.setState({
            Number: ++this.state.num
        })
    }

    render(){
        return(
            <div>
                <h3>(class component)</h3>
                <h1>Counter= {this.state.num}</h1>
                <button onClick={this.increment}>Increment</button>
                <br/><br/><br/>
                <hr/>
            </div>
        )
    }
}

export default CounterClass;