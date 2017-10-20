var o = require('ospec')
var createStore = require('./createStore')

o.spec("createStore()", function () {

    o("basic counter", function () {
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
        var action = new function () {
            this.incr = ()=> ({type: "INCR"})
            this.decr = ()=> ({type: "DECR"})
        }
        var store = createStore({
            count: counter
        })
        var called = 0

        store.register(function (val) {
            // gets called once immediately
            called++
        })

        // before anything:
        o(store.get("count")).equals(0)

        // increment
        store.dispatch(action.incr())
        store.dispatch(action.incr())
        store.dispatch(action.incr())
        o(store.get("count")).equals(3)

        // decrement
        store.dispatch(action.decr())
        o(store.get("count")).equals(2)

        // check # calls
        o(called).equals(5)
    })

})

o.run()
