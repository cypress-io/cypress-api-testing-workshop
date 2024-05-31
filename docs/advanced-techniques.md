---
title: Advanced Techniques
slug: /advanced-techniques
---

## Seeding the Database

The technique we are going to use here is having a method in our API that will
reset the database back to its initial state. The first thing we will do is have
a method in the `MissionsService` to reset the ArrayDB™️:

```ts title=missions.service.ts
reset() {
  this.missions = [{ ...defaultMission }];
}
```

Above, we are overriding the array by setting it to an array that only
contains the `defaultMission`, just like when the API first initializes.

Next, we'll create a method in the controller our tests can call to reset:

```ts title=missions.controller.ts
@Post('/reset')
reset() {
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
    this.missionsService.reset();
  }
}
```

We'll make the method respond to a "POST" request since its changing state
inside the system. We also check to ensure that the environment is either
"test" or "dev", as we don't want to call this method available in production.
We need to update the "start:dev" script in the package file to set the Node
environment.

```json package.json
"start:dev": "NODE_ENV=dev nest start --watch",
```

Make sure you restart the Nest server so the change can take effect.

A bit later, we will take a look at how to secure this endpoint even more so that the
calling API will need a token to call it.

In the tests, we want to ensure that we reseed the database before each
test is run. We can use the
[`beforeEach`](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Test-Structure)
test hook for that. Add the following block inside the `describe` block before
the first test:

```ts title=missions.cy.ts
beforeEach(() => {
  cy.request({
    log: false,
    method: "POST",
    url: "/missions/reset",
  });
  cy.log("seeding db");
});
```

Above, we use the `cy.request()` command, the built-in command for
making API requests in Cypress. We set logging to false so it doesn't get too
noisy in the command log, but we also output a small "seeding db" message, so we can see it's happening.

:::info

