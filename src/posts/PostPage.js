import React from 'react'
import graphql from 'graphql'

export default ({data}) => 
<div>
<h1>{data.markdownRemark.frontmatter.title}</h1>
<h4>{data.markdownRemark.frontmatter.date}</h4>
<div dangerouslySetInnerHTML={{__html: data.markdownRemark.html}} />
</div>

export const query = graphql`
query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      frontmatter {
        date
        title
      }
      html
    }
  }
`