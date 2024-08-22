import React, { useState } from "react";

function CounterFunction(){
    let [num,setNum] = useState(0)

    function increment(){
        setNum(++num)
    }

    return(
        <div>
            <br/><br/> 
            <h3>(functional component)</h3>
            <h1>Counter={num}</h1>
            <button onClick={()=>increment()}>Increment</button>
        </div>
    )
}
export default CounterFunction;