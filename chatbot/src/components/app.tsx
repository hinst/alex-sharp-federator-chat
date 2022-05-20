import { FunctionalComponent, h } from 'preact';
import { Route, Router } from 'preact-router';
import Header from './header';
import Home from '../routes/home';

const App: FunctionalComponent = () => {
    return (
        <div id="preact_root">
            <Header />
            <Router>
                <Route path="/" component={Home} />
            </Router>
        </div>
    );
};

export default App;
