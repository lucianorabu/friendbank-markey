import React from 'react';
import { Helmet } from 'react-helmet';
import getCopy from '../utils/getCopy';
import getConfig from '../utils/getConfig';

export default function StandardHelmet() {
  const copyText = 'A vote for Jamie means real change and improvements to our lives. Cheaper and better public transport. Thousands of new well-paid jobs. Protection for our beaches and countryside. Reduced bills through retrofitting our homes.And we know that Jamie delivers on what he says, because he’s already done it once.It’s up to us to make sure he can keep fighting for the North East. Let me know your with Jamie and help me reach my goal.';
  return (
    <Helmet>
      <title>{getCopy('homepage.formTitle')}</title>
      <meta name="og:title" content={getCopy('homepage.formTitle')} />
      <meta property="og:description" content={copyText} />
      <meta property="og:image" content="https://support.jamiedriscoll.org/img/voting-jamie-card.jpeg" />
      <meta name="twitter:image" content="https://support.jamiedriscoll.org/img/voting-jamie-card.jpeg"></meta>
      <meta property="og:url" content="https://support.jamiedriscoll.org/"></meta>
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={getCopy('homepage.formTitle')} />
      <meta property="twitter:description" content={copyText} />
    </Helmet>
  );
}
