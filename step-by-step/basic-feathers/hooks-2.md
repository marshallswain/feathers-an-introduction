# Hooks, part 2

If you have an archive of stock movements,
you cannot simply delete a stock item you no longer want to keep.
You will not be able to properly present history data if you do so.

The solution is to keep the data but mark it as deleted.
We can ignore the `deleted` flag when we know we are accessing historical, and possibly deleted, items.
Otherwise we want the application to act as if the item didn't exist.

We can implement such a **soft delete** with the `softDelete` hook.

## Working example

| Server source code: https://github.com/eddyystop/feathers-an-introduction/blob/master/examples/02/d/3.js

| Client HTML code: https://github.com/eddyystop/feathers-an-introduction/blob/master/examples/02/common/public/rest.html

| Client source code: https://github.com/eddyystop/feathers-an-introduction/blob/master/examples/02/common/public/feathers-app.js

| Start the server: `node ./examples/02/d/3`

| Point the browser at: `//localhost:3030/socketio.html`

## Using softDelete

We need to make just one change to our previous server example.
We use the `when` hook to run the `softDelete` hook if the service methid is not find.

```javascript
const { softDelete, setCreatedAt, setUpdatedAt, when, unless, remove } = commonHooks;
// ...

userService.before({
    all: when(hook => hook.method !== 'find', softDelete()),
    create: [ /* ... */ ]
});
```

## The results

The browser console displays

```text
created Jane Doe item
 Object {email: "jane.doe@gmail.com", role: "admin", createdAt: "2016-12-28T17:11:42.006Z", updatedAt: "2016-12-28T17:11:42.006Z", _id: "jcWgKJyCgkMdvFff"}
created John Doe item
 Object {email: "john.doe@gmail.com", role: "user", createdAt: "2016-12-28T17:11:42.763Z", updatedAt: "2016-12-28T17:11:42.763Z", _id: "pyDLAdhTWBEXDgMm"}
created Judy Doe item
 Object {email: "judy.doe@gmail.com", role: "user", createdAt: "2016-12-28T17:11:43.186Z", updatedAt: "2016-12-28T17:11:43.186Z", _id: "sczE6q1Y60XPAR76"}
created Jack Doe item
 Object {email: "jack.doe@gmail.com", role: "user", createdAt: "2016-12-28T17:11:43.510Z", updatedAt: "2016-12-28T17:11:43.511Z", _id: "rw5faDl0KZaqh3K0"}
deleted Jack Doe item
 Object
   id: "rw5faDl0KZaqh3K0"
   createdAt: "2016-12-28T17:11:43.510Z"
   deleted: true
   email: "jack.doe@gmail.com"
   role:"user"
   updatedAt: "2016-12-28T17:11:43.511Z"
find all items
 [Object, Object, Object, Object]
   0: Object
     _id: "jcWgKJyCgkMdvFff"
     createdAt: "2016-12-28T17:11:42.006Z"
     email: "jane.doe@gmail.com"
     password: "$2a$10$Bdy4uyxRO7iqpEQJrbVJCOefaeYazPYo86HNqNtSHhixMetN1xRta"
     role: "admin"
     updatedAt: "2016-12-28T17:11:42.006Z"
   1: Object
     _id: "pyDLAdhTWBEXDgMm"
     createdAt: "2016-12-28T17:11:42.763Z"
     email: "john.doe@gmail.com"
     password: "$2a$10$givjPRc3ZfYNCVYjtup8ZuwpjP28n6.OhpJiaAMg89y/lhlz5p1LG"
     role: "user"
     updatedAt: "2016-12-28T17:11:42.763Z"
   2: Object
     _id: "rw5faDl0KZaqh3K0"
     createdAt: "2016-12-28T17:11:43.510Z"
     deleted: true
     email: "jack.doe@gmail.com"
     password: "$2a$10$sHmDunPCU76hF.LdKYRo2OwopWCAftJCgayRH/mL5m4FcCUMUEv16"
     role: "user"
     updatedAt: "2016-12-28T17:11:43.511Z"
   3: Object
     _id: "sczE6q1Y60XPAR76"
     createdAt: "2016-12-28T17:11:43.186Z"
     email: "judy.doe@gmail.com"
     password: "$2a$10$IHTz519U8jxcPJUuKAr7ieuqN473vGD24.BbRGlA5jvHvdpu8QwQW"
     role: "user"
     updatedAt: "2016-12-28T17:11:43.186Z"
   length: 4
4 "items returned."
```

- The result returned when the Jack Doe item was deleted contains a `deleted: true`.
- The results returned for find also contain `deleted: true` for Jack Doe
because how how we conditioned the softDelete hook.
 