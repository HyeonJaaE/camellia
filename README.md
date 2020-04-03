https://hyeonjaae.firebaseapp.com/

## Redux

store use reducer to care all component's state
when action dispatch, reducer handle func according to received type

### store.js

createStore(reducer, [preloadedState], [enhancer])
compose() to enhance a store with applyMiddleware and a few developer tools from the redux-devtools package.
use thunk for async, func

### authAction.js , types.js

import dispatch type from types.js

### {component}.js

`const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});`

`function connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)`

mapStateToProps to use state.auth and state.errors in store as component's props 
mapDispatchToProps = Reducer에 action을 알리는 함수 dispatch를 어떻게 props에 엮을 지 정한다

ex. connect(mapStateToProps, mapDispatchToProps)(Component)
Store와 Reducer를 연결시킬 수 있도록 만들어진 Component가 반환값이 된다
