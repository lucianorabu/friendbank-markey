const { MongoClient, ObjectId } = require('mongodb');
const { passwordHash } = require('../utils/auth');
const { ENGLISH, SPANISH } = require('../../shared/lang');
const { STAFF_ROLE } = require('../../shared/roles');
const { TRANSACTIONAL_EMAIL } = require('../../shared/emailFrequency');

(async function() {
  console.log('Seeding database...');

  const client = await MongoClient.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  db = client.db();

  await db.dropDatabase();

  const defaultMediaObjects = [
    {
      _id: 'default',
      type: 'image',
      source: 'https://jamiedriscoll.co.uk/wp/wp-content/uploads/happy-jamie-600x315.jpg',
      alt: 'Jamie Smiles',
    },
    {
      _id: 'hoops',
      type: 'image',
      source: 'https://jamiedriscoll.co.uk/wp/wp-content/uploads/Mayors-conf-2022-600x315.png',
      alt: 'Jamie Team',
    },
    {
      _id: 'air-flight-89',
      type: 'image',
      source: 'https://jamiedriscoll.co.uk/wp/wp-content/uploads/RMT-picket-Women-safety-600x315.png',
      alt: 'Jamie women',
    },
    {
      _id: 'tracy-andy',
      type: 'image',
      source: 'https://jamiedriscoll.co.uk/wp/wp-content/uploads/Tracy-Andy-Jamie-Nik-600x315.png',
      alt: 'Tracy andy jamie',
    }
  ];

  const media = db.collection('media');
  await media.insertMany(defaultMediaObjects);

  const config = JSON.stringify({
    disableNavDonate: true,
    media: defaultMediaObjects.map((object) => object._id),
    defaultMedia: {
      _id: 'jamie',
      type: 'image',
      source: 'https://jamiedriscoll.co.uk/wp/wp-content/uploads/happy-jamie-600x315.jpg',
      alt: 'jamie smiles',
    },
  });

  const copy = JSON.stringify({
    'idQuestions.support.label': {
      [ENGLISH]: 'Will you vote to elect Jamie Driscoll as the North East Mayor on the 2nd of May?'
    },
    'idQuestions.support.options': {
      [ENGLISH]: [
        'Definitely',
        'Probably',
        'Undecided',
        'Probably not',
        'Definitely not',
        'Too Young/Ineligible to Vote',
      ]
    },
    'idQuestions.volunteer.label': {
      [ENGLISH]: 'Will you volunteer with Team Jamie?',
    },
    'idQuestions.volunteer.options': {
      [ENGLISH]: [
        'Yes',
        'Maybe',
        'Later',
        'No',
      ]
    },
    'homepage.formTitle': {
      [ENGLISH]: 'Jamie Driscoll supporter page'
    },
    'homepage.formSubtitle': {
      [ENGLISH]: 'Our grassroots campaign is powered by people like you who are connecting with family, friends, and neighbours about this important election. Complete the sections below to create your own personal supporter page and reach out to your network about why you’re a member of Team Jamie!',
   },
    'homepage.customizeTitle': {
      [ENGLISH]: 'Customize your page'
    },
    'homepage.customizeSubtitle': {
      [ENGLISH]: `Fill out the sections below to personalize the title, description, and design of your supporter page to tell your network why you’re #VotingForJamie. Share your story of why you’re a member of this movement -- feel free to get creative!`,
    },
    'homepage.formButtonLabel': {
      [ENGLISH]: 'next',
    },
    'homepage.createButtonLabel': {
      [ENGLISH]: 'create page',
    },
    'homepage.defaultTitle': {
      [ENGLISH]: `{{FIRST_NAME}} is #VotingForJamie because...`,
    },
    'homepage.defaultSubtitle': {
      [ENGLISH]: 'Jamie understands what it means to fight for our generation, and for our region. He’s running against the Labour Party establishment, and he’s backed by young people of all stripes. It’s up to us to help make sure he can keep fighting for the North East! Let me know that you’re with me, and help me reach my goal!',
    },
    'signupPage.postSignupSubtitle': {
      [ENGLISH]: 'Next, keep up the momentum by sharing this link with your friends, family, and network, and help {{FIRST_NAME}} reach their goal! Or, make your own page and get everyone you know to join the fight.',
    },
    'signupPage.postSignupCreateTitle': {
      [ENGLISH]: 'Make your own page',
    },
    'signupPage.postSignupCreateSubtitle': {
      [ENGLISH]: 'Create your own supporter page and become a grassroots organizer for Team Jamie. We’ll show you how!',
    },
    'signupPage.postSignupCreateButtonLabel': {
      [ENGLISH]: 'Get started',
    },
    'signupPage.modalTitle': {
      [ENGLISH]: `Here's how you can fight to elect Jamie`,
    },
    'signupPage.modalCopy': {
      [ENGLISH]: [
        `### Send your link far and wide`,
        `Share this page with your network to help us grow Team Jamie! Your friends, family, neighbours, colleagues, roommates, classmates, mutuals,  -- the sky's the limit, and we need to reach everyone.`,
        `### Relational organizing tips`,
        ` - Call 5 friends and ask them to fill out your link`,
        ` - Email your link to 50 people`,
        ` - Share it on socials`,
        ` - Go through your contact list in your phone and text the link to at least 10 people!`,
        ' ',
        `### Volunteer with Team Jmaie`,
        `[Join the movement here](http://support.jamiedriscoll.com).`,
      ]
    },
    'signupPage.modalCloseLabel': {
      [ENGLISH]: 'Okay, got it',
    },
    'nav.logoAlt': {
      [ENGLISH]: 'Jamie Driscoll For for North East Mayor logo',
    },
    'nav.return': {
      [ENGLISH]: '← return to gndrising.org',
    },
    'nav.returnLink': {
      [ENGLISH]: 'https://www.gndrising.org/',
    },
    'nav.donateForm': {
      [ENGLISH]: 'https://www.gndrising.org/campaigns/we-need-your-support-now/',
    },
    'phonebankPage.title': {
      [ENGLISH]: 'Add a Contact',
    },
    'phonebankPage.subtitle': {
      [ENGLISH]: 'Enter your friends, family, and people in your network. Grow your list of the people you’re personally bringing to this grassroots movement, let Jamie know if they support him, and help make sure this campaign reaches its goals.',
    },
    'phonebankPage.successfullySubmitted': {
      [ENGLISH]: 'Successfully submitted contact!',
   },
    'privacyPolicy.label': {
      [ENGLISH]: 'Privacy Policy',
    },
    'privacyPolicy.link': {
      [ENGLISH]: 'https://www.gndrising.org/privacy-policy/',
    },
    'politicalDiclaimer': {
      [ENGLISH]: 'Promoted by Green New Deal Rising, 144 Cambridge Heath Rd, London E1 5QJ',
   },
    'smsDisclaimer': {
      [ENGLISH]: 'By providing your contact details you consent to receive periodic campaign updates from GND Rising about the NE Mayoral election. We won’t contact you after election day. Text STOP to unsubscribe. Message & data rates may apply. https://www.gndrising.org/privacy-policy/',
    },
    'genericError': {
      [ENGLISH]: 'Looks like we had an error, try again? If this continues to happen, please contact us info@gndrising.org',
    },
  });

  const campaigns = db.collection('campaigns');
  const campaignResult = await campaigns.insertOne({
    domains: ['localhost:5665'],
    name: 'Team Jamie',
    copy,
    config,
  });

  const campaign = campaignResult.ops[0];
  const campaignId = campaign._id.toString();

  const hashedPassword = await passwordHash('mSecret-2008');
  const users = db.collection('users');

  const userInsertResult = await users.insertOne({
    campaign: campaignId,
    email: 'support@jamiedriscoll.org',
    password: hashedPassword,
    firstName: 'Joe',
    zip: '00000',
    emailFrequency: TRANSACTIONAL_EMAIL,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
    lastAuthenticationUpdate: Date.now(),
    role: STAFF_ROLE,
  });

  const adminUser = userInsertResult.ops[0];

  // const signups = db.collection('signups');
  // const signupSeed = new Array(50).fill({
  //   email: `${Math.round(Math.random() * 10000)}@gmail.com`,
  //   recruitedBy: adminUser._id.toString(),
  //   campaign: campaign._id.toString(),
  //   type: 'contact',
  //   lastUpdatedAt: Date.now(),
  //   firstName: 'First',
  //   phone: '',
  //   zip: '',
  //   supportLevel: '',
  //   volunteerLevel: '',
  // }).map((signup, index) => ({
  //   ...signup,
  //   _id: new ObjectId(),
  //   lastName: `${index}`,
  //   note: `This is a note ${Math.random()}`,
  // }));

  await signups.insertMany(signupSeed);
  process.exit(0);
})();
