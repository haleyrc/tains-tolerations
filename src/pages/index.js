import React from 'react'
import Link from 'gatsby-link'
import { graphql } from 'gatsby'

import './index.css'

import Layout from '../components/Layout'

const IndexPage = ({ data }) => (
  <Layout>
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <div key={node.id}>
        <Link to={node.fields.slug}>
          <h4>{node.frontmatter.title}</h4>
        </Link>
        <time>{node.frontmatter.date}</time>
      </div>
    ))}
  </Layout>
)

export default IndexPage

export const query = graphql`
  query PostsQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
