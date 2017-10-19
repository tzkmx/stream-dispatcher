var o = require('ospec')
var createStore = require('./createStore')

function counter(value = 0, action) {
    switch (action.type) {
    case "INCR":
        return value + 1
    case "DECR":
        return value - 1
    default:
        return value
    }
}

o.spec("createStore()", function () {

    o("basic counter", function () {
        var store = createStore({
            count: counter
        })
        var called = 0

        store.map("count").map(function (val) {
            // gets called once immediately
            called++
        })

        // before anything:
        o(store.get("count")).equals(0)

        // increment
        store.dispatch({type: "INCR"})
        store.dispatch({type: "INCR"})
        store.dispatch({type: "INCR"})
        o(store.get("count")).equals(3)

        // decrement
        store.dispatch({type: "DECR"})
        o(store.get("count")).equals(2)

        // check # calls
        o(called).equals(5)
    })

})

o.run()
