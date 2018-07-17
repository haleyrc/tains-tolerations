import React from 'react'
import Link from 'gatsby-link'
import graphql from 'graphql'

const IndexPage = ({ data }) => (
  <div>
    {data.posts.edges.map(({ node }) => {
      return (
        <div key={node.id}>
          <Link to={`posts/${node.slug}/`}>
            <h3>{node.title}</h3>
          </Link>
          <h4>{node.createdAt}</h4>
          <p>{node.body.childMarkdownRemark.excerpt}</p>
        </div>
      )
    })}
  </div>
)

export default IndexPage

export const query = graphql`
  query PostsQuery {
    posts: allContentfulBlogPost {
      edges {
        node {
          id
          createdAt(formatString: "YYYY-MM-DD")
          slug
          title
          body {
            body
            childMarkdownRemark {
              excerpt
            }
          }
        }
      }
    }
  }
`
