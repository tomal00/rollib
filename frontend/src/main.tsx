import {render} from 'preact'
import App from '@Components/app'

import './styles.css'

render(<App />, document.getElementById('app') as Element)
