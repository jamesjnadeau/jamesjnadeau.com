const FeedlyClient = require("node-feedly-developer-client");

var accessToken = 'Az9uOtfPzCgT_J0O6ZIycOvk_fTFImnj1X7UdbzNRwRUsHl2hSpVt4yRUcWvqBWKtbXcHIik3AMvpT9TwuYHNC0pqw5NkZRXTgc7ttPxeAE0Oc4ghhc_sKwWw3SGzm7g6krGcAs_dJCXNFlE7Rd67zIO6ffnTMV_1LvihaiyJ2TjjGCtq4-AKbxyHLDSTBHHBWTZInzp10snUFKUBMNpDHkLW8SFzkfJsKLg7xfs3T_Aq9J-whf5aV8:feedlydev';
var refreshToken = 'Az9uOtfPzCgT_J0O6ZIycOvk_fTFImnj1X7UdbzNSwRUo3h0gH5atdKXTMGr_F-F6abSVJb21lF7vDlcxL8JMiIppVQex4BXThg7ttO1Plk2e5sy2VVlpuRShmKN1zL_u0qfIB8wfZDPN1hP7RMvvGAA57a1VM57zaCglqOkJGK0i2Gw6suaJL9kB6TKRhHaFyXPLmaskBJyFwHRXJ4xHWAdG9SdwFeJo6v_8gSg0yea7L4-iwKveUSZSfcLV9dgeVaC';

var myFeeds = [
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Awesome',
    label: 'Awesome',
    actionTimestamp: 1559410627991 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Bad Politics',
    label: 'Bad Politics',
    actionTimestamp: 1559384596188 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Child',
    label: 'Child',
    actionTimestamp: 1557999304735 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Dev',
    label: 'Dev',
    actionTimestamp: 1558346651698 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Fake News',
    label: 'Fake News',
    actionTimestamp: 1555320917871 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Food',
    label: 'Food',
    actionTimestamp: 1524612034688 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Fox, Really',
    label: 'Fox, Really',
    actionTimestamp: 1555811989669 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/global.saved',
    actionTimestamp: 1540980797636 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Interview',
    label: 'Interview',
    created: 1540428643093,
    actionTimestamp: 1545852956560 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Laugh',
    label: 'Laugh',
    actionTimestamp: 1558861070865 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Learn',
    label: 'Learn',
    actionTimestamp: 1559260070482 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Make',
    label: 'Make',
    actionTimestamp: 1549017735606 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Music',
    label: 'Music',
    actionTimestamp: 1544052542467 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Note worthy',
    label: 'Note worthy',
    created: 1538562245752,
    actionTimestamp: 1554683173522 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Recipe',
    label: 'Recipe',
    actionTimestamp: 1555983518099 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Sales',
    label: 'Sales',
    created: 1543317179933,
    actionTimestamp: 1543884228753 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Teach',
    label: 'Teach',
    created: 1547722171220,
    actionTimestamp: 1547724935555 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Tools',
    label: 'Tools',
    actionTimestamp: 1548542787428 },
  { id: 'user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Walter',
    label: 'Walter',
    actionTimestamp: 1555840453706 },
  ];



var feedly = new FeedlyClient({
  refreshToken: refreshToken,
});

feedly.request('/v3/streams/contents?count=500&streamId=' + encodeURIComponent('user/447f76f6-44df-414e-a9af-794a73847bdb/tag/Awesome'), {
  //method: "POST",
  // Force no auth header
  /*
  headers: {},
  body: JSON.stringify({

  }),
  */
}).then(({ body }) => { // response
  console.info("Fetched my entries from Feedly API");
  console.dir(body.items.length);
});
