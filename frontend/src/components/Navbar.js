import { useDispatch, useSelector } from 'react-redux'
import { useNavigate} from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { motion } from 'framer-motion'
import SearchBox from './SearchBox'

function Header() {

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
    navigate('/')  
    
  }

  return (
    <motion.div initial={{y: -60}}
     animate={{y: 0}}
     transition={{duration: 0.5}}
   >
      <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect className='py-2'>

        <Container >

          <LinkContainer to='/'>
            <Navbar.Brand>ProShop</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className='justify-content-between'>
            <SearchBox />
            <Nav className="text-center">
              <LinkContainer to="/cart">
                <Nav.Link ><i className='fas fa-shopping-cart me-1'></i>Cart</Nav.Link>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link ><i className='fas fa-user me-1'></i>Login</Nav.Link>
                  </LinkContainer>
                )
              }

              {userInfo && userInfo.isAdmin && (

                  <NavDropdown title='Admin' id='adminmenu'>

                    <LinkContainer to='/admin/userlist'>
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    
                  </NavDropdown>
                )
              }

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </motion.div>

  )
}

export default Header;