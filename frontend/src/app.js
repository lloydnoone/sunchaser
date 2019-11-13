import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import '../src/style.scss'

import Home from './components/common/Home'

class App extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <BrowserRouter>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </main>
      </BrowserRouter>
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

// fetch('/api/weather')
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.log(err))