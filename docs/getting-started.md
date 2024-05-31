---
title: Getting Started
slug: /getting-started
---

## Create Nest Application

The first thing we will do is install the Nest CLI tool:

```bash
npm i -g @nestjs/cli
```

Next, use the CLI to create a new application:

```bash
nest new server
```

When prompted, select NPM as your package manager.

Go into the newly created **server** directory and install Cypress
and the plugin:

```bash
npm i -D cypress cypress-plugin-api
```

Next, open the project in your code editor (we'll be using VS Code in the
tutorial):

```bash
code .
```

## Configure Cypress

Before we start working on the API, let's get Cypress up and running and write
our first test. The test won't pass yet, but that's okay.

Launch Cypress:

```bash
npx cypress open
```

Select End-to-End testing, and go through the next few steps. Cypress will
configure your project by creating all the files necessary for it to run. While
we won't be doing end-to-end testing exactly, it's the most appropriate place to
do API testing.

After the setup is done, update the **cypress.config.ts** file to add the
`baseUrl` option. We'll set it to "http://localhost:3000", which is what our
Nest application will serve the API locally during development.

```ts title=cypress.config.ts
e2e: {
  // highlight-next-line
  baseUrl: 'http://localhost:3000',
  setupNodeEvents(on, config) {
    // implement node event listeners here
  },
},
```

While we are at it, we will import the `cypress-plugin-api` package into the
**cypress/support/e2e.ts** so it is available to use in our specs. Throw the
following towards the top of the file with any other imports:

```ts title=cypress/support/e2e.ts
import "cypress-plugin-api";
```

If you go back to Cypress, you'll see a warning that it can't verify the
server is running. This hints that we still need to start up our
server. Let's go ahead and do so:

```bash
npm run start:dev
```

:::info

You will likely need to open several command windows or tabs to
run Cypress and Nest simultaneously. In VS Code, I like to run Nest in a
[JavaScript Debug
Terminal](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_javascript-debug-terminal),
which will attach the debugger to the process automatically.

:::

Go back to Cypress, and hit the "try again" button on the section that warned us
about the server not running. It should go away, and you can hit "Start E2E
Testing".

Hit the "Create new empty spec" button, name the spec **missions.cy.ts**, and
run it. This will create a default spec that visits a test site, but
we'll soon update it to contain all the tests we write for the missions API.
