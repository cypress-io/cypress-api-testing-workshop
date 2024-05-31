---
title: CRUD
slug: /crud
---

## Get Single Mission

Next, let's update the API to be able to retrieve a specific mission via its
`id`. We'll specify the id via a route param appended to the end of the URL like
'/missions/1'.

First, add a test:

```ts
it("should get single mission", () => {
  cy.api("/missions/1").as("response");
  cy.get("@response").its("status").should("equal", 200);
  cy.get("@response").its("body").should("include", {
    id: 1,
    description: "take out the trash",
    complete: false,
  });
});
```

This test starts much like the last one, except we specify we want to pull
back the mission with the id of 1 (the default mission). After we assert the
request comes back successfully (by ensuring the status code is 200), we check
that the response's body includes the mission we expect.

Update the service to add a get method, which will use ArrayDB™️'s find method
to retrieve the mission if it exists, else it will just return undefined:

```ts title=missions.service.ts
get(id: number) {
  const mission = this.missions.find(x => x.id === id);
  return mission;
}
```

```ts title=missions.controller.ts
@Get(':id')
get(@Param('id', ParseIntPipe) id: number) {
  return this.missionsService.get(id);
}
```

> ParseIntPipe is imported from "@nestjs/common"

Let's go over what's new here. First, the `@Get()` decorator is taking in a
string param, which is an additional path in the URL that the controller should
look for in addition to the URL prefix that's supplied in the `@Controller()`
decorator in the class. Here, we are specifying ":id". When we prepend a colon
to the string like we did, we are saying we are looking for a dynamic portion of
the string, and when matched, store it in a variable that is named by what
comes after the colon.

In our case, we are going to store the mission id (as our path is
/missions/{id}), into a variable named "id". In the `get()` method, we have a
method argument named `id`, but before it, we are using the `@Param()` decorator.
This decorator instructs Nest to look for the variable name passed into it and
bind it to the argument.

Since parameters coming in from the URL are all strings, we can use a mechanism
built into Nest known as [pipes](https://docs.nestjs.com/pipes) to transform the
value on the way in. Above, we use the `ParseIntPipe` to convert the value to a
number, which our service will need when looking up the mission.

Next, let's add a test that shows when we request a mission that doesn't exist,
the API should return a 404 not found error. We'll do so by passing in
an id of 100 to the missions endpoint:

```ts
it("should throw 404 if single mission is not found", () => {
  cy.api({
    url: "/missions/100",
    failOnStatusCode: false,
  }).as("response");
  cy.get("@response").its("status").should("equal", 404);
});
```

> By default, calls to `cy.api()` will fail if they don't return a success
> status code in the 200 range. Above, we expect the code to be 404, so
> we turn `failOnStatusCode` to false in the options so it won't fail.

If you run the test, you will see it currently fails. Even though we don't get a
mission back, the status code is 200.

Nest provides a
[set of exceptions](https://docs.nestjs.com/exception-filters#built-in-http-exceptions)
that we can throw in certain scenarios to return back appropriate status codes.
One of which is the `NotFoundException`. We can throw this error anywhere in the app, and a global exception filter will catch it and return back a
response with a 404 status code.

In the `MissionsService`, we will check to see if we find a mission when we
query ArrayDB™️ for it. If we don't, we'll throw a `NotFoundException` and let
Nest handles the dirty work from there:

```ts
get(id: number) {
  const mission = this.missions.find((x) => x.id === id);
  if (!mission) {
    throw new NotFoundException();
  }
  return mission;
}
```

> `NotFoundException` is imported from "@nestjs/common"

## Add Mission

Next up, let's add new missions to the list. To add a mission, we will use the
"POST" HTTP method to the missions endpoint, and set the request's body
with the new mission. We'll expect the result of the API request to be the new
mission created.

Add the following test:

```ts title=missions.cy.ts
it("can add mission", () => {
  const mission = {
    description: "test mission",
    complete: false,
  };
  cy.api("POST", "/missions", mission).as("response");
  cy.get("@response").its("status").should("equal", 201);
  cy.get("@response").its("body").should("include", mission);
});
```

The only thing we haven't seen above is passing the new mission as an
object to the third parameter of the `cy.api()` method. The method will
serialize the object as JSON and set it to the request's body, as well as set
all the necessary headers.

Update the `MissionsService` to include the `addMission` method:

```ts
add(mission: Mission) {
  const newId = Math.max(...this.missions.map((x) => x.id)) + 1;
  mission.id = newId;
  this.missions.push(mission);
  return mission;
}
```

Here, we take the new mission, and since ArrayDB™️ doesn't have
auto-incrementing ids, we need to calculate a new id on our own. After that, we
use the push method to add the new mission to the list and then return it.

Next, add the controller method:

```ts title=mission.controller.ts
@Post()
addMission(@Body() mission: Mission) {
  return this.missionsService.add(mission);
}
```

> Post and Body are imported from "@nestjs/common"

There are a couple of new things to note above. First, the `@Post()` decorator
states that this will be the method that will response to "POST" HTTP methods.

Next is the new `@Body()` decorator. This instructs Nest to take the contents
from the body of the request and serialize it into the parameter it is attached
to. Hence, the mission variable will contain the new mission to add.

Run the add mission test again, and you should see it pass with a 201 status
code, which represents a new entity created due to the request.

## Update & Delete Missions

Now that we are starting to get the hang of this let's bang out the last two
methods we are going to want: updating and deleting.

First, the tests:

```ts title=missions.cy.ts
it("should update mission", () => {
  const mission = {
    description: "get cat out of tree",
    complete: true,
  };
  cy.api({
    url: "/missions/1",
    method: "PUT",
    body: mission,
  }).as("response");
  cy.get("@response").its("status").should("equal", 200);
  cy.get("@response").its("body").should("include", mission);
});

it("can delete mission", () => {
  cy.api("DELETE", "/missions/1").as("response");
  cy.get("@response").its("status").should("equal", 204);
});
```

The service code:

```ts title=missions.service.ts
update(id: number, mission: Mission) {
  mission.id = id;
  this.missions = this.missions.map((x) => {
    return x.id === id ? mission : x;
  });
  return this.get(id);
}

delete(id: number) {
  this.missions = this.missions.filter((x) => x.id !== id);
}
```

And the controller code:

```ts title=missions.controller.ts
@Put(':id')
updateMission(
  @Param('id', ParseIntPipe) id: number,
  @Body() mission: Mission,
) {
  return this.missionsService.update(id, mission);
}

@Delete(':id')
@HttpCode(204)
delete(@Param('id', ParseIntPipe) id: number) {
  this.missionsService.delete(id);
}
```

> Put, Delete, and HttpCode are imported from "@nestjs/common"

Pretty standard stuff that you've seen already. The `@Put()` and `@Delete()`
decorators make these methods listen for their respective HTTP methods.

The only new thing is the `@HttpCode()` decorator on the `delete()` method. By
default, Nest will return back a 200 status code for all HTTP methods except for
"POST", which it will return 201 for. To change the default, use this decorator.
In our case, we are using status code 204, which means we are not returning any
content, and that is to be expected. Notice how we are not returning anything
from this method.

The first time we run these tests, they will pass. However, on the next run, we will
get some failures. This is because some tests expect the database
to be in its default state, but we are now modifying it with the add, update,
and delete methods.

It is best practice to not have one test reflect the outcomes of another test,
but that is exactly what we are doing currently. What can we do about it?

One method is resetting the database into a known state before running each test.
This is often difficult to do, but we have that luxury because our database is so small. Let's see how we can accomplish that.
