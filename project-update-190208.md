# Project Updates 08 Feb 2019

# 1. Developing a theory of change*
\* not a real TOC but something similar

### Overall Aim: Make Open Source Scientific Software Sustainable
#### Problems:
- Currently possible to get grants to develop new software but much more difficult to cover maintenance costs. 
- Funding does not scale with number of users/value provided to community

### Distal Solution: Funders could accept donations to mission-critical open software projects as part of larger grants.
e.g. within a grant to analyse the spread of HIV using some WHO data one could add in a donation to the scikit-learn, a machine learning library that is required to extract the most information possible from the data.

#### Problems:
- Getting buy-in from funding agencies is hard. How do we persuade them?

#### Solutions:
- Highlight the value that open source software provides to funded projects.
- Provide evidence for the *cost effectivenesss* of donations to open projects over licence fees to proprietory ones.

### Proposed Actions
1. Create a caclulator that estimates the value of an open source project for a given group using the license costs from propriatory software that performs a similar function.
2. Engage with funders to determine what steps would be involved in adding donations into a grant costing. Find out what their current strategy for engaging in Open Source is.

# 2. Developing an Open Software Database ([meta-open-db.com](http://www.meta-open-db.com/))

In order to find out the cost of proprietary versions of a particular software we first need to construct a database that links software with related functionality. Indeed it could be useful for other applications to be able to find and filter open alternatives to proprietory software anyhow.

As a start to this process we are developing Meta Open DB (name TBC) which is a database with an open API that allows queries for links between software as well as information about licensing, business model, and other pertinent info. Currently we are using text-scraping and some simple heuristics to construct the database, moving forwards it would be good to test out the effectiveness of using some NLP or related machine-learning methods. Furthermore we will likely hire an intern to help curate these results. The database also has a front-end and a UI/searchbar for making quieres without directly using the API.

The next step is to include some pricing in our database (as simply as possible) and then sketch out the UI for the calculator (which will be a seperate website).
