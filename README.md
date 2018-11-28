# Streamlio

## Running
================
### Requirements

* node 8+
* [yarn](https://yarnpkg.com/lang/en/docs/install/)

### Development

```
yarn install && yarn run dev
```

Application will be available at http://localhost:3030/

Mock API server is at http://35.186.225.106/api/v1

The default login credentials are:

```
Username: "admin",

Password: "streamlio"

Username: "butchershop"

Password: "streamlio"
```

### Deployment and Infrastructure

The development version of the application is running on an AWS Large Instance
using a generic Ubuntu image as the OS.

Deploy is handled by [CircleCI](https://circleci.com/) and [Dokku](https://github.com/dokku/dokku)

Dokku provides a Heroku-like environment with push-to-deploy functionality.

Circle CI is linked to Github. When any developer pushes or merges a branch
CircleCI automatically pulls that code and runs `yarn test` which runs any
jasmine tests. If the build passes all the tests (and the branch corresponds to
one of the following environments), CircleCI pushes the code to dokku which
deploys automatically.

The [`app.json`](http://dokku.viewdocs.io/dokku/advanced-usage/deployment-tasks/)
file is used to build the application upon deploy.

There are four environments:

- [dev](http://ec2-52-20-183-47.compute-1.amazonaws.com/dev)
- [test](http://ec2-52-20-183-47.compute-1.amazonaws.com/test)
- [production](http://ec2-52-20-183-47.compute-1.amazonaws.com/production)
- [sandbox](http://ec2-52-20-183-47.compute-1.amazonaws.com/sandbox)

Workflow is `dev` -> `test` -> `production`.

Pushing/merging to `master` will deploy in the `dev` environment. Pushing/merging to `test` or `production` will push to the environment of the same name.

`sandbox` is outside of this flow and is meant to test miscellaneous functionality. Any commits to the `sandbox` branch will force pushed to the `sandbox` environment.

General Application Note: When running in a sub-directory the ENV variable `PUBLIC_PATH` must be set and include a trailing slash (e.g. '/subdirectory/')

## General Ideas / Coding Conventions

* Use props as much as possible, use state sparingly. Props should flow from top-level scene components to child "dumb" components

* Prefer stateless function components.

* One default exported React component per file.

* Use React's state for ephemeral state that doesn't affect the app globally. For example, a toggle in some UI element.

* Components, classes and types should be Pascal case (FooBar), everything else (functions, variables etc.) camel case (fooBar).

* Similarly, file names for components and classes should be Pascal case, anything else should be kebab case (foo-bar)

* import statements must be alphabetized and grouped. See https://palantir.github.io/tslint/rules/ordered-imports/

* Import from the project root (i.e `import Component from "src/components"`) rather than relative to the file (i.e. `import Component from "../../../components"`).

* Stylesheet and test file live next to the files they style/test

* Testing via Jest

## Types

### General guidelines
* Types should live col-located to the code that uses it. Sometimes it's not possible since they
    have many dependants and they need to be placed in a shared file. Some examples:
    * Types for React Components should always live in the same file as the component
    * Types for a utility lib that implements some algorithm should live in the same file as the lib
    * Types that define interfaces for other to follows and commonly used types can live
        in their own file if there are many related types so that the total amount of types
        is greater than 2 or 3, as the last resource, you can define a `types.ts` in the most sensible location that makes sense

* The mental model for naming/using types should be something like:
    > Types are no different than any other entity in the code, like functions or constants. They serve the purpose of constraining the code for maintainability & error detection, but otherwise they should not be treated any different than other language constructs, think about it, would you create `functions.js` or a `classes.ts` file to put all your functions/classes in there?`

* Naming scheme is simple:
    * PascalCase (e.g. ComponentName) always
    * Most of the time they should be nouns and not verbs (but occasionally adjectives like `Comparable`)
    * Keep it simple, if you are typing an object that represents a dog, don't name it:
        * 'IDog'
        * 'DogType'
        * 'Quadruped'
      Just name it `Dog`
    * Remember that classes define both a type and a class, so name types like you would name classes.

* Always user `interface` as opposed to `type` except when you aren't allowed by the language

* Export the types if you expect it to be useful for others, but try to keep them not-exported by default

### More specific naming heuristics

For React components:

* Props: `[COMPONENT_NAME]Props`. InputProps, ErrorMessageProps, etc
* State: `[COMPONENT_NAME]State`. InputState, ErrorMessageState, etc. Should only be defined if the component has any state, otherwise just specify the props (`React.Components<Props>`)

For Higher-Order Components:

* Use this guide to understand how types work in the context of HoCs:
  https://dev.to/danhomola/react-higher-order-components-in-typescript-made-simple
* HoCs are sometimes more complex and require some other typings


## Architecture

### api/

Any API calls go here

### assets/

Non-code. Images, fonts, global styles

### components/

Reusable components. Anything that can appear in multiple areas throughout the application.

### scenes/

Analagous to "Pages" of a traditional website.

### store/

Instead of spliting the actions, action types, reducers and sagas in to separate folders, they're all located in the same sub folders here.

This is where the business logic lives.

### routes.ts

Everything to do with routing

### util/

Miscellaneous shared functions

### type.ts and definitions.ts

Types for typescript and definitions for JS libraries without TypeScript definitions

## Links

http://redux.js.org/

https://redux-saga.js.org/

https://facebook.github.io/jest/

https://github.com/aikoven/typescript-fsa

https://github.com/dphilipson/typescript-fsa-reducers

## Git Workflow

Based on [MojoTech Git Workflow](http://blog.mojotech.com/mojotech-git-workflow/)

### Branching

The master branch should be considered the "always working" branch and will be the main place feature branches are merged into when they have been code reviewed and approved.

Working with, merging, updating, and deleting branches is trivial, cheap and easy. As such, developers are encouraged to create branches at will as they work on various features, bugs, and tinkering. Feel free to create branches as often as desired, and work out of those feature branches in your normal daily workflow.

Developers should never directly commit to the master branch if possible. Instead, always follow the normal process of:
* Create a feature branch off of master
* Make changes to implement the feature
* Submit a new Pull Request for those changes
* Have those changes peer code reviewed
* After approval, merge the Pull Request into the master branch

### Naming

New feature branches typically should be created from an up-to-date master branch:

```
$ git checkout master
$ git pull
$ git checkout -b <new_branch_name>
```

To keep some form of consistency and legibility among open branches, developers should name their branches in the following format: <initials>/<short_description>.

Some examples follow:

```
$ git checkout -b bf/add-metrics-tracking
$ git checkout -b bf/fix-remember-me-input
$ git checkout -b bf/update-login-endpoint
```

This naming structure allows all developers to easily see which developer "owns" or created a particular branch, as well as gives general insight into what code changes live in that branch. Some developers also like to include the Pivotal Tracker ticket number in their branch name.

```
$ git checkout -b bf/add-reset-passwor-feature-12345
```

### Rebasing

As engineers work on a feature branch, changes from other developers will most likely be merged into the master branch during that time. Developers should get in the habit of semi-frequently pulling down the latest changes to origin/master to their local master branch, and then rebasing their feature branch off of the latest changes to stay up-to-date.

In simple terms, a git rebase master from a feature branch, will unwind the local commits made on the feature branch, update the root of the feature branch with the commits pulled down from master, and then re-apply the local commits from the feature branch on top.

### Commits

Git commits, like branches, are also cheap and easy to make. As such, developers should get into the habit of creating frequent commits along the way, instead of making one huge "big-bang commit" at the end of a feature's development cycle.

Git commits should be kept atomic, which means each commit should be self-contained, related, and fully-functional revolving around a single task or fix.

Git commit messages should contain a shorter, succinct first line, followed by a single blank line, then any additional supporting descriptive paragraphs as desired.

Here is an example of a single line commit message:

```
Update the ASSET_HOST environment variable
```

Here is an example of a more lengthy descriptive commit message:

```
Fix regression bug with Remember Me feature

There was a bug ticket filed here #TK134AFKR where a user was unable to "uncheck" the Remember Me checkbox on the login screen while.
```

### Pull Requests

Before submitting a PR, the developer should rebase their feature branch against master to get the current changes at the time.

All developers on the project should **actively** participate in peer code review of open Pull Requests. Developers are encouraged to leave specific comments and questions on changes, logic flow, business requirements, etc... related to the PR's code.

When code review is complete, and the developer team signs-off on approval of the code, and the code passes any required test suites, the PR request will be merged into the master branch, and the PR will be formally "closed" at that time.


### Jira integration

Jira and Git are linked, so that you can reference your Git commit with a Jira issue.  To do this, use the following format in your got cmmit message:

git commit -m "STREAM-313 update the readme with info about how to link the Git commit with a Jira issue."
git push origin <branchname> (edited)

The commit message will appear in the Development section of the issue on the, on the right side of the screen below the Assignee's, reporter, time estimates info.



