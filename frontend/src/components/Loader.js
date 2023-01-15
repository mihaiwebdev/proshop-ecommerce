import { Spinner } from 'react-bootstrap'

const Loader = () => {
    return (
        <Spinner animation='border' rolo='status'
            style={{
                height:'100px',
                width:'100px',
                margin:'auto',
                display:'block'
            }}>
                <span className='sr-only'>Loading...</span>
        </Spinner>
    )
}



export default Loader
