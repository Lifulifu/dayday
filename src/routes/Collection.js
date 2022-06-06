import React from 'react'
import { useParams } from 'react-router-dom'

import ContentContainer from '../components/ContentContainer'

export default function Collection() {

  const { tagName } = useParams();

  return (
    <ContentContainer>
      <div>Collection of tag {tagName}</div>
    </ContentContainer>
  )
}
