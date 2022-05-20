import { FunctionalComponent, h } from 'preact';
import Chat from '../../components/Chat';
import style from './style.css';

const Home: FunctionalComponent = () => {
    return (
        <div class={style.home}>
            <Chat/>
        </div>
    );
};

export default Home;
