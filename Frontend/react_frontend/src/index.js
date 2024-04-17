import react_dom from 'react-dom'
import Nav_Toggler from './Components/TogglerNav'
const MainComponent = () => {
    return (
        <div>
            <Nav_Toggler/>
        </div>
    )
}
react_dom.render(<MainComponent />, document.getElementById('rootComponent'))