Review the design of the duplicate game in the example words repository. Also review the food and admin repositories for development process.

From words, we want to learn about how to write reducers for the project, hwo to structure a svelte application, and how to use firebase for storage. 

From food, we want to study the e2e testing scheme, the requirement for zero tolerance on teh screenshots, and the workflow for submitting PRs.

From the admin repository, you should be able to learn how to make it htat we can develop against a local firebase emulator, or vs a staging environment or vs production. We'll want a similar setup for firestore for this project. 

Write a DEVELOPMENT.md guide for developers (AI agents) working on this project to make it easy for them to understand the required steps, which are:
1- write tests, both unit and e2e tests to validate their work; follow the E2E_GUIDE for details on zero-tolerance E2E testing;
2- create a branch and push it up, writing a PR comment using gh for human review
3- write design documetns in docs/designs to record any complex plans needed for implementing hte game;
4- consider carefully what actions get stored in firestore, as the game should only record "facts on the ground" as described in the admin repositories' rules for how to do an event sourced application.

DEVELOPMENT.md may link to E2E_GUIDE.md that you have to write as well as to EVENT_SOURCING.md to describe correct event sourcing style. 

Also write an MVP_DESIGN.md document describing the absolute minimal product you could produce to form a basis for developing the full game.

---

You need to also copy food/WORKFLOW.md adapting it for this project, and *follow it* for the change you're currently making so that I can see your work as a PR and not as open files in the local repo
