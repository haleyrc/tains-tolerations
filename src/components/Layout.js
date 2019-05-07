import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { Helmet } from 'react-helmet'

const Header = styled.div``
const Main = styled.div``

const Layout = ({ children }) => (
  <div>
    <Helmet>
      <link
        href="https://fonts.googleapis.com/css?family=Josefin+Sans:300italic,400italic,600italic,700italic,300,400,600,700&amp;subset=latin,latin-ext"
        rel="stylesheet"
        type="text/css"
      />
    </Helmet>
    <Header>
      <Link to="/">Taints and Tolerations</Link>
    </Header>
    <Main>{children}</Main>
  </div>
)

export default Layout
