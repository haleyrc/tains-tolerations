---
author: "Ryan Haley"
date: "2016-06-16"
description: "Testing gorilla/mux endpoints with route variables"
tags: ["dev"]
title: "IAMADev - Gorilla Testing"
---

This is mostly just a convenient place for me to record this, since it's something
I will definitely need to do again and don't want to have to spend extra time
hunting for.

When writing tests for endpoints of a server, I had the need to test one endpoint
that contains route variables of the form:
```
  /users/{id}
```
I had just been using httptest.Server constructs, but that fails here because there
isn't a great way of getting the id set, so by default it just hit
```
  /users/
```
and returned all users. The fix is to break out the creation of the gorilla router
to a separate function called by the server's main function as well as the test,
that looks like:
```go
func Router() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/users", listUsers).Methods("GET")
	r.HandleFunc("/users/{id}", listUserByID).Methods("GET")
	return r
}
```
and then in the test:
```go
r, _:= http.NewRequest("GET", "/users/2", nil)
w := httptest.NewRecorder()
Router().ServeHTTP(w, r)
```
and then you can procede normally using the ResponseRecorder.

Source: [golang-nuts](https://groups.google.com/forum/#!topic/golang-nuts/Xs-Ho1feGyg)