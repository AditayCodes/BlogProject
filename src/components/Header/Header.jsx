import React from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      active: true
    },
    {
      name: "Login",
      slug: '/login',
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: '/signup',
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: '/all-posts',
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: '/add-post',
      active: authStatus,
    },
  ]

  return (
    <header className='py-3 shadow bg-gray-500 sticky top-0 z-50'>
      <Container>
        <nav className='flex flex-col md:flex-row items-center justify-between'>
          <div className='mb-4 md:mb-0'>
            <Link to='/'>
              <Logo width='70px'/>
            </Link>
          </div>
          <ul className='flex flex-wrap justify-center md:justify-end gap-2 md:gap-0'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-block px-3 md:px-6 py-2 text-sm md:text-base duration-200 hover:bg-blue-100 rounded-full whitespace-nowrap'
                  >{item.name}</button>
              </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header