var Stream = require('mithril-stream')

var INIT = {}

function identity(a) {
    return a
}

function assert(statement, msg) {
    if (!statement) throw new Error(msg)
}

function scanReducer(dispatch) {
    return function (reducer) {
        var seed
        return Stream.combine(function (state) {
            var next = reducer(seed, state())
            if (next !== Stream.HALT) return seed = next
            return Stream.HALT
        }, [dispatch])
    }
}

function mapObj(obj, apply) {
    var mapped = {}
    for (var key in obj) {
        if (!obj.hasOwnProperty(key)) continue
        mapped[key] = apply(obj[key])
    }
    return mapped
}

function createStore(reducers) {
    var dispatcher = Stream({type: INIT})
    var store = mapObj(reducers, scanReducer(dispatcher))

    function dispatch(action) {
        assert(
            typeof action === 'object' && action.hasOwnProperty('type'),
            'Expected action to be an object with "type" property'
        )
        dispatcher(action)
    }

    function map(key) {
        return store[key].map(identity)
    }

    function get(key) {
        return store[key].call({})
    }

    return { dispatch, map, get }
}

module.exports = createStore
