import { Button, Form } from 'react-bootstrap'
import { useNavigate }  from 'react-router-dom'


const SearchBox = () => {

    const navigate = useNavigate()

    let keyword = ''
    
    const handleChange = (e) => {

        keyword = e.target.value

        navigate(`/?keyword=${keyword}&page=1`)
    }
    
    return (
        <Form className='d-flex my-4 my-lg-0' onSubmit={e => e.preventDefault()}>
            <Form.Control id='search-box' type='text' name='q' onChange={e => handleChange(e)} 
             className='mr-sm-2 ml-sm-5 py-1 rounded'/>    

             <Button type='submit' variant='outline-success' className='px-3 py-1 ms-2 rounded'><i className="fa-solid fa-magnifying-glass"></i></Button>
        </Form>
    )
}

export default SearchBox
