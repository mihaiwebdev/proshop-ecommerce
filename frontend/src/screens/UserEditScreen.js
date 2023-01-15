import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUser } from '../actions/userActions'
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer'

const UserEditScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setAdmin] = useState(false)

    const { id } = useParams()
    const dispatch = useDispatch()

    const navigate = useNavigate()

    // Get user data from redux state
    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { error: updateError, loading: updateLoading, success:updateSuccess } = userUpdate

    useEffect(() => {

        if (updateSuccess) {
            dispatch({
                type:'USER_UPDATE_RESET'
            })

            navigate('/admin/userlist')

        } else {

            if (!user.name || user._id !== Number(id)) {
                dispatch(getUserDetails(id))
    
            } else {
                setName(user.name)
                setEmail(user.email)
                setAdmin(user.isAdmin)
            }
        }

    }, [id, user, updateSuccess, navigate, dispatch])

    const submitHandler = (e) => {
        e.preventDefault()
        
        dispatch(updateUser({_id: user._id, name, email, isAdmin}))
        
    }

    return (
        <div>
            <Link to='/admin/userlist'>Go Back</Link>
            <FormContainer>
                <h1>Edit user</h1>
                {updateLoading && <Loader />}
                {updateError && <Message variant='danger'>{updateError}</Message>}
                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
                    : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='name' placeholder='Enter Name' value={name}
                                    onChange={(e) => setName(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId='email'>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control type='email' placeholder='Enter Email' value={email}
                                    onChange={(e) => setEmail(e.target.value)}/>
                            </Form.Group>

                            <Form.Group controlId='isAdmin' className='mt-3'>

                                <Form.Check type='checkbox' label='Is Admin' checked={isAdmin}
                                    onChange={(e) => setAdmin(e.target.checked)}/>
                            </Form.Group>

                            <Button type='submit' variant='primary mt-4'>Update</Button>
                        </Form>
                    )
                }
                

            </FormContainer>
        </div>
    )
}

export default UserEditScreen
