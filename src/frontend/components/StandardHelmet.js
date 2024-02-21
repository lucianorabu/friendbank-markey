import React from 'react';
import { Helmet } from 'react-helmet';
import getCopy from '../utils/getCopy';
import getConfig from '../utils/getConfig';

export default function StandardHelmet() {
  return (
    <Helmet>
      <title>{getCopy('homepage.formTitle')}</title>
      <meta name="og:title" content={getCopy('homepage.formTitle')} />
      <meta property="og:description" content={getCopy('homepage.formSubtitle')} />
      <meta property="og:image" content="https://support.jamiedriscoll.org/img/voting-jamie-card.jpeg" />
      <meta name="twitter:image" content="https://support.jamiedriscoll.org/img/voting-jamie-card.jpeg"></meta>
      <meta property="og:url" content="https://support.jamiedriscoll.org/"></meta>
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={getCopy('homepage.formTitle')} />
      <meta property="twitter:description" content={getCopy('homepage.formSubtitle')} />
    </Helmet>
  );
}
