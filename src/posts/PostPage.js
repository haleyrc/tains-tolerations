import React from 'react'
import graphql from 'graphql'

export default ({ data }) => (
  <div>
    <h1>{data.post.title}</h1>
    <div
      dangerouslySetInnerHTML={{
        __html: data.post.body.childMarkdownRemark.html,
      }}
    />
  </div>
)

export const query = graphql`
  query PostQuery($slug: String!) {
    post: contentfulBlogPost(slug: { eq: $slug }) {
      title
      body {
        body
        childMarkdownRemark {
          html
        }
      }
      createdAt(formatString: "YYYY-MM-DD")
    }
  }
`
