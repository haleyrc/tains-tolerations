import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'

export default ({ data }) => (
  <Layout>
    <h1>{data.markdownRemark.frontmatter.title}</h1>
    <h4>{data.markdownRemark.frontmatter.date}</h4>
    <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
  </Layout>
)

export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        date
        title
      }
    }
  }
`
