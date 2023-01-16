import { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listUsers, deleteUser } from '../actions/userActions'
import Loader from '../components/Loader';
import Message from '../components/Message';



const UserListScreen = () => {

    const navigate = useNavigate()

    const dispatch = useDispatch()

    const userList = useSelector(state => state.userList)
    const { loading, error, users } = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const { success } = userDelete

    useEffect(() => {

        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers())

        } else {
            navigate('/login')
        }

    }, [dispatch, navigate, userInfo, success])

    const deleteHandler = (id) => {
        
        if (window.confirm('Are you sure you want to delete this user?')) {

            dispatch(deleteUser(id))
        }

    }

    if (loading) {
        return <Loader/>
    }

    if (error) {
        return <Message variant='danger'>{error}</Message>
    }

    return (
        <div>
            <h1>Users</h1>

            <Table striped bordered hover responsive className='table-sm'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>ADMIN</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {users && users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? (
                                    <i className='fas fa-check' style={{color:'green'}}></i>
                                ) : (
                                    <i className='fas fa-check' style={{color:'red'}}></i>
                                )
                            }</td>

                            <td>
                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                    <Button variant='light' className='btn-sm'>
                                        <i className='fas fa-edit'></i>
                                    </Button>
                                </LinkContainer>

                                <Button variant='danger' className='btn-sm mt-1 mt-lg-0 ms-lg-2'
                                    onClick={() => deleteHandler(user._id)}>
                                    <i className='fas fa-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default UserListScreen
