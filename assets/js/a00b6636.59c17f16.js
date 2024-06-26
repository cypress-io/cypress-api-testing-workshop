"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[491],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var s=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,s)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,s,i=function(e,t){if(null==e)return{};var n,s,i={},o=Object.keys(e);for(s=0;s<o.length;s++)n=o[s],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(s=0;s<o.length;s++)n=o[s],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=s.createContext({}),d=function(e){var t=s.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=d(e.components);return s.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},c=s.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,p=r(e,["components","mdxType","originalType","parentName"]),c=d(n),m=i,h=c["".concat(l,".").concat(m)]||c[m]||u[m]||o;return n?s.createElement(h,a(a({ref:t},p),{},{components:n})):s.createElement(h,a({ref:t},p))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=c;var r={};for(var l in t)hasOwnProperty.call(t,l)&&(r[l]=t[l]);r.originalType=e,r.mdxType="string"==typeof e?e:i,a[1]=r;for(var d=2;d<o;d++)a[d]=n[d];return s.createElement.apply(null,a)}return s.createElement.apply(null,n)}c.displayName="MDXCreateElement"},8012:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>u,frontMatter:()=>o,metadata:()=>r,toc:()=>d});var s=n(7462),i=(n(7294),n(3905));const o={title:"CRUD",slug:"/crud"},a=void 0,r={unversionedId:"crud",id:"crud",title:"CRUD",description:"Get Single Mission",source:"@site/docs/crud.md",sourceDirName:".",slug:"/crud",permalink:"/cypress-api-testing-workshop/crud",draft:!1,tags:[],version:"current",frontMatter:{title:"CRUD",slug:"/crud"},sidebar:"tutorialSidebar",previous:{title:"Writing Your First Test",permalink:"/cypress-api-testing-workshop/writing-your-first-test"},next:{title:"Advanced Techniques",permalink:"/cypress-api-testing-workshop/advanced-techniques"}},l={},d=[{value:"Get Single Mission",id:"get-single-mission",level:2},{value:"Add Mission",id:"add-mission",level:2},{value:"Update &amp; Delete Missions",id:"update--delete-missions",level:2}],p={toc:d};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,s.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"get-single-mission"},"Get Single Mission"),(0,i.kt)("p",null,"Next, let's update the API to be able to retrieve a specific mission via its\n",(0,i.kt)("inlineCode",{parentName:"p"},"id"),". We'll specify the id via a route param appended to the end of the URL like\n'/missions/1'."),(0,i.kt)("p",null,"First, add a test:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'it("should get single mission", () => {\n  cy.api("/missions/1").as("response");\n  cy.get("@response").its("status").should("equal", 200);\n  cy.get("@response").its("body").should("include", {\n    id: 1,\n    description: "save the galaxy",\n    complete: false,\n  });\n});\n')),(0,i.kt)("p",null,"This test starts much like the last one, except we specify we want to pull\nback the mission with the id of 1 (the default mission). After we assert the\nrequest comes back successfully (by ensuring the status code is 200), we check\nthat the response's body includes the mission we expect."),(0,i.kt)("p",null,"Update the service to add a get method, which will use ArrayDB\u2122\ufe0f's find method\nto retrieve the mission if it exists, else it will just return undefined:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=missions.service.ts",title:"missions.service.ts"},"get(id: number) {\n  const mission = this.missions.find(x => x.id === id);\n  return mission;\n}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=missions.controller.ts",title:"missions.controller.ts"},"@Get(':id')\nget(@Param('id', ParseIntPipe) id: number) {\n  return this.missionsService.get(id);\n}\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},'ParseIntPipe is imported from "@nestjs/common"')),(0,i.kt)("p",null,"Let's go over what's new here. First, the ",(0,i.kt)("inlineCode",{parentName:"p"},"@Get()")," decorator is taking in a\nstring param, which is an additional path in the URL that the controller should\nlook for in addition to the URL prefix that's supplied in the ",(0,i.kt)("inlineCode",{parentName:"p"},"@Controller()"),'\ndecorator in the class. Here, we are specifying ":id". When we prepend a colon\nto the string like we did, we are saying we are looking for a dynamic portion of\nthe string, and when matched, store it in a variable that is named by what\ncomes after the colon.'),(0,i.kt)("p",null,'In our case, we are going to store the mission id (as our path is\n/missions/{id}), into a variable named "id". In the ',(0,i.kt)("inlineCode",{parentName:"p"},"get()")," method, we have a\nmethod argument named ",(0,i.kt)("inlineCode",{parentName:"p"},"id"),", but before it, we are using the ",(0,i.kt)("inlineCode",{parentName:"p"},"@Param()")," decorator.\nThis decorator instructs Nest to look for the variable name passed into it and\nbind it to the argument."),(0,i.kt)("p",null,"Since parameters coming in from the URL are all strings, we can use a mechanism\nbuilt into Nest known as ",(0,i.kt)("a",{parentName:"p",href:"https://docs.nestjs.com/pipes"},"pipes")," to transform the\nvalue on the way in. Above, we use the ",(0,i.kt)("inlineCode",{parentName:"p"},"ParseIntPipe")," to convert the value to a\nnumber, which our service will need when looking up the mission."),(0,i.kt)("p",null,"Next, let's add a test that shows when we request a mission that doesn't exist,\nthe API should return a 404 not found error. We'll do so by passing in\nan id of 100 to the missions endpoint:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},'it("should throw 404 if single mission is not found", () => {\n  cy.api({\n    url: "/missions/100",\n    failOnStatusCode: false,\n  }).as("response");\n  cy.get("@response").its("status").should("equal", 404);\n});\n')),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},"By default, calls to ",(0,i.kt)("inlineCode",{parentName:"p"},"cy.api()")," will fail if they don't return a success\nstatus code in the 200 range. Above, we expect the code to be 404, so\nwe turn ",(0,i.kt)("inlineCode",{parentName:"p"},"failOnStatusCode")," to false in the options so it won't fail.")),(0,i.kt)("p",null,"If you run the test, you will see it currently fails. Even though we don't get a\nmission back, the status code is 200."),(0,i.kt)("p",null,"Nest provides a\n",(0,i.kt)("a",{parentName:"p",href:"https://docs.nestjs.com/exception-filters#built-in-http-exceptions"},"set of exceptions"),"\nthat we can throw in certain scenarios to return back appropriate status codes.\nOne of which is the ",(0,i.kt)("inlineCode",{parentName:"p"},"NotFoundException"),". We can throw this error anywhere in the app, and a global exception filter will catch it and return back a\nresponse with a 404 status code."),(0,i.kt)("p",null,"In the ",(0,i.kt)("inlineCode",{parentName:"p"},"MissionsService"),", we will check to see if we find a mission when we\nquery ArrayDB\u2122\ufe0f for it. If we don't, we'll throw a ",(0,i.kt)("inlineCode",{parentName:"p"},"NotFoundException")," and let\nNest handles the dirty work from there:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"get(id: number) {\n  const mission = this.missions.find((x) => x.id === id);\n  if (!mission) {\n    throw new NotFoundException();\n  }\n  return mission;\n}\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},(0,i.kt)("inlineCode",{parentName:"p"},"NotFoundException"),' is imported from "@nestjs/common"')),(0,i.kt)("h2",{id:"add-mission"},"Add Mission"),(0,i.kt)("p",null,"Next up, let's add new missions to the list. To add a mission, we will use the\n\"POST\" HTTP method to the missions endpoint, and set the request's body\nwith the new mission. We'll expect the result of the API request to be the new\nmission created."),(0,i.kt)("p",null,"Add the following test:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=missions.cy.ts",title:"missions.cy.ts"},'it("can add mission", () => {\n  const mission = {\n    description: "test mission",\n    complete: false,\n  };\n  cy.api("POST", "/missions", mission).as("response");\n  cy.get("@response").its("status").should("equal", 201);\n  cy.get("@response").its("body").should("include", mission);\n});\n')),(0,i.kt)("p",null,"The only thing we haven't seen above is passing the new mission as an\nobject to the third parameter of the ",(0,i.kt)("inlineCode",{parentName:"p"},"cy.api()")," method. The method will\nserialize the object as JSON and set it to the request's body, as well as set\nall the necessary headers."),(0,i.kt)("p",null,"Update the ",(0,i.kt)("inlineCode",{parentName:"p"},"MissionsService")," to include the ",(0,i.kt)("inlineCode",{parentName:"p"},"addMission")," method:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"add(mission: Mission) {\n  const newId = Math.max(...this.missions.map((x) => x.id)) + 1;\n  mission.id = newId;\n  this.missions.push(mission);\n  return mission;\n}\n")),(0,i.kt)("p",null,"Here, we take the new mission, and since ArrayDB\u2122\ufe0f doesn't have\nauto-incrementing ids, we need to calculate a new id on our own. After that, we\nuse the push method to add the new mission to the list and then return it."),(0,i.kt)("p",null,"Next, add the controller method:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=mission.controller.ts",title:"mission.controller.ts"},"@Post()\naddMission(@Body() mission: Mission) {\n  return this.missionsService.add(mission);\n}\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},'Post and Body are imported from "@nestjs/common"')),(0,i.kt)("p",null,"There are a couple of new things to note above. First, the ",(0,i.kt)("inlineCode",{parentName:"p"},"@Post()"),' decorator\nstates that this will be the method that will response to "POST" HTTP methods.'),(0,i.kt)("p",null,"Next is the new ",(0,i.kt)("inlineCode",{parentName:"p"},"@Body()")," decorator. This instructs Nest to take the contents\nfrom the body of the request and serialize it into the parameter it is attached\nto. Hence, the mission variable will contain the new mission to add."),(0,i.kt)("p",null,"Run the add mission test again, and you should see it pass with a 201 status\ncode, which represents a new entity created due to the request."),(0,i.kt)("h2",{id:"update--delete-missions"},"Update & Delete Missions"),(0,i.kt)("p",null,"Now that we are starting to get the hang of this let's bang out the last two\nmethods we are going to want: updating and deleting."),(0,i.kt)("p",null,"First, the tests:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=missions.cy.ts",title:"missions.cy.ts"},'it("should update mission", () => {\n  const mission = {\n    description: "get cat out of tree",\n    complete: true,\n  };\n  cy.api({\n    url: "/missions/1",\n    method: "PUT",\n    body: mission,\n  }).as("response");\n  cy.get("@response").its("status").should("equal", 200);\n  cy.get("@response").its("body").should("include", mission);\n});\n\nit("can delete mission", () => {\n  cy.api("DELETE", "/missions/1").as("response");\n  cy.get("@response").its("status").should("equal", 204);\n});\n')),(0,i.kt)("p",null,"The service code:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=missions.service.ts",title:"missions.service.ts"},"update(id: number, mission: Mission) {\n  mission.id = id;\n  this.missions = this.missions.map((x) => {\n    return x.id === id ? mission : x;\n  });\n  return this.get(id);\n}\n\ndelete(id: number) {\n  this.missions = this.missions.filter((x) => x.id !== id);\n}\n")),(0,i.kt)("p",null,"And the controller code:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=missions.controller.ts",title:"missions.controller.ts"},"@Put(':id')\nupdateMission(\n  @Param('id', ParseIntPipe) id: number,\n  @Body() mission: Mission,\n) {\n  return this.missionsService.update(id, mission);\n}\n\n@Delete(':id')\n@HttpCode(204)\ndelete(@Param('id', ParseIntPipe) id: number) {\n  this.missionsService.delete(id);\n}\n")),(0,i.kt)("blockquote",null,(0,i.kt)("p",{parentName:"blockquote"},'Put, Delete, and HttpCode are imported from "@nestjs/common"')),(0,i.kt)("p",null,"Pretty standard stuff that you've seen already. The ",(0,i.kt)("inlineCode",{parentName:"p"},"@Put()")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"@Delete()"),"\ndecorators make these methods listen for their respective HTTP methods."),(0,i.kt)("p",null,"The only new thing is the ",(0,i.kt)("inlineCode",{parentName:"p"},"@HttpCode()")," decorator on the ",(0,i.kt)("inlineCode",{parentName:"p"},"delete()"),' method. By\ndefault, Nest will return back a 200 status code for all HTTP methods except for\n"POST", which it will return 201 for. To change the default, use this decorator.\nIn our case, we are using status code 204, which means we are not returning any\ncontent, and that is to be expected. Notice how we are not returning anything\nfrom this method.'),(0,i.kt)("p",null,"The first time we run these tests, they will pass. However, on the next run, we will\nget some failures. This is because some tests expect the database\nto be in its default state, but we are now modifying it with the add, update,\nand delete methods."),(0,i.kt)("p",null,"It is best practice to not have one test reflect the outcomes of another test,\nbut that is exactly what we are doing currently. What can we do about it?"),(0,i.kt)("p",null,"One method is resetting the database into a known state before running each test.\nThis is often difficult to do, but we have that luxury because our database is so small. Let's see how we can accomplish that."))}u.isMDXComponent=!0}}]);