---
title: Introduction
slug: /
---

## Getting Started

Greetings, friend! This tutorial will cover creating an API using
the [NestJS](https://nestjs.com) framework. Along the way, we will build out the
application using tests with [Cypress](https://cypress.io) and the
[Cypress API Plugin](https://github.com/filiphric/cypress-plugin-api).

If you are unfamiliar with NestJS, it is a Node-based framework heavily
influenced by Angular and is great for building any server-side
application. What I like about Nest is that it provides building blocks
(similar to those found in Angular) for creating applications. This helps those
familiar with Nest and how it works to jump from project to
project and know roughly how things already work.

Cypress is typically known for end-to-end testing web applications, as well as
component testing. With the Cypress API Plugin, we can also use Cypress to test our
backend applications. The plugin provides a nice interface showing each API call's results. Typically I would reach for something like
Postman to use when I develop APIs, but with Cypress, I can nearly replace
Postman and have a nice suite of automated tests to go along with it when I'm
done.

For this tutorial, we are creating a mission board for a fictional agency called Cypress Heroes. This board will feature a list of our heroes' missions. We'll be able to get, create, update, and delete missions on the
board. Yes, it's a to-do list, but it's much cooler because, you know,
superheroes.

### Pre-requisites

To get started, you will need the following tools:

- Laptop
- Node 16+
- Git
- VS Code or similar IDE