The technique above is just one strategy for seeding a database for testing,
there are many ways to do so, and some will be more appropriate for others in
your app. See the Cypress guide on
[seeding data](https://docs.cypress.io/guides/end-to-end-testing/testing-your-app#Seeding-data)
for some more info on the subject.

:::

Now you should be able to run the tests over and over again without the state of
the previous test is getting in the way.

## Protecting Routes

Above, in the `reset()` method on the controller, we put one safeguard in place
to ensure the app wasn't in production when trying to reseed the database.
Let's add another layer of security by requiring the calling client to provide a
token to prove they have access to do a db reseed.

To accomplish validating this token, we will use a
[Nest Guard](https://docs.nestjs.com/guards), which is a piece of middleware
which Nest can invoke for each HTTP request before passing the request on to the
controllers.

First, we will use the CLI to create a guard for us. We'll call it
`TestEnvOnly`:

```bash
nest g guard TestEnvOnly
```

A guard is another JavaScript class with one required method, `canActivate`.
This method determines if the request should be able to proceed through the
pipeline or not by returning a boolean or a promise/observable that yields a
boolean value.

Update the contents of the newly created
**src/test-env-only/test-env-only.guard.ts** file with the following:

```ts title=src/test-env-only/test-env-only.guard.ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class TestEnvOnlyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!(process.env.NODE_ENV === "test" || process.env.NODE_ENV === "dev")) {
      return false;
    }

    if (request.headers.authorization !== "resetcreds") {
      return false;
    }

    return true;
  }
}
```

In the `canActivate` method, the first thing we do is grab access to the HTTP
request.

Next, we move the code to check the environment from the controller `reset()`
method, and then we check an `authorization` header has the correct token.
We are using a simple string here, but this token could be more complex, like a
JWT or API key that could be validated.

If either of the above checks doesn't pass, we return false, instructing Nest
to end the request and send back a 403 Forbidden status code. We return true if they are both
good, and the request will continue to the controller.

Unlike when we generated the Nest service and controller, the guard did not
automatically get wired up for us in the app module. That's because the way you
use guards can either be global or more granular. We only want to apply the
guard to the `reset()` method, so we can use the `@UseGuards()` decorator and
pass the `TestOnlyGuard` as a parameter to it:

a

```ts
@UseGuards(TestEnvOnlyGuard)
@Post('/reset')
reset() {
  this.missionsService.reset();
}
```

> UseGuards is imported from "@nestjs/common" TestEnvOnlyGuard is imported from
> "src/test-env-only/test-env-only.guard"

Nest will now use the guard for each request coming into this method.

If you try the tests again, you will see them fail because we aren't passing the
token on the "reset" request in the `beforeEach`. Update the block to do so:

```ts title=missions.cy.ts
beforeEach(() => {
  cy.request({
    log: false,
    method: "POST",
    url: "/missions/reset",
    headers: {
      Authorization: "resetcreds",
    },
  });
  cy.log("seeding db");
});
```

Visit the Nest docs for more ways to bind guards to your application.

:::info

We use a guard here to protect our database, but you will also use guards to
implement authentication to validate who users are. They even include some built-in ones to get you up and running quickly. Visit their
[authentication](https://docs.nestjs.com/security/authentication) guide for more
info.

:::

## Validation

We have a working API to manage our missions. However, we haven't
done anything to ensure that the data coming into our system is valid.
Validating data coming into your system is important because it helps ensure the integrity of your database, helps with security and provides a better developer
experience for those consuming your API.

Our `Mission` model is fairly simple, but let us add some validation to it to
ensure that any time one is added or updated, we make sure it's good.

First up, a new test to validate that trying to create an invalid module returns
a 400 Bad Request status code, which signifies to the user they did
something wrong with the request. The body of the response will contain helpful
messages on what went wrong:

```ts title=missions.cy.ts
it("when adding an invalid mission, get 400 error", () => {
  const mission = {};
  cy.api({
    method: "POST",
    url: "/missions",
    body: mission,
    failOnStatusCode: false,
  }).as("response");
  cy.get("@response").its("status").should("equal", 400);
  cy.get("@response")
    .its("body")
    .should("deep.include", {
      message: [
        "description must not be an empty string",
        "description must be a string",
        "complete must be a boolean",
      ],
    });
});
```

We will be using a couple of helper libraries to help accomplish this.
[Class Validator](https://github.com/typestack/class-validator) and
[Class Transformer](https://github.com/typestack/class-transformer) are two
libraries that fit well in the Nest ecosystem. They allow us to use TypeScript
decorators to annotate our models and provide validation logic declaratively.

We need to install the libraries. Run the following from your terminal:

```bash
npm i class-transformer class-validator
```

Currently, our `Mission` model is an interface. To annotate it with
decorators, we will need to convert it to a class instead and refactor some
code.

Create a new file at **src/missions/Mission.ts** and paste the following into
it:

```ts title=src/missions/Mission.ts
export class Mission {
  id?: number;
  description: string;
  complete: boolean;
  created: string;

  constructor(partial: Partial<Mission>) {
    Object.assign(this, partial);
  }
}
```

Next, delete the `Mission` interface from the top of the **missions.service.ts**
file and reference the new class in both the service and controller.

And then, to make sure we are using an instance of the class, update where we
initialize the missions array in the service, as well as where it gets reset in
the `reset()` method:

```ts title=missions.service.ts
//initialize missions
missions: Mission[] = [new Mission(defaultMission)];

//reset
reset() {
  this.missions = [new Mission(defaultMission)];
}
```

Perfect! Now that we have a class, we can begin to decorate the `Mission` class
with validation functions. We'll verify that `description` is a string and
is not empty and that complete is a boolean. To do so, we'll use the
`@IsString()`, `@IsNotEmpty()`, and `@IsBoolean()` decorators. Update the
`Mission` class and add the validators to the `description` and `complete`
properties:

```ts title=Mission.ts
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class Mission {
  id?: number;

  //highlight-start
  @IsString({ message: "description must be a string" })
  @IsNotEmpty({ message: "description must not be an empty string" })
  //highlight-end
  description: string;

  //highlight-next-line
  @IsBoolean({ message: "complete must be a boolean" })
  complete: boolean;
  created: string;
}
```

> @IsString, IsNotEmpty, and IsBoolean are imported from "class-validator"

Each decorator takes a set of options, and we can set the error message we
want to use if the validation fails.

Now that the decorators are in place, how do we use them? Nest has
another piece of middleware known as [pipes](https://docs.nestjs.com/pipes)
(similar to the guards which we used above) whose job is to inspect incoming
requests and provide validation and transformation to the request. You can see
an example of how one is built
[here](https://docs.nestjs.com/pipes#class-validator). However, Nest already has
a built-in
[ValidationPipe](https://docs.nestjs.com/pipes#the-built-in-validationpipe),
which does exactly what we need it to.

We'll want every API request to be run through the `ValidationPipe`, so instead
of granularly applying it to methods as we did above with `@UseGuards()`,
we'll configure it in the app module. Update the **src/app.module.ts** file to
add a new item in the providers array:

```ts title=src/app.module.ts
@Module({
  imports: [],
  controllers: [AppController, MissionsController],
  providers: [
    AppService,
    MissionsService,
    //highlight-start
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
    //highlight-end
  ],
})
export class AppModule {}
```

> APP_PIPE is imported from "@nestjs/core" and ValidationPipe is imported from
> "@nestjs/common"

This will instruct Nest that anytime a request is made to run the request
through `ValidationPipe`, which will parse the request body, convert it to an instance of the `Mission` class, and run any validators on it through
`class-validator`. If validation fails, then it will return back a 400 status
code.

With all that in place, our test should now pass.

You might have noticed that we passed in `{transform: true}` as an option to the
`ValidationPipe` class. This will convert any values to how they are typed in
TypeScript on its way in. This means that we can now remove any of those
`ParseIntPipes` were being used to convert the ids into strings. Go ahead
and do so and you'll see that all the tests still pass!

## Exclude properties

Okay, one last cool trick to show you before we wrap up is introducing
the concept of [Nest Interceptors](https://docs.nestjs.com/interceptors). An
interceptor is another piece of specialized middleware, and its purpose is to
transform any responses on their way out (opposite of a pipe).

In our `Mission` class, we've had the created date that shows when the mission
was added. Let's pretend this info is only somewhat valuable to the clients of
the API, and we want to remove it before it gets sent out.

Add another check to the 'should get single mission' test to make sure the
the property comes back undefined:

```ts
it("should get single mission", () => {
  cy.api("/missions/1").as("response");
  cy.get("@response").its("status").should("equal", 200);
  cy.get("@response").its("body").should("include", {
    id: 1,
    description: "save the galaxy",
    complete: false,
  });
  //highlight-next-line
  cy.get("@response").its("body.created").should("be.undefined");
});
```

The test will currently fail because `created` comes back.

To exclude the property, we can use the `@Exclude()` decorator from
`class-transformer`:

```ts title=Mission.ts
@Exclude()
create: string;
```

> Exclude is imported from "class-transformer"

When a class is run through `class-validator`, it will convert the object into a
plain JavaScript object and run any transformations on it (such as excluding
properties). We can use the the built-in
[`ClassSerializerInterceptor`](https://docs.nestjs.com/techniques/serialization)
from Nest to do this for us.

To use the interceptor, add another provider to the app module:

```ts title=app.module.ts
providers: [
  AppService,
  MissionsService,
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({ transform: true }),
  },
  //highlight-start
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
  //highlight-end
],
```

> APP_INTERCEPTOR is imported from "@nestjs/core" and ClassSerializerInterceptor
> is imported from "@nestjs/common"

Now the 'should get single mission' test should pass again.

## Conclusion

Thanks for taking the time to work through this tutorial. Hopefully, I showed
you how to get up and running with Nest quickly and how to use Cypress with the
Cypress API Plugin as a development aid while building out your API. The extra benefit is that you also have a set of repeatable tests to run to
ensure your API functions as it should.

Feel free to hit me up on Twitter [@jordanpowell88](https://twitter.com/jordanpowell88) if you have any questions.

Happy Coding!
