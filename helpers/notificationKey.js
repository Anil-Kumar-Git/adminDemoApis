const jsonDataSendEmail = () => {
  let data = [
    {
      key: "onorder",
      text: "Order Successfull",
      type: "email",
      user: "user",
    },
    {
      key: "newuser",
      text: "New User",
      type: "email",
      user: "user",
    },
    {
      key: "newuser",
      text: "New User",
      type: "email",
      user: "admin",
    },
    {
      key: "statuschenge",
      text: "Account Status Change",
      type: "email",
      user: "user",
    },
    {
      key: "recheck",
      text: "Order Recheck",
      type: "email",
      user: "user",
    },
    {
      key: "onorder",
      text: "Order Successfull",
      type: "sms",
      user: "user",
    },
    {
      key: "newuser",
      text: "New User",
      type: "sms",
      user: "user",
    },
    {
      key: "recheck",
      text: "Order Recheck",
      type: "sms",
      user: "user",
    },
    {
      key: "newuser",
      text: "New User",
      type: "sms",
      user: "user",
    },
  ];

  return data;
};

const aboutData = `<p>BrightSwipe with Lite Check is the first non-intrusive background check for matches on dating platforms which accounts for 40,000,000 adults. Lite Check provides key information to help protect individuals against matches who lie about their age, marital and relationship status, violet criminal history, and fraudsters looking for their next victim to scam out of money. By using what little information a person has on their match we are able to authenticate it through various public and private data sources to deliver accurate and insightful details that could be instrumental to the person’s safety and wellbeing. BrightSwipe uses proprietary logic to locate hard to find individuals by accessing over 440+ various data sources</p>`;

const privicyData = `<p>Please read these terms and conditions carefully before using Our Service.</p><p><br></p><p>Interpretation and Definitions</p><p><br></p><p>The words of which the initial letter is capitalized have meanings defined under the following conditions.</p><p><br></p><p>The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>`;

const termData = `<p>These are the Terms and Conditions governing the use of this Service and the agreement that operates</p><p>between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p><p><br></p><p>Our Privacy Policy describes Our policies and procedures on the collection use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You.&nbsp;</p><p><br></p><p>Please read Our Privacy Policy carefully before</p><p>using Our Service</p>`;

let serviceData = [
  {
    name: "Anti-Catfish",
    description:
      "You can verify the authenticity of your match to prove they are who they say they are. The information required is First and Last Name, City and State, and Age or year of Birth. This information allows us to provide you with an easy to read report that verifies a person's name, location, age, and marital status.",
    image: "anti-catfish.png",
    price: "3.99",
    status: false,
    benefit:
      "<div><ul>\n    <li>Perfect for protection against scammers looking to defraud you by using fake information</li>\n</ul>\n\n<ul>\n    <li>Identify if a person is registered as married to help avoid a toxic situation who is already in a relationship</li>\n</ul> </div>",
  },
  {
    name: "Criminal",
    description:
      "Criminal records check is part of the comprehensive background verification conducted prior to the hiring of a candidate. It reveals the criminal history, if any, of the candidate by checking various records available on the public domain.",
    image: "criminal.png",
    price: "3.99",
    status: false,
    benefit:
      "<div><ul>\n    <li>Perfect for protection against scammers looking to defraud you by using fake information</li>\n</ul>\n\n<ul>\n    <li>Identify if a person is registered as married to help avoid a toxic situation who is already in a relationship</li>\n</ul> </div>",
  },
  {
    name: "Social",
    description:
      "You can receive Social Security benefits based on your earnings record if you are age 62 or older, or disabled or blind and have enough work credits. Family members who qualify for benefits on your work record do not need work credits.",
    image: "social.png",
    price: "1.99",
    status: false,
    benefit:
      "<div><ul>\n    <li>Perfect for protection against scammers looking to defraud you by using fake information</li>\n</ul>\n\n<ul>\n    <li>Identify if a person is registered as married to help avoid a toxic situation who is already in a relationship</li>\n</ul> </div>",
  },
];
module.exports = { jsonDataSendEmail, aboutData, privicyData, termData ,serviceData };
